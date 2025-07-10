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

//get aggregated data for individual
export const getAttendanceIndividualSummary = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { student_number } = req.params

    //this is fine for now but add it as optional.
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
        const totalRecords = attendance.length
        const statusCounts = attendance.reduce((acc, record) => {
            const status = record?.status // Assuming `status` is a field in the Attendance model
            acc[status] = (acc[status] || 0) + 1
            return acc
        }, {} as Record<string, number>)

        const statusPercentages = Object.entries(statusCounts).map(([status, count]) => ({
            status,
            percentage: ((count / totalRecords) * 100).toFixed(2),
        }))

        res.status(200).json({ student_number, statusPercentages })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to obtain attendance" })
    }
}
