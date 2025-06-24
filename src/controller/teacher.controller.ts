import { Request, Response } from "express";
import { Op } from "sequelize";
import { Teacher } from "../models/teacher.model";
import {
  Courses,
  CourseSection,
  Enrollment,
  Student,
} from "../models/associations";

export const getAllTeachers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const teachers = await Teacher.findAll({});

    res.status(200).json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to obtain teachers" });
  }
};

export const getTeacherCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { teacher_id } = req.params;

  try {
    const teachers = await Teacher.findByPk(teacher_id, {
      include: [
        {
          model: CourseSection,
          as: "sections",
          include: [
            {
              model: Courses,
              as: "course",
            },
          ],
        },
      ],
    });

    res.status(200).json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to obtain courses" });
  }
};

export const getTeacherStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { section_id } = req.params;

  try {
    const students = await Enrollment.findAll({
      where: { sectionID: section_id },
      include: [
        {
          model: Student,
          as: "student",
        },
      ],
    });

    res.status(200).json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to obtain attendance" });
  }
};
