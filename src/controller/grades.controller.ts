import { Request, Response } from "express"
import { Enrollment } from "../models/enrollment.model"
import { Section } from "../models/grading/sections.model"
import { Term } from "../models/associations"
import { Task } from "../models/associations"
import { Grade } from "../models/associations"
import { Course } from "../models/associations"
import { Op } from "sequelize"

//should make endpoint for individual classes
export const getStudentGrades = async (req: Request, res: Response): Promise<void> => {
    try {
        const { studentId } = req.params

        const enrollmentsWithGrades = await Enrollment.findAll({
            where: { student_id: studentId },
            include: [
                {
                    model: Section,
                    include: [Course],
                },
                {
                    model: Grade,
                    include: [Term, Task],
                },
            ],
        })

        res.status(200).send(enrollmentsWithGrades)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to obtain grades" })
    }
}

// Get student grade averages per quarter
export const getStudentQuarterAverages = async (req: Request, res: Response): Promise<void> => {
    try {
        const { studentId } = req.params
        // Find all enrollments for the student
        const enrollments = await Enrollment.findAll({
            where: { student_id: studentId },
            include: [
                {
                    model: Grade,
                    include: [{ model: Term }, { model: Task, where: { type: "Quarter" } }],
                },
            ],
        })
        // Collect all quarter grades
        let quarterGrades: { termName: string; score: number }[] = []
        enrollments.forEach((enrollment: any) => {
            ;(enrollment.Grades || []).forEach((grade: any) => {
                if (grade.Task && grade.Task.type === "Quarter" && grade.Term) {
                    quarterGrades.push({ termName: grade.Term.name, score: grade.score })
                }
            })
        })
        // Group by term name
        const termMap: Record<string, number[]> = {}
        quarterGrades.forEach(({ termName, score }) => {
            if (!termMap[termName]) termMap[termName] = []
            termMap[termName].push(score)
        })
        // Calculate averages
        const averages = Object.entries(termMap).map(([term, scores]) => ({
            term,
            average: scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null,
        }))
        res.status(200).json(averages)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to calculate quarter averages" })
    }
}
