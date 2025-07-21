import { Request, Response } from "express"
import { Op } from "sequelize"
import { School } from "../models/school.model"

export const getAllSchools = async (req: Request, res: Response): Promise<void> => {
    try {
        const schools = await School.findAll({})

        res.status(200).json(schools)
    } catch (error: any) {
        console.log("Error retrieving schools:", error.message)
        res.status(500).json({ message: "Error retrieving schools", error: error.message })
    }
}

export const getSchool = async (req: Request, res: Response): Promise<void> => {
    try {
        const schoolId = req.params.id
        const school = await School.findByPk(schoolId, {
            include: [
                {
                    association: "students",
                    attributes: [],
                },
            ],
            attributes: {
                include: [
                    [
                        // @ts-ignore
                        School.sequelize!.fn("COUNT", School.sequelize!.col("students.id")),
                        "totalStudents",
                    ],
                ],
            },
            group: ["School.id"],
        })

        if (!school) {
            res.status(404).json({ message: "School not found" })
            return
        }

        res.status(200).json(school)
    } catch (error: any) {
        console.log("Error retrieving school:", error.message)
        res.status(500).json({ message: "Error retrieving school", error: error.message })
    }
}
