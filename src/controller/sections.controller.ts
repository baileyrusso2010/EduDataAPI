import { Request, Response } from "express"
import { Op } from "sequelize"
import { Section } from "../models/grading/sections.model"

export const getSections = async (req: Request, res: Response): Promise<void> => {
    try {
        const sections = await Section.findAll()
        res.status(200).json(sections)
    } catch (error) {
        res.status(500).json({ message: "Error retrieving sections", error })
    }
}
