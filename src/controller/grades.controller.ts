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
