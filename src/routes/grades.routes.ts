import express, { Router } from "express"

import { getStudentGrades } from "../controller/grades.controller"

const router: Router = express.Router()

router.get("/:studentId", getStudentGrades)

export default router
