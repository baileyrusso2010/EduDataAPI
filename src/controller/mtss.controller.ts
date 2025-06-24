import { Request, Response } from "express";
import { Op } from "sequelize";
import { Student } from "../models/student.model";
import { Tier } from "../models/mtss/tier.model";
import { StudentTier } from "../models/mtss/student_tier.model";
import { Intervention } from "../models/mtss/interventions.model";
import { StudentIntervention } from "../models/mtss/student_interventions.mode";
import { Attendance } from "../models/attendance.model";
import sequelize from "sequelize";

export const getStudentsInTier = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tierNum } = req.params;

    const students = await Student.findAll({
      include: [
        {
          model: StudentTier,
          as: "student_tier",
          where: { tierID: tierNum }, //gets specific tier
        },
      ],
    });

    res.status(200).send(students);
  } catch (e) {
    res.status(500).json({ error: "Error Obtaining students tier" });
  }
};

//really an insert to new tier
export const assignTierAndIntervention = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { studentId, tierId, notes, name, focus_area, frequency } = req.body;

    //end old tier auto
    await StudentTier.update(
      { end_date: new Date() },
      {
        where: {
          studentId,
          end_date: null, //only open tiers
        },
      }
    );

    await StudentTier.create({
      studentId: studentId,
      tierId: tierId,
      assigned_date: new Date(), //might need to pass in
      notes: notes,
    });

    const newIntervention = await Intervention.create({
      studentId,
      name,
      focus_area,
      tier_level: tierId,
      frequency,
      description: notes,
    });

    await StudentIntervention.create({
      studentId,
      interventionId: newIntervention.id,
      start_date: new Date(),
      end_date: null,
      assigned_by: "System", // assumes req.user is set by auth middleware
      notes,
    });

    res.status(200).json({ message: "Student tier Inserted successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Error Inserting Student Tier" });
  }
};

export const editNotesField = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { studentId, notes } = req.body;

    await StudentTier.update(
      { notes },
      {
        where: {
          studentId,
          end_date: null, //only open tiers
        },
      }
    );
    res.status(200).json({ message: "Notes Updated" });
  } catch (e) {
    res.status(500).json({ error: "Error Updating Student Tier" });
  }
};

export const createAndAssignIntervention = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      studentId,
      name,
      focus_area,
      tier_level,
      frequency,
      description,
      notes,
    } = req.body;
    const intervention = await Intervention.create({
      name,
      focus_area,
      tier_level,
      frequency,
      description,
    });

    // 2. Assign the intervention to the student
    await StudentIntervention.create({
      studentId,
      interventionId: intervention.id,
      start_date: new Date(),
      end_date: null,
      assigned_by: "Random", // assumes req.user is set by auth middleware
      notes,
    });

    res.status(200).json({ message: "Intervention Created" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error creating intervention" });
  }
};
