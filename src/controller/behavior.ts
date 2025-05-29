import { Router, Request, Response } from "express"
import { faker } from "@faker-js/faker"

const router = Router()

router.get("/", async (req: Request, res: Response) => {
    try {
        const { race, grade, school_id } = req.query

        const filters = {
            race: race as string | undefined,
            grade: grade ? parseInt(grade as string, 10) : undefined,
            school_id: school_id ? parseInt(school_id as string, 10) : undefined,
        }

        const records = await getBehaviorRecords(filters)
        res.json(records)
    } catch (error) {
        console.error("Error in behavior route:", error)
        res.status(500).json({ error: "Failed to retrieve behavior records" })
    }
})

interface Filters {
    race?: string
    grade?: number
    school_id?: number
}

interface BehaviorRecord {
    id: number
    studentName: string
    race: string
    grade: number
    school_id: number
    incident: string
    date: string
}

const RACES = ["White", "Black", "Hispanic", "Asian", "Other"]
const GRADES = [6, 7, 8, 9, 10, 11, 12]
const SCHOOL_IDS = [1, 2, 3]

export async function getBehaviorRecords(filters: Filters): Promise<BehaviorRecord[]> {
    const data: BehaviorRecord[] = []

    for (let i = 0; i < 500; i++) {
        const race = faker.helpers.arrayElement(RACES)
        const grade = faker.helpers.arrayElement(GRADES)
        const school_id = faker.helpers.arrayElement(SCHOOL_IDS)

        data.push({
            id: i + 1,
            studentName: faker.person.fullName(),
            race,
            grade,
            school_id,
            incident: faker.lorem.sentence(),
            date: faker.date.recent({ days: 30 }).toISOString(),
        })
    }

    return data.filter((record) => {
        return (
            (!filters.race || record.race === filters.race) &&
            (!filters.grade || record.grade === filters.grade) &&
            (!filters.school_id || record.school_id === filters.school_id)
        )
    })
}

export default router
