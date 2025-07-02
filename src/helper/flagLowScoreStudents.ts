import { Op } from "sequelize"
import { Score } from "../models/associations"
import { StudentFlag } from "../models/student_flags.model"
import { Student } from "../models/associations"
import { Course } from "../models/associations"
import { Term } from "../models/associations"

//this is awesome feature, should implement behavior and other attributes later.
//automatic emails?
export async function flagLowScoreStudents(threshold = 65) {
    // 1. Find all score records below the threshold
    const lowScores = await Score.findAll({
        where: {
            score: { [Op.lt]: threshold },
        },
        include: [Student, Course, Term],
    })

    // Track which students are flagged now
    const flaggedStudentIds = new Set<number>()

    for (const score of lowScores) {
        const studentId = score.student_id
        flaggedStudentIds.add(studentId)

        const flagExists = await StudentFlag.findOne({
            where: {
                student_id: studentId,
                flag_type: "low_score",
                is_active: true,
            },
        })

        const reason = `Score ${score.score} in ${score.Course?.name || "course"} (${
            score.Term?.name || "term"
        })`

        // 2. Create a flag if one doesn't exist
        if (!flagExists) {
            await StudentFlag.create({
                student_id: studentId,
                flag_type: "low_score",
                flag_reason: reason,
                is_active: true,
                created_at: new Date(),
            })
        }
    }

    // 3. Resolve any old low_score flags for students who are now above the threshold
    const activeFlags = await StudentFlag.findAll({
        where: {
            flag_type: "low_score",
            is_active: true,
        },
    })

    for (const flag of activeFlags) {
        if (!flaggedStudentIds.has(flag.student_id)) {
            flag.is_active = false
            flag.resolved_at = new Date()
            await flag.save()
        }
    }

    console.log(`✅ Flagged ${flaggedStudentIds.size} students for low scores.`)
}
