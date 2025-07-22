import express, { Router } from "express"
import { getBehaviorCountDay, getBehaviorRecords } from "../controller/behavior.controller"

const router: Router = express.Router()

router.get("/", getBehaviorRecords)
router.get("/count/day", getBehaviorCountDay)

export default router
