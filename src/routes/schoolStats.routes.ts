import express, { Router } from "express"
import { getEthnicityCounts, getTotalEnrollments } from "../controller/schoolStats.controller"

const router: Router = express.Router()

router.get("/demographics", getEthnicityCounts)
router.get("/total-enrollments", getTotalEnrollments)

export default router
