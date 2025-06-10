import { Request, Response } from "express"
import { Student } from "../models/student.model"
import { Student_flags } from "../models/student_flags.model"
import { AssessmentResult } from "../models/assessments/assessment_result.model"
import { Assessment } from "../models/assessments/assessment.model"
import { BehaviorRecord } from "../models/behavior.model"
import { GradeBook } from "../models/grade_book.model"

export const getProfile = async (req: Request, res: Response): Promise<void> => {
    const { student_number } = req.params

    try {
        const student = await Student.findOne({
            where: { student_number },
            include: [
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
                    attributes: ["term_name", "task", "department_name", "course_name", "score"],
                },
            ],
        })

        if (!student) {
            res.status(404).json({ error: "Student not found" })
            return
        }

        res.status(200).json({
            id: student.id,
            name: `${student.first_name} ${student.last_name}`,
            student_number: student.student_number,
            email: student.email,
            grade: student.grade,
            assessments: student.AssessmentResults?.map((result) => ({
                assessmentName: result.assessment?.test_name,
                standardized: result.assessment?.standardized,
                score: result.final_score,
                questions: result.questions,
            })),
            behavior: student.behaviors,
            flags: student.flags,
            grade_book: student.grade_book,
        })
    } catch (err) {
        console.error("Error loading profile:", err)
        res.status(500).json({ error: "Server error" })
    }
}
