import express, { Router } from "express"
import {
    createAssessment,
    createQuestions,
    createScores,
    getAllAssessmnets,
} from "../controller/assessment.controller" //  named import

const router: Router = express.Router()

router.get("/", getAllAssessmnets)
router.post("/create", createAssessment)
router.post("/createQuestions", createQuestions)
router.post("/scores", createScores)

export default router
