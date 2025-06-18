import express, { Router } from "express"
import { assignStudentToTier, createAndAssignIntervention } from "../controller/mtss.controller"

const router: Router = express.Router()

router.post("/student-tier", assignStudentToTier)
router.post("/student-intervention", createAndAssignIntervention)

export default router
