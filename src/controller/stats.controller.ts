import { Request, Response, NextFunction } from "express";
import { Student } from "../models/student.model";
import sequelize from "../database";
import { Enrollment } from "../models/enrollment.model";
import { Section } from "../models/grading/sections.model";
import { Course } from "../models/grading/course.model";
import { Department } from "../models/grading/department.model";
import { Grade } from "../models/grading/grade.model";
import { Term } from "../models/grading/term.model";
import { Task } from "../models/grading/task.model";
import { School } from "../models/school.model";
import { Attendance } from "../models/attendance.model";
import { BehaviorRecord } from "../models/behavior.model";
import { Teacher } from "../models/teacher.model";

// GET /api/grades/counts - All grade counts
// GET /api/grades/counts?school=2 - Grades for school ID 2
// GET /api/grades/counts?grade=11 - Grades for 11th graders
// GET /api/grades/counts?term=Q1 - Only Q1 grades
// GET /api/grades/counts?school=2&grade=11&term=Q1 - Q1 grades for 11th graders in

export const getGradeCounts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const school = req.query.school as string | undefined;
  const grade = req.query.grade as string | undefined;
  const term = req.query.term as string | undefined; // Q1, Q2, Q3, Q4, Interim, etc.

  try {
    let studentWhereClause: any = {};
    let termWhereClause: any = {};

    // Filter by school
    if (school !== undefined) {
      const schoolId = parseInt(school, 10);
      if (isNaN(schoolId)) {
        res.status(400).json({ error: "Invalid school id" });
        return;
      }
      studentWhereClause.school_id = schoolId;
    }

    // Filter by student grade level
    if (grade !== undefined) {
      studentWhereClause.grade = grade;
    }

    // Filter by term (quarter/interim)
    if (term !== undefined) {
      termWhereClause.name = term;
    }

    const gradeCounts = await Grade.findAll({
      attributes: [
        [sequelize.col("Term.name"), "term_name"],
        [sequelize.col("Task.type"), "task_type"],
        [sequelize.fn("COUNT", sequelize.col("Grade.id")), "count"],
        [sequelize.fn("AVG", sequelize.col("Grade.score")), "average_score"],
        [sequelize.fn("MIN", sequelize.col("Grade.score")), "min_score"],
        [sequelize.fn("MAX", sequelize.col("Grade.score")), "max_score"],
      ],
      include: [
        {
          model: Term,
          attributes: [],
          where: termWhereClause,
        },
        {
          model: Task,
          attributes: [],
        },
        {
          model: Enrollment,
          attributes: [],
          include: [
            {
              model: Student,
              attributes: [],
              where: studentWhereClause,
            },
          ],
        },
      ],
      group: ["Term.name", "Task.type"],
      order: [
        [sequelize.col("Term.name"), "ASC"],
        [sequelize.col("Task.type"), "ASC"],
      ],
      raw: true,
    });

    res.status(200).json({ data: gradeCounts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve grade counts" });
  }
};

export const getTotalEnrollments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const school = req.query.school as string | undefined;

  try {
    let whereClause = undefined;
    if (school !== undefined) {
      const schoolId = parseInt(school, 10);
      if (isNaN(schoolId)) {
        res.status(400).json({ error: "Invalid school id" });
        return;
      }
      whereClause = { school_id: schoolId };
    }
    const totalEnrollments = await Student.count({ where: whereClause });
    res.status(200).json({ totalEnrollments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to obtain total enrollments" });
  }
};

export const getEthnicityCounts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { school, grade } = req.query;

    const whereClause: any = {};
    if (school) {
      whereClause.school_id = school;
    }
    if (grade) {
      whereClause.grade = grade;
    }

    const ethnicityCounts = await Student.findAll({
      attributes: [
        "ethnicity",
        [sequelize.fn("COUNT", sequelize.col("ethnicity")), "count"],
      ],
      where: whereClause,
      group: ["ethnicity"],
    });
    res.status(200).json({ data: ethnicityCounts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve students" });
  }
};

export const getSchoolPerformance = async (
  req: Request,
  res: Response
): Promise<void> => {
  const schoolId = req.query.school as string | undefined;

  try {
    let whereClause: any = {};
    if (schoolId !== undefined) {
      const parsedSchoolId = parseInt(schoolId, 10);
      if (isNaN(parsedSchoolId)) {
        res.status(400).json({ error: "Invalid school id" });
        return;
      }
      whereClause.id = parsedSchoolId;
    }

    const schoolPerformance = await School.findAll({
      attributes: [
        "id",
        "name",
        // Count total students
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM students
            WHERE students.school_id = "School"."id"
          )`),
          "total_students",
        ],
        // Calculate attendance rate
        [
          sequelize.literal(`(
            SELECT CAST(
              (COUNT(CASE WHEN status = 'present' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0))
              AS DECIMAL(5,2)
            )
            FROM attendance
            INNER JOIN students ON attendance.student_id = students.id
            WHERE students.school_id = "School"."id"
          )`),
          "attendance_rate",
        ],
        // Count behavior incidents
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM behavior_records
            INNER JOIN students ON behavior_records.student_id = students.id
            WHERE students.school_id = "School"."id"
          )`),
          "behavior_incidents",
        ],
        // Count teachers (sections with unique teacher_id)
        [
          sequelize.literal(`(
            SELECT COUNT(DISTINCT section.teacher_id)
            FROM section
            INNER JOIN enrollments ON enrollments.section_id = section.id
            INNER JOIN students ON enrollments.student_id = students.id
            WHERE students.school_id = "School"."id"
          )`),
          "teacher_count",
        ],
        // Average current grade
        [
          sequelize.literal(`(
            SELECT CAST(AVG(grades.score) AS DECIMAL(5,2))
            FROM grades
            INNER JOIN enrollments ON grades.enrollment_id = enrollments.id
            INNER JOIN students ON enrollments.student_id = students.id
            INNER JOIN terms ON grades.term_id = terms.id
            WHERE students.school_id = "School"."id"
            AND terms.name IN ('Q4', 'Current')
          )`),
          "average_current_grade",
        ],
      ],
      where: whereClause,
      raw: true,
    });

    res.status(200).json({ data: schoolPerformance });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to retrieve school performance data" });
  }
};
