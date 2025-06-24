import { Request, Response, NextFunction } from "express"
import { Assessment } from "../models/assessments/assessment.model"
import { AssessmentResult } from "../models/assessments/assessment_result.model"
import { ScoreBand } from "../models/score_band.model"
import { Student } from "../models/student.model"

export const getAllAssessmnets = async (req: Request, res: Response): Promise<void> => {
    try {
        const results = await Assessment.findAll({})

        res.status(200).send(results)
    } catch (e) {
        res.status(500).json({ error: "Failed to create assessment" })
    }
}

export const createAssessment = async (req: Request, res: Response): Promise<void> => {
    const { test_name, standardized } = req.body

    try {
        const assessment = await Assessment.create({ test_name, standardized })

        res.status(201).json(assessment)
    } catch (err) {
        res.status(500).json({ error: "Failed to create assessment" })
    }
}

export const addResults = async (req: Request, res: Response): Promise<void> => {
    const { id: assessment_id } = req.params
    const { student_id, final_score, questions } = req.body

    try {
        const result = await AssessmentResult.create({
            assessment_id,
            student_id,
            final_score,
            questions,
        })

        res.status(201).json(result)
    } catch (err) {
        res.status(500).json({ error: "Failed to add assessment results" })
    }
}

export const getAssessmentWithResults = async (req: Request, res: Response): Promise<void> => {
    try {
        const { student_id } = req.params

        const student = await Student.findByPk(student_id)

        if (!student) {
            res.status(404).json({ message: "Student not found" })
            return
        }
        type AssessmentResultWithAssessment = AssessmentResult & {
            assessment: {
                test_name: string
            }
        }
        // Fetch the results
        const results = (await AssessmentResult.findAll({
            where: { student_id: student.id },
            include: [
                {
                    model: Assessment,
                    as: "assessment",
                    attributes: ["test_name"],
                },
            ],
            attributes: ["final_score", "questions", "createdAt"],
            order: [["createdAt", "DESC"]],
        })) as AssessmentResultWithAssessment[] // 👈 cast here

        res.json({
            student: student,
            assessments: results.map((r) => ({
                assessmentName: r.assessment.test_name,
                resPercent: r.final_score,
                questions: r.questions,
            })),
        })
    } catch (err) {
        res.status(500).json({ error: "Failed to add assessment results" })
    }
}

export const uploadAssessmentData = async (req: Request, res: Response): Promise<void> => {
    const assessment_id = req.body.assessment_id
    const results = req.body.results

    try {
        const assessment = await Assessment.findOne({
            where: { id: assessment_id },
        })

        const skipped: string[] = []

        for (let dt of results) {
            const student_id = dt.person_id
            const finalScore = dt.final_score
            let testData = dt.result_data

            if (!student_id) {
                skipped.push(student_id)
                continue
            }

            const student = await Student.findByPk(student_id)

            if (!student) {
                skipped.push(student_id)
                continue
            }

            if (student) {
                await AssessmentResult.create({
                    student_id: student.id,
                    assessment_id: assessment?.id,
                    final_score: finalScore,
                    questions: testData, // this is assumed to be a JSONB column
                })
            }
        }

        //display on front end, studnets missing
        res.status(200).json({
            message: "Upload complete.",
            skippedStudents: skipped,
        })
    } catch (e) {
        res.status(500).json({ error: "Internal server error" })
    }
}

export const getAssessmentWithStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const { student_id } = req.params

        const student = await Student.findByPk(student_id)

        if (!student) {
            res.status(404).json({ message: "Student not found" })
            return
        }
        type AssessmentResultWithAssessment = AssessmentResult & {
            assessment: {
                test_name: string
            }
        }
        // Fetch the results
        const results = (await AssessmentResult.findAll({
            where: { student_id: student.id },
            include: [
                {
                    model: Assessment,
                    as: "assessment",
                    attributes: ["test_name"],
                },
            ],
            attributes: ["final_score", "questions", "createdAt"],
            order: [["createdAt", "DESC"]],
        })) as AssessmentResultWithAssessment[] // 👈 cast here

        const allAssessmentResults = await Assessment.findByPk(1, {
            include: [
                {
                    model: AssessmentResult,
                },
            ],
        })

        // Print only the dataValues for all AssessmentResults
        const assessmentResults = allAssessmentResults?.dataValues.AssessmentResults || []
        const dataValuesArray = assessmentResults.map((result: any) => result.dataValues)

        let map = new Map()
        for (let dt of dataValuesArray) {
            for (let qs of dt.questions) {
                if (qs.question_id == null) map.set(qs.question_id, qs.scores)
                else map.set(qs.question_id, map.get(qs.question_id) + qs.score)
            }
        }

        res.json({
            student: student,
            assessments: results.map((r) => ({
                assessmentName: r.assessment.test_name,
                resPercent: r.final_score,
                questions: r.questions,
            })),
            // questionAverages: averages,
        })
    } catch (e) {
        res.status(500).json({ error: "Failed to add assessment results" })
    }
}
