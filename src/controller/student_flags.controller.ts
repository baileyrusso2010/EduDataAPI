import { Request, Response } from "express"
import { StudentFlag } from "../models/student_flags.model"

export const getStudentFlag = async (req: Request, res: Response): Promise<void> => {
    try {
        const { studentId } = req.params
        const flags = await StudentFlag.findAll({
            where: { student_id: studentId, is_active: true },
            order: [["created_at", "DESC"]],
        })

        if (flags.length === 0) {
            res.status(404).json({ message: "No active flags found for this student" })
            return
        }

        res.status(200).json(flags)
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

// Add a new flag to a student
export const addStudentFlag = async (req: Request, res: Response): Promise<void> => {
    try {
        const { student_id, flag_type, flag_reason } = req.body
        const flag = await StudentFlag.create({
            student_id,
            flag_type,
            flag_reason: flag_reason || null,
            is_active: true,
            created_at: new Date(),
            resolved_at: null,
        })
        res.status(201).json(flag)
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

// End (resolve) a flag for a student
export const endStudentFlag = async (req: Request, res: Response): Promise<void> => {
    try {
        const { flagId } = req.params
        const flag = await StudentFlag.findByPk(flagId)
        if (!flag) {
            res.status(404).json({ error: "Flag not found" })
            return
        }
        flag.is_active = false
        flag.resolved_at = new Date()
        await flag.save()
        res.status(200).json(flag)
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}
