import express, { Router } from "express"
import { getAssessmentWithResults, uploadAssessmentData } from "../controller/assessment.controller" //  named import

const router: Router = express.Router()

router.post("/upload", uploadAssessmentData)
router.get("/:student_number", getAssessmentWithResults)

export default router
