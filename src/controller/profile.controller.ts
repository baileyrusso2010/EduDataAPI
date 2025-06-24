import { Request, Response } from "express";
import { Student } from "../models/student.model";
import { Attendance } from "../models/attendance.model";
import { Student_flags } from "../models/student_flags.model";
import { AssessmentResult } from "../models/assessments/assessment_result.model";
import { Assessment } from "../models/assessments/assessment.model";
import { BehaviorRecord } from "../models/behavior.model";
import { GradeBook } from "../models/grade_book.model";
import { StudentTier } from "../models/mtss/student_tier.model";
import { Tier } from "../models/mtss/tier.model";
import { StudentIntervention } from "../models/mtss/student_interventions.mode";
import { Intervention } from "../models/mtss/interventions.model";

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const studentId = req.params.id;

    const student = await Student.findByPk(studentId, {
      include: [
        {
          model: StudentTier,
          where: { end_date: null },
          required: false,
          include: [Tier],
        },
        {
          model: StudentIntervention,
          where: { end_date: null },
          required: false,
          include: [Intervention],
        },
        {
          model: AssessmentResult,
          include: [
            {
              model: Assessment,
              as: "assessment",
              attributes: ["test_name", "standardized"],
            },
          ],
        },
        {
          model: BehaviorRecord,
          as: "behaviors",
          attributes: [
            "staff_name",
            "resolution",
            "incident_datetime",
            "location",
            "description",
          ],
        },
        {
          model: Student_flags,
          as: "flags",
          attributes: ["iep", "section_504", "frl_eligible"],
        },
        {
          model: GradeBook,
          as: "grade_book",
          attributes: [
            "term_name",
            "task",
            "department_name",
            "course_name",
            "score",
          ],
        },
        {
          model: Attendance,
          as: "Attendances",
          attributes: ["date", "status"],
        },
      ],
    });

    if (!student) {
      res.status(404).json({ error: "Student not found" });
      return;
    }

    const totalAttendance = student.Attendances?.length || 0;
    const presentCount =
      student.Attendances?.filter((record) => record.status === "present")
        .length || 0;

    const presentPercentage =
      totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;

    res.status(200).json({
      ...student.toJSON(),
      attendance: {
        presentPercentage: presentPercentage.toFixed(2),
      },
      assessments: student.AssessmentResults?.map((result) => ({
        assessmentName: result.assessment?.test_name,
        standardized: result.assessment?.standardized,
        score: result.final_score,
        questions: result.questions,
      })),
      behavior: student.behaviors,
      flags: student.flags,
      grade_book: student.grade_book,
      currentTier: student.StudentTiers?.[0]?.Tier || null,
      activeInterventions:
        student.StudentInterventions?.map((si) => ({
          ...si.Intervention?.dataValues,
          start_date: si.start_date,
          end_date: si.end_date,
        })) || [],
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal Server error" });
  }
};
