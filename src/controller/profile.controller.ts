import { Request, Response } from "express"
import { Student } from "../models/student.model"
import { Attendance } from "../models/attendance.model"
import { Assessment } from "../models/assessments/assessment.model"
import { BehaviorRecord } from "../models/behavior.model"
import { StudentTier } from "../models/mtss/student_tier.model"
import { Tier } from "../models/mtss/tier.model"
import { StudentIntervention } from "../models/mtss/student_interventions.mode"
import { Intervention } from "../models/mtss/interventions.model"
import { Final_Score } from "../models/assessments/final_score.model"
import { Grade } from "../models/grading/grade.model"
import { Course, Enrollment, Task, Term } from "../models/associations"
import { Section } from "../models/grading/sections.model"

//profile should only consist of student main info

export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const studentId = req.params.id

        const student = await Student.findByPk(studentId, {})

        res.status(200).send(student)
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

// export const getProfile = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const studentId = req.params.id

//         // Fetch student with associated data
//         const student = await Student.findByPk(studentId, {
//             include: [
//                 {
//                     model: StudentTier,
//                     where: { end_date: null },
//                     required: false,
//                     include: [Tier],
//                 },
//                 {
//                     model: StudentIntervention,
//                     where: { end_date: null },
//                     required: false,
//                     include: [Intervention],
//                 },
//                 {
//                     model: BehaviorRecord,
//                     as: "behaviors",
//                     attributes: [
//                         "staff_name",
//                         "resolution",
//                         "incident_datetime",
//                         "location",
//                         "description",
//                     ],
//                 },
//                 {
//                     model: Attendance,
//                     as: "Attendances",
//                     attributes: ["date", "status"],
//                 },
//             ],
//         })

//         if (!student) {
//             res.status(404).json({ error: "Student not found" })
//             return
//         }

//         const enrollmentsWithGrades = await Enrollment.findAll({
//             where: { student_id: studentId },
//             include: [
//                 {
//                     model: Section,
//                     include: [Course],
//                 },
//                 {
//                     model: Grade,
//                     include: [Term, Task],
//                 },
//             ],
//         })

//         // ✅ Format Grades
//         const grades = enrollmentsWithGrades.flatMap((enrollment) =>
//             enrollment.Grades?.map((grade) => ({
//                 course: enrollment.Section?.Course?.name || "Unknown Course",
//                 section_id: enrollment.section_id,
//                 term: grade.Term?.name || "N/A",
//                 task: grade.Task?.type || "N/A",
//                 score: grade.score,
//             }))
//         )

//         const validScores = grades.map((g) => g?.score).filter((score) => typeof score === "number")

//         const averageScore =
//             validScores.length > 0
//                 ? validScores.reduce((sum, s) => sum + (s ?? 0), 0) / validScores.length
//                 : null

//         // Attendance calculation
//         const totalAttendance = student.Attendances?.length || 0
//         const presentCount =
//             student.Attendances?.filter((record) => record.status === "present").length || 0
//         const presentPercentage = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0

//         delete student.Attendances

//         // Get Final Scores + Assessments
//         const finalScores = await Final_Score.findAll({
//             where: { student_id: studentId },
//             include: [
//                 {
//                     model: Assessment,
//                     attributes: ["id", "test_name"],
//                 },
//             ],
//         })

//         // Map final scores to assessments, using stored score
//         const assessments = finalScores.map((fs) => ({
//             id: fs.assessment_id,
//             title: fs.Assessment?.test_name || "Untitled",
//             score: fs.score_value !== null ? fs.score_value : "N/A",
//         }))

//         res.status(200).json({
//             ...student.toJSON(),
//             attendance: {
//                 presentPercentage: presentPercentage.toFixed(2),
//             },
//             behavior: student.behaviors,
//             grades: grades,
//             final_score: averageScore,
//             // currentTier: student.StudentTiers?.[0]?.Tier || null,
//             // activeInterventions:
//             //     student.StudentInterventions?.map((si) => ({
//             //         ...si.Intervention?.dataValues,
//             //         start_date: si.start_date,
//             //         end_date: si.end_date,
//             //     })) || [],
//             assessments,
//         })
//     } catch (e) {
//         console.error(e)
//         res.status(500).json({ error: "Internal Server Error" })
//     }
// }
