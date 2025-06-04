import { Request, Response } from "express"
import { Attendance } from "../models/attendance.model"
import { Op } from "sequelize"

//postgres materialized views
export const getAttendanceIndividual = async (req: Request, res: Response): Promise<void> => {
    const { student_number } = req.params

    try {
        const today = new Date()
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(today.getDate() - 30)

        const attendance = await Attendance.findAll({
            where: {
                student_id: student_number,
                date: {
                    [Op.between]: [thirtyDaysAgo, today],
                },
            },
        })

        res.status(200).json({ student_number, attendance })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to obtain attendance" })
    }
}
