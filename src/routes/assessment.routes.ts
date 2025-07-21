import express, { Router } from "express"
import {
    createAssessment,
    createQuestions,
    createScores,
    getAllAssessmnets,
    getStudentAssessments,
    insertScoreBands,
} from "../controller/assessment.controller" //  named import

const router: Router = express.Router()

router.get("/", getAllAssessmnets)
router.get("/student/:id", getStudentAssessments)
router.post("/create", createAssessment)
router.post("/createQuestions", createQuestions)
router.post("/scores", createScores)
router.post("/score-bands", insertScoreBands)

export default router
