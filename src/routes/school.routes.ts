import express, { Router } from "express"
import { getAllSchools, getSchool } from "../controller/school.controller"

const router: Router = express.Router()
router.get("/", getAllSchools)
router.get("/:id", getSchool)

export default router
