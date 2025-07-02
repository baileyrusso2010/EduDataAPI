import express, { Router } from "express"
import { getSections } from "../controller/sections.controller"

const router: Router = express.Router()

router.get("/", getSections)

export default router
