import express, { Router } from "express"
import { getAllTeachers, getTeacherStudents } from "../controller/teacher.controller"

const router: Router = express.Router()

router.get("/", getAllTeachers)
router.get("/students/:section_id", getTeacherStudents)

export default router
