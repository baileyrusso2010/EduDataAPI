import express, { Router } from "express"
import {
	assignTierAndIntervention,
	createAndAssignIntervention,
} from "../controller/mtss.controller"

const router: Router = express.Router()

router.post("/student-tier", assignTierAndIntervention)
router.post("/student-intervention", createAndAssignIntervention)

export default router
