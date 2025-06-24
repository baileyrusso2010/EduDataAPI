import express, { Router } from "express";
import {
  getAttendanceIndividual,
  getAttendanceIndividualData,
} from "../controller/attendance.controller";

const router: Router = express.Router();

router.get("/:student_number", getAttendanceIndividual);
router.get("/data/:student_number", getAttendanceIndividualData);

export default router;
