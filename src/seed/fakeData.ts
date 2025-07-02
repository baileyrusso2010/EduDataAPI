import { faker } from "@faker-js/faker"
import { School } from "../models/school.model"
import { Teacher } from "../models/teacher.model"
import { Course, Department, Enrollment, Grade, Task, Term } from "../models/associations"
import { Student } from "../models/associations"
import { School_year } from "../models/school_year.model"
import sequelize from "../database"
import { Section } from "../models/grading/sections.model"

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

// Function to generate random school years
async function generateSchoolYears(): Promise<School_year[]> {
    const schoolYears: School_year[] = []
    console.log("Generating School Years...")
    const startYears = [2024, 2025, 2026] // Example start years for school years

    for (const startYear of startYears) {
        const endYear = startYear + 1
        const schoolYear = await School_year.create({
            start_date: new Date(`${startYear}-08-01`), // August 1st of start year
            end_date: new Date(`${endYear}-05-31`), // May 31st of end year
            year_name: `${startYear}-${endYear}`,
            active: false, // or set to true if appropriate
        })
        schoolYears.push(schoolYear)
    }

    console.log(`Generated ${schoolYears.length} School Years.`)
    return schoolYears
}

async function generateTeachers(schools: School[]): Promise<Teacher[]> {
    const teachers: Teacher[] = []
    console.log("Generating Teachers...")
    for (const school of schools) {
        // Teachers are generated per school for quantity, but not directly linked here
        for (let i = 0; i < 5; i++) {
            const firstName = faker.person.firstName()
            const lastName = faker.person.lastName()
            const teacher = await Teacher.create({
                person_id: faker.string.numeric(8), // Generate an 8-digit number
                name: `${firstName} ${lastName}`,
                email: faker.internet.email({
                    firstName,
                    lastName,
                    provider: "school.edu",
                }),
            })
            teachers.push(teacher)
        }
    }
    console.log(`Generated ${teachers.length} Teachers.`)
    return teachers
}

async function generateStudents(schools: School[]): Promise<Student[]> {
    const students: Student[] = []
    console.log("Generating Students...")
    for (const school of schools) {
        for (let i = 0; i < 20; i++) {
            const firstName = faker.person.firstName()
            const lastName = faker.person.lastName()
            const student = await Student.create({
                student_number: faker.string.numeric(8), // Unique student number
                first_name: firstName,
                last_name: lastName,
                grade: faker.helpers.arrayElement(["9", "10", "11", "12"]), // High school grades
                email: faker.internet.email({
                    firstName,
                    lastName,
                    provider: "student.edu",
                }),
                ethnicity: faker.helpers.arrayElement([
                    "White",
                    "Black",
                    "Asian",
                    "Hispanic",
                    "Mixed",
                    "Other",
                ]),
                school_id: school.id,
            })
            students.push(student)
        }
    }
    console.log(`Generated ${students.length} Students.`)
    return students
}

async function generateSchools(): Promise<School[]> {
    const schools: School[] = []
    console.log("Generating Schools...")
    for (let i = 0; i < 3; i++) {
        const school = await School.create({
            id: i,
            name: faker.company.name() + " High School",
        })
        schools.push(school)
    }
    console.log(`Generated ${schools.length} Schools.`)
    return schools
}

// async function generateFlags(students: Student[]): Promise<void> {
//     try {
//         for (const student of students) {
//             await Student_flags.create({
//                 student_id: student.id,
//                 iep: faker.datatype.boolean(),
//                 section_504: faker.datatype.boolean(),
//                 frl_eligible: faker.datatype.boolean(),
//             })
//         }

//         console.log("Generated flags")
//     } catch (e: any) {
//         console.error("Error generating flag records:", e.message)
//     }
// }

export async function generateFakeScoresData(
    teachers: Teacher[],
    students: Student[],
    count: number = 50
) {
    const year = await School_year.create({
        year_name: "2024-2025",
        start_date: new Date("2024-08-01"),
        end_date: new Date("2025-06-01"),
        active: true,
    })

    const departments = await Department.bulkCreate(
        [{ name: "Math" }, { name: "Science" }, { name: "Social Studies" }, { name: "English" }],
        { ignoreDuplicates: true, returning: true }
    )

    const courses = await Promise.all(
        departments.map((dept) =>
            Course.create({
                name: `${faker.word.words(2)} ${faker.helpers.arrayElement([
                    "101",
                    "Intro",
                    "Advanced",
                ])}`,
                department_id: dept.id,
            })
        )
    )

    const sections = await Promise.all(
        courses.map((course) =>
            Section.create({
                course_id: course.id,
                teacher_id: faker.helpers.arrayElement(teachers).id,
                period: faker.number.int({ min: 1, max: 8 }).toString(),
                section_number: String(faker.number.int({ min: 1, max: 8 })),
            })
        )
    )

    const terms = await Term.bulkCreate(
        [
            { name: "Q1", school_year: "2024-2025" },
            { name: "Q2", school_year: "2024-2025" },
            { name: "Q3", school_year: "2024-2025" },
            { name: "Q4", school_year: "2024-2025" },
        ],
        { returning: true }
    )

    const tasks = await Task.bulkCreate(
        [
            { name: "Quarter", type: "Quarter" },
            { name: "Interim", type: "Interim" },
            { name: "Final Grade", type: "Final Grade" },
        ],
        { returning: true }
    )

    for (const student of students) {
        for (let i = 0; i < count; i++) {
            const section = faker.helpers.arrayElement(sections)
            const enrollment = await Enrollment.create({
                student_id: student.id,
                section_id: section.id,
                enrollment_start_date: new Date("2024-09-01"),
                enrollment_end_date: new Date("2025-06-01"),
                enrollment_start_status: "Active",
                enrollment_end_status: "Enrolled",
            })

            await Grade.create({
                enrollment_id: enrollment.id,
                term_id: faker.helpers.arrayElement(terms).id,
                task_id: faker.helpers.arrayElement(tasks).id,
                score: faker.number.float({ min: 55, max: 100 }),
            })
        }
    }

    console.log(`✅ Inserted ${students.length * count} grades for ${students.length} students.`)
}

export async function generateFakeData() {
    const schools = await generateSchools()
    await generateSchoolYears()
    const teachers = await generateTeachers(schools) // Teachers are linked to sections, not directly to schools
    const students = await generateStudents(schools)
    // await generateFlags(students)
    await generateFakeScoresData(teachers, students)
}
