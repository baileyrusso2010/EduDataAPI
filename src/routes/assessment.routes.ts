import express, { Router } from "express"
import {
    createAssessment,
    createQuestions,
    createScores,
    getAllAssessmnets,
    insertScoreBands,
} from "../controller/assessment.controller" //  named import

const router: Router = express.Router()

router.get("/", getAllAssessmnets)
router.post("/create", createAssessment)
router.post("/createQuestions", createQuestions)
router.post("/scores", createScores)
router.post("/score-bands", insertScoreBands)

export default router
