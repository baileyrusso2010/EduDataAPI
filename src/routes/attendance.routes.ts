import express, { Router } from "express"
import { getAttendanceIndividual } from "../controller/attendance.controller"

const router: Router = express.Router()

router.get("/:student_number", getAttendanceIndividual)

export default router
