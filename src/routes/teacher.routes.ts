import express, { Router } from "express";
import {
  getAllTeachers,
  getTeacherCourses,
  getTeacherStudents,
} from "../controller/teacher.controller";

const router: Router = express.Router();

router.get("/", getAllTeachers);
router.get("/courses/:teacher_id", getTeacherCourses);
router.get("/students/:section_id", getTeacherStudents);

export default router;
