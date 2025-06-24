import express, { Router } from "express"
import {
    createAssessment,
    getAllAssessmnets,
    getAssessmentWithResults,
    getAssessmentWithStats,
    uploadAssessmentData,
} from "../controller/assessment.controller" //  named import

const router: Router = express.Router()

router.get("/", getAllAssessmnets)
router.post("/upload", uploadAssessmentData)
router.get("/results/:student_id", getAssessmentWithResults)
router.get("/results/stat/:student_id", getAssessmentWithStats)
router.post("/create", createAssessment)

export default router
