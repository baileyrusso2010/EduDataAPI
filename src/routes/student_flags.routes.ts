import express, { Router } from "express"
import {
    addStudentFlag,
    endStudentFlag,
    getStudentFlag,
} from "../controller/student_flags.controller"

const router: Router = express.Router()

// Add a new flag to a student
router.post("/", addStudentFlag)
router.get("/:studentId", getStudentFlag)

// End (resolve) a flag for a student
router.put("/:flagId/end", endStudentFlag)

export default router
