import { Request, Response, NextFunction } from "express"
import { Assessment } from "../models/assessment.model"
import { AssessmentResult } from "../models/assessment_result.model"
import { ScoreBand } from "../models/score_band.model"
import { Student } from "../models/student.model"

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
        const { student_number } = req.params

        const student = await Student.findOne({
            where: { student_number },
        })

        console.log(student)

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
    const data = req.body

    const skipped: string[] = []

    try {
        for (const entry of data) {
            const { studentUid, testName, resPercent, questions } = entry

            // 1. Find student (skip if not found or invalid)
            if (!studentUid) {
                skipped.push("Invalid student ID")
                continue
            }
            const student = await Student.findOne({ where: { student_number: studentUid } })
            if (!student) {
                skipped.push(studentUid)
                continue
            }

            // 2. Find or create assessment
            const assessment = await Assessment.create({
                test_name: testName,
            })

            // 3. Create assessment result (embed questions directly)
            if (student) {
                const result = await AssessmentResult.create({
                    student_id: student.id,
                    assessment_id: assessment.id,
                    final_score: resPercent,
                    questions, // this is assumed to be a JSONB column
                })
            }
        }

        res.status(200).json({
            message: "Upload complete.",
            skippedStudents: skipped,
        })
    } catch (error) {
        console.error("Assessment upload failed:", error)
        res.status(500).json({ error: "Internal server error" })
    }
}
