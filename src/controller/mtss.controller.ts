import { Request, Response } from "express"
import { Op } from "sequelize"
import { Student } from "../models/student.model"
import { Tier } from "../models/mtss/tier.model"
import { StudentTier } from "../models/mtss/student_tier.model"
import { Intervention } from "../models/mtss/interventions.model"
import { StudentIntervention } from "../models/mtss/student_interventions.mode"
import sequelize from "sequelize"
import { O } from "@faker-js/faker/dist/airline-BUL6NtOJ"

export const getStudentsInTier = async (req: Request, res: Response): Promise<void> => {
    try {
        const { tierNum } = req.params

        const students = await Student.findAll({
            include: [
                {
                    model: StudentTier,
                    as: "student_tier",
                    where: { tierID: tierNum }, //gets specific tier
                },
            ],
        })

        res.status(200).send(students)
    } catch (e) {
        res.status(500).json({ error: "Error Obtaining students tier" })
    }
}

export const createTier = async (req: Request, res: Response): Promise<void> => {
    try {
        const { studentId, tierId, assignedDate } = req.body

        if (!studentId || !tierId) {
            res.status(400).json({ error: "Missing studentId or tierId" })
            return
        }

        await StudentTier.create({
            studentId: studentId,
            tierId: tierId,
            assigned_date: assignedDate,
        })

        //might need to send to update it
        res.status(201).send({ message: "Tier assigned success" })
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: "Error Obtaining students tier" })
    }
}

export const updateTier = async (req: Request, res: Response): Promise<void> => {
    try {
        const { end_date } = req.body
        const { tierId } = req.params

        if (!tierId || !end_date) {
            res.status(400).json({ error: "Missing tierId or endDate" })
            return
        }

        const updated = await StudentTier.update(
            { end_date: end_date },
            {
                where: {
                    id: tierId,
                },
            }
        )

        if (updated[0] === 0) {
            res.status(404).json({ error: "Tier not found" })

            return
        }

        //every one will start at tier 1
        //need logic automatically enroll them in new tier after ended

        res.status(200).send({ message: "Updated Tier" })
    } catch (e) {
        res.status(500).json({ error: "Error Obtaining students tier" })
    }
}

export const deleteTier = async (req: Request, res: Response): Promise<void> => {
    try {
        const { tierId } = req.params

        let deleted = await StudentTier.destroy({
            where: {
                id: tierId,
            },
        })

        if (deleted === 0) {
            res.status(404).send({ error: "Tier not found" })
            return
        }

        res.status(200).send({ message: "Deleted tier" })
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: "Error Inserting Student Tier" })
    }
}

//really an insert to new tier
export const assignTierAndIntervention = async (req: Request, res: Response): Promise<void> => {
    try {
        const { studentId, tier_level, notes, name, focus_area, frequency } = req.body

        //this will end old tier, but could cause problems if they want more than one tier?
        await StudentTier.update(
            { end_date: new Date() },
            {
                where: {
                    studentId,
                    end_date: null, //only open tiers
                },
            }
        )

        let student_tier = await StudentTier.create({
            studentId: studentId,
            tierId: tier_level,
            assigned_date: new Date(), //might need to pass in
            notes: notes,
        })

        const newIntervention = await Intervention.create({
            studentId,
            name,
            focus_area,
            frequency,
            description: notes,
            student_tier_id: student_tier.id,
        })

        await StudentIntervention.create({
            studentId,
            interventionId: newIntervention.id,
            start_date: new Date(),
            end_date: null,
            assigned_by: "System", // assumes req.user is set by auth middleware
            notes,
        })

        res.status(200).json({ message: "Student tier Inserted successfully" })
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: "Error Inserting Student Tier" })
    }
}

export const createIntervention = async (req: Request, res: Response): Promise<void> => {
    //look at transactions

    try {
        const { studentId, name, focus_area, student_tier_id, frequency, description, notes } =
            req.body

        if (!studentId || !student_tier_id) {
            res.status(400).json({ error: "Missing required fields" })
            return
        }
        const intervention = await Intervention.create({
            name,
            focus_area,
            frequency,
            description,
            student_tier_id,
        })

        // 2. Assign the intervention to the student
        await StudentIntervention.create({
            studentId,
            interventionId: intervention.id,
            start_date: new Date(),
            end_date: null,
            assigned_by: "Random", // assumes req.user is set by auth middleware
            notes,
        })

        res.status(201).json({ message: "Intervention Created" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error creating intervention" })
    }
}

export const deleteIntervention = async (req: Request, res: Response): Promise<void> => {
    try {
        const { interventionId } = req.params
        await Intervention.destroy({
            where: {
                id: interventionId,
            },
        })

        res.status(200).json({ message: "Intervention Deleted" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error creating intervention" })
    }
}

export const updateIntervention = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, focus_area, frequency, description } = req.body
        const { interventionId } = req.params

        //intervention should not changed tiers
        const [updated] = await Intervention.update(
            {
                name: name,
                focus_area: focus_area,
                frequency: frequency,
                description: description,
            },
            {
                where: {
                    id: interventionId,
                },
            }
        )

        if (updated === 0) {
            res.status(404).json({ error: "Intervention not found" })
            return
        }

        res.status(200).json({ message: "Intervention Updated" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error creating intervention" })
    }
}

export const getStudentInterventions = async (req: Request, res: Response): Promise<void> => {
    try {
        const studentId = req.params.studentId

        if (!studentId) {
            res.status(400).json({ error: "Invalid student ID" })
            return
        }

        const studentTiers = await StudentTier.findAll({
            where: {
                studentId,
            },
            include: [
                {
                    model: Tier,
                },
                {
                    model: Intervention,
                    as: "interventions",
                },
            ],
        })

        res.json(studentTiers)
    } catch (error) {
        console.error("Error fetching student interventions:", error)
        res.status(500).json({ error: "Failed to fetch student interventions" })
    }
}
