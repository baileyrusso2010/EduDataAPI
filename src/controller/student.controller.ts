import { Request, Response } from "express"
import { Op } from "sequelize"
import { Student } from "../models/student.model"

export const getStudent = async (req: Request, res: Response): Promise<void> => {

    const search = req.query.search as string || "";

    try{

        const students = await Student.findAll({
            where: {
              [Op.or]: [
                { last_name: { [Op.iLike]: `%${search}%` } },
                { first_name: { [Op.iLike]: `%${search}%` } },
                { student_number: { [Op.iLike]: `%${search}%` } },
              ],
            },
            limit: 10,
          });
        
        res.status(200).json(students)

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to obtain attendance" })
    }

}