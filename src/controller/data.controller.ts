import { Request, Response } from "express"
import { Op } from "sequelize"
import { School } from "../models/school.model"
import { Student } from "../models/student.model"

export const getDataWithFilters = async (req: Request, res: Response): Promise<void> => {
    const { grades } = req.body

    try {
        //get schools first, or filter them atleast
        const data = await School.findAll({
            include: [
                {
                    model: Student,
                    as: "students",
                    where: {
                        grade: { [Op.in]: grades },
                    },
                },
            ],
        })

        res.status(200).send("Working")
    } catch (e) {
        res.status(500).json({ error: "Failed to get data" })
    }
}
