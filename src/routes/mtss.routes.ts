import express, { Router } from "express"
import {
    assignTierAndIntervention,
    createAndAssignIntervention,
    editNotesField,
} from "../controller/mtss.controller"

const router: Router = express.Router()

router.post("/student-tier", assignTierAndIntervention)
router.post("/student-intervention", createAndAssignIntervention)
router.put("/notes", editNotesField)

export default router
