import express, { Router } from "express"
import {
    assignTierAndIntervention,
    createAndAssignIntervention,
    getStudent,
} from "../controller/mtss.controller"

const router: Router = express.Router()

router.get("/student/:id", getStudent)
router.post("/student-tier", assignTierAndIntervention)
router.post("/student-intervention", createAndAssignIntervention)

export default router
