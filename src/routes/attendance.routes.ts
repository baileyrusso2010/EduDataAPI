import express, { Router } from "express"
import {
    getAttendanceIndividual,
    getAttendanceIndividualSummary,
} from "../controller/attendance.controller"

const router: Router = express.Router()

router.get("/stats/:student_number", getAttendanceIndividual)
router.get("/summary/:student_number", getAttendanceIndividualSummary)

export default router
