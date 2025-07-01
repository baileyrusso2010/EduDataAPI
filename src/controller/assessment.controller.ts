import { Request, Response, NextFunction } from "express"
import { Assessment } from "../models/assessments/assessment.model"
import { ScoreBand } from "../models/score_band.model"
import { Student } from "../models/student.model"
import { Questions } from "../models/assessments/questions.model"
import { Student_Answers } from "../models/assessments/student_answers"

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

        // Fetch all questions for this assessment
        const questions = await Questions.findAll({
            where: { assessment_id },
        })

        if (!questions.length) {
            res.status(404).json({ message: "No questions found for assessment" })
            return
        }

        // Build question_num to id map
        const questionMap: Record<string, number> = {}
        for (const q of questions) {
            questionMap[`question_${q.question_num}`] = q.id
        }

        const recordsToInsert = []

        for (const row of scores) {
            const { student_id, answers } = row
            for (const [key, value] of Object.entries(answers)) {
                const question_id = questionMap[key]
                if (!question_id) continue // skip invalid keys

                recordsToInsert.push({
                    student_id,
                    question_id,
                    assessment_id,
                    score_value: String(value),
                })
            }
        }

        // Insert all answers
        await Student_Answers.bulkCreate(recordsToInsert)

        res.status(200).json({
            message: "Scores imported successfully",
            inserted: recordsToInsert.length,
        })
        return
    } catch (err) {
        console.error("Error importing scores:", err)
        res.status(500).json({ message: "Server error" })
        return
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
