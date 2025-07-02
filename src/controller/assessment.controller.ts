import { Request, Response, NextFunction } from "express"
import { Assessment } from "../models/assessments/assessment.model"
import { ScoreBand } from "../models/score_band.model"
import { Student } from "../models/student.model"
import { Questions } from "../models/assessments/questions.model"
import { Student_Answers } from "../models/assessments/student_answers"
import { Final_Score } from "../models/assessments/final_score.model"

export const getAllAssessmnets = async (req: Request, res: Response): Promise<void> => {
    try {
        const results = await Assessment.findAll({})

        res.status(200).send(results)
    } catch (e) {
        res.status(500).json({ error: "Failed to create assessment" })
    }
}

export const createAssessment = async (req: Request, res: Response): Promise<void> => {
    const { test_name, standardized, date, assessment_type } = req.body

    try {
        const assessment = await Assessment.create({
            test_name,
            standardized,
            date,
            assessment_type,
        })

        res.status(201).json(assessment)
    } catch (err) {
        res.status(500).json({ error: "Failed to create assessment" })
    }
}
export const createScores = async (req: Request, res: Response): Promise<void> => {
    try {
        const { assessment_id, scores } = req.body

        if (!assessment_id || !Array.isArray(scores)) {
            res.status(400).json({ message: "Invalid request format" })
            return
        }

        const questions = await Questions.findAll({ where: { assessment_id } })
        if (!questions.length) {
            res.status(404).json({ message: "No questions found for assessment" })
            return
        }

        const questionMap: Record<string, number> = {}
        for (const q of questions) {
            questionMap[`question_${q.question_num}`] = q.id
        }

        const recordsToInsert: any[] = []
        const finalScoreInserts: any[] = []
        const failedStudents: Set<number> = new Set()

        for (const row of scores) {
            const { student_id, answers, final_scores } = row
            let hasAnswer = false

            for (const [key, value] of Object.entries(answers)) {
                const question_id = questionMap[key]
                if (!question_id) continue

                recordsToInsert.push({
                    student_id,
                    question_id,
                    assessment_id,
                    score_value: String(value),
                })
                hasAnswer = true
            }

            if (Array.isArray(final_scores) && final_scores.length > 0) {
                for (const final of final_scores) {
                    if (!final.score_type || final.score_value == null) continue

                    finalScoreInserts.push({
                        student_id,
                        assessment_id,
                        score_value: String(final.score_value),
                    })
                }
                hasAnswer = true
            }

            if (!hasAnswer) {
                failedStudents.add(student_id)
            }
        }

        // Insert answers
        let answersInserted = 0
        if (recordsToInsert.length > 0) {
            try {
                const inserted = await Student_Answers.bulkCreate(recordsToInsert, {
                    ignoreDuplicates: true,
                })
                answersInserted = Array.isArray(inserted) ? inserted.length : recordsToInsert.length
            } catch (err) {
                for (const record of recordsToInsert) {
                    try {
                        await Student_Answers.create(record)
                        answersInserted++
                    } catch {
                        failedStudents.add(record.student_id)
                    }
                }
            }
        }

        // Insert final scores
        let finalScoresInserted = 0
        if (finalScoreInserts.length > 0) {
            await Promise.all(
                finalScoreInserts.map(async (score) => {
                    try {
                        await Final_Score.upsert(score)
                        finalScoresInserted++
                    } catch {
                        failedStudents.add(score.student_id)
                    }
                })
            )
        }

        res.status(200).json({
            message: "Scores imported successfully",
            answersInserted,
            finalScoresInserted,
            failedStudents: Array.from(failedStudents),
        })
    } catch (err) {
        console.error("Error importing scores:", err)
        res.status(500).json({ message: "Server error" })
    }
}

export const createQuestions = async (req: Request, res: Response): Promise<void> => {
    const { questions, assessment_id } = req.body
    console.log("In Create Questions")
    try {
        if (!Array.isArray(questions) || !assessment_id) {
            res.status(400).json({ message: "Invalid input format" })
            return
        }

        const prepared = questions.map((q) => ({
            question_num: q.question_num,
            text: q.text,
            subscore_type: q.subscore_type || null,
            category: q.category || null,
            assessment_id,
        }))

        const inserted = await Questions.bulkCreate(prepared)
        res.status(200).json({ message: "Questions imported successfully", inserted })
    } catch (e) {
        res.status(500).json({ error: "Failed to create assessment" })
    }
}

export const insertScoreBands = async (req: Request, res: Response): Promise<void> => {
    try {
        const { assessment_id, bands } = req.body

        if (!assessment_id || !Array.isArray(bands) || bands.length === 0) {
            res.status(400).json({ message: "Invalid request format" })
            return
        }

        // Optional: Delete existing bands to replace them
        await ScoreBand.destroy({
            where: {
                assessment_id,
            },
        })

        // Prepare new records
        const records = bands.map((band) => ({
            assessment_id,
            label: band.label,
            min_score: band.min_score,
            max_score: band.max_score,
            color: band.color_hex,
        }))

        await ScoreBand.bulkCreate(records)

        res.status(200).json({ message: "Score bands saved successfully", count: records.length })
    } catch (err) {
        console.error("Error saving score bands:", err)
        res.status(500).json({ message: "Server error" })
    }
}
