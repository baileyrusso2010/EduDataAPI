import express, { Router } from "express"

import { getDataWithFilters } from "../controller/data.controller"

const router: Router = express.Router()

router.post("/", getDataWithFilters)

export default router
