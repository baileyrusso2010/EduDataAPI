import express, { Router } from "express"
import {
    createAssessment,
    getAllAssessmnets,
    getAssessmentWithResults,
    uploadAssessmentData,
} from "../controller/assessment.controller" //  named import

const router: Router = express.Router()

router.get("/", getAllAssessmnets)
router.post("/upload", uploadAssessmentData)
router.get("/results/:student_number", getAssessmentWithResults)
router.post("/create", createAssessment)

export default router
