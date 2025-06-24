import express, { Router } from "express";
import { getBehaviorRecords } from "../controller/behavior.controller";

const router: Router = express.Router();

router.get("/", getBehaviorRecords);

export default router;
