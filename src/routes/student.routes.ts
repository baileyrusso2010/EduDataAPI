import express, { Router } from "express"
import { getStudent } from "../controller/student.controller"

const router: Router = express.Router()

router.get("/search", getStudent)


export default router

