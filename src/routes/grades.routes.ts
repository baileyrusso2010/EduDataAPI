import express, { Router } from "express"

import { getStudentGrades, getStudentQuarterAverages } from "../controller/grades.controller"

const router: Router = express.Router()

router.get("/:studentId/quarter-averages", getStudentQuarterAverages)
router.get("/:studentId", getStudentGrades)

export default router
