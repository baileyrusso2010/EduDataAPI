import express, { Router } from "express";
import {
  getEthnicityCounts,
  getTotalEnrollments,
  getGradeCounts,
  getSchoolPerformance,
} from "../controller/stats.controller";

const router: Router = express.Router();

router.get("/ethnicity", getEthnicityCounts);
router.get("/enrollments", getTotalEnrollments);
router.get("/grade-scores", getGradeCounts);
router.get("/school-performance", getSchoolPerformance);

export default router;
