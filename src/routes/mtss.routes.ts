import express, { Router } from "express"
import {
    assignTierAndIntervention,
    createIntervention,
    createTier,
    deleteIntervention,
    deleteTier,
    getStudentInterventions,
    getTier,
    updateIntervention,
    updateTier,
} from "../controller/mtss.controller"

const router: Router = express.Router()

// router.post("/student-tier", assignTierAndIntervention)
// router.post("/student-intervention", createAndAssignIntervention)

router.get("/student-tiers/:studentId", getTier)
router.post("/student-tiers", createTier)
router.put("/student-tiers/:tierId", updateTier)
router.delete("/student-tiers/:tierId", deleteTier)

// Intervention Routes
router.get("/student-tiers/:studentId", () => {})
router.post("/student-interventions", createIntervention) // Create & assign intervention
router.put("/student-interventions/:interventionId", updateIntervention) // Update interventions for a student
router.delete("/student-interventions/:interventionId", deleteIntervention) // Remove interventions for a student

router.get("/students/:studentId/interventions", getStudentInterventions)

export default router
