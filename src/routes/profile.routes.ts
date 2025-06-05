import express, { Router } from "express"
import { getProfile } from "../controller/profile.controller"

const router: Router = express.Router()

router.get("/:student_number", getProfile)

export default router
