import { Request, Response, NextFunction } from "express"
import { Student } from "../models/student.model"

export const getTotalEnrollments = async (req: Request, res: Response): Promise<void> => {
    const school = req.query.school as string | undefined

    try {
        let whereClause = undefined
        if (school !== undefined) {
            const schoolId = parseInt(school, 10)
            if (isNaN(schoolId)) {
                res.status(400).json({ error: "Invalid school id" })
                return
            }
            whereClause = { school_id: schoolId }
        }
        const totalEnrollments = await Student.count({ where: whereClause })
        res.status(200).json({ totalEnrollments })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to obtain total enrollments" })
    }
}

export const getEthnicityCounts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { grade, school } = req.query

        const filter: any = {}
        if (grade) filter.grade = grade
        if (school) filter.school_id = school

        const ethnicityCounts = await Student.findAll({
            where: filter,
            attributes: [
                "ethnicity",
                [Student.sequelize!.fn("COUNT", Student.sequelize!.col("ethnicity")), "count"],
            ],
            group: ["ethnicity"],
        })

        res.json({ data: ethnicityCounts })
    } catch (error) {
        res.status(500).json({ error: "Failed to get assessment scores" })
    }
}
