import express, { Router } from "express"
import { getProfile } from "../controller/profile.controller"

const router: Router = express.Router()

router.get("/:id", getProfile)

export default router
