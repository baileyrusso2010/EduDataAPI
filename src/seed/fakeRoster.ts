// seed/fakeRoster.ts
import { faker } from "@faker-js/faker"
import { Student } from "../models/student.model"
import { School } from "../models/school.model"
import { Attendance } from "../models/attendance.model"
import { BehaviorRecord } from "../models/behavior.model"
import sequelize from "../database"

async function generateFakeData() {
    await sequelize.sync({ force: true })

    const schools = await Promise.all([
        School.create({ id: 101, name: "Lincoln Middle" }),
        School.create({ id: 102, name: "Roosevelt High" }),
        School.create({ id: 103, name: "Jefferson Elementary" }),
    ])

    for (let i = 0; i < 100; i++) {
        const school = faker.helpers.arrayElement(schools)

        await Student.create({
            student_number: faker.string.numeric(6),
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            grade: faker.helpers.arrayElement(["6", "7", "8", "9", "10"]),
            email: faker.internet.email(),
            ethnicity: faker.helpers.arrayElement([
                "White",
                "Black or African American",
                "Asian",
                "Hispanic",
                "Native American",
                "Two or More Races",
            ]),
            school_id: school.id,
        })
    }

    console.log("✅ Fake data seeded!")
    await sequelize.close()
}

async function generateFakeAttendance() {
    for (const student of await Student.findAll()) {
        const date = faker.date.recent({ days: 10 }) // a random date in past 10 days

        for (let period = 1; period <= 6; period++) {
            await Attendance.create({
                student_id: student.id,
                date,
                period: `Period ${period}`,
                status: faker.helpers.arrayElement(["present", "absent", "tardy"]),
            })
        }
    }
}

async function generateFakeBehavior() {
    for (let i = 0; i < 50; i++) {
        const student = await Student.findOne({ order: sequelize.random() })

        if (student) {
            await BehaviorRecord.create({
                student_id: student.id,
                staff_name: faker.person.fullName(),
                incident_datetime: faker.date.recent({ days: 30 }),
                location: faker.helpers.arrayElement([
                    "Classroom",
                    "Hallway",
                    "Cafeteria",
                    "Gym",
                    "Bus",
                ]),
                resolution: faker.helpers.arrayElement([
                    "Parent contacted",
                    "In-school suspension",
                    "Lunch detention",
                    "Warning issued",
                ]),
                description: faker.lorem.sentence(),
            })
        }
    }
}

import { Assessment } from "../models/assessment.model"
import { AssessmentResult } from "../models/assessment_result.model"
import { ScoreBand } from "../models/score_band.model"

/**
 * Creates a new assessment and generates fake results for each student.
 *
 * @param name The name of the assessment (e.g. "NWEA Math Fall 2024")
 * @param questionCount Number of questions in the assessment
 * @param standardized Whether this test is standardized
 */
async function createAssessmentWithResults(
    name: string,
    questionCount: number,
    standardized: boolean
) {
    const students = await Student.findAll()

    // Create the assessment
    const assessment = await Assessment.create({
        test_name: name,
        standardized,
    })

    // Generate results for each student
    for (const student of students) {
        let finalScore = 0

        const questions = Array.from({ length: questionCount }, () => {
            const maxPoints = faker.number.int({ min: 5, max: 10 })
            const earnedPoints = faker.number.int({ min: 0, max: maxPoints })

            finalScore += earnedPoints

            return {
                question: faker.lorem.sentence(),
                maxPoints,
                earnedPoints,
            }
        })

        await AssessmentResult.create({
            student_id: student.id,
            assessment_id: assessment.id,
            final_score: finalScore,
            questions,
        })
    }

    console.log(`✅ Created assessment "${name}" with ${students.length} student results.`)
}

async function createBandScores() {
    const assessmentId = 1
    const bands = [
        {
            assessment_id: assessmentId,
            label: "Below Benchmark",
            min_score: 0,
            max_score: 40,
            color: "#e74c3c", // red
        },
        {
            assessment_id: assessmentId,
            label: "Approaching",
            min_score: 41,
            max_score: 69,
            color: "#f1c40f", // yellow
        },
        {
            assessment_id: assessmentId,
            label: "On Track",
            min_score: 70,
            max_score: 100,
            color: "#2ecc71", // green
        },
    ]

    await ScoreBand.bulkCreate(bands)
}

//export generate fake data
export {
    generateFakeData,
    generateFakeAttendance,
    generateFakeBehavior,
    createAssessmentWithResults,
    createBandScores,
}
