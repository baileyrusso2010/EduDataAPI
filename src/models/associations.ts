// models/index.ts (or associations.ts)
// This file sets up all relationships AFTER models are defined

// Import all your models
import { Student } from "./student.model"
import { Teacher } from "./teacher.model"
import { Enrollment } from "./enrollment.model"
// Assuming you have a School model
import { School } from "./school.model" // Adjust path as needed
import { StudentTier } from "./mtss/student_tier.model"
import { Tier } from "./mtss/tier.model"
import { StudentIntervention } from "./mtss/student_interventions.mode"
import { Intervention } from "./mtss/interventions.model"
import { Attendance } from "./attendance.model"
import { Assessment } from "./assessments/assessment.model"
import { Questions } from "./assessments/questions.model"
import { Student_Answers } from "./assessments/student_answers"
import { Final_Score } from "./assessments/final_score.model"
import { Staff } from "./staff.model"
import { School_year } from "./school_year.model"
import { StaffSchool } from "./staff_school.model"
import { Course } from "./grading/course.model"
import { Department } from "./grading/department.model"
import { Score } from "./grading/score.model"
import { Term } from "./grading/term.model"
import { Task } from "./grading/task.model"
import { ScoreBand } from "./score_band.model"

StaffSchool.belongsTo(Staff, { foreignKey: "staffId", targetKey: "personID" })
StaffSchool.belongsTo(School, { foreignKey: "SchoolId", targetKey: "id" })

Staff.hasMany(StaffSchool, { foreignKey: "staffId", sourceKey: "personID" })
School_year.hasMany(StaffSchool, { foreignKey: "SchoolId", sourceKey: "id" })

// Student and School
Student.belongsTo(School, { foreignKey: "school_id" })
School.hasMany(Student, { foreignKey: "school_id", as: "students" })

// Student and Enrollment
Student.hasMany(Enrollment, {
    foreignKey: "studentID",
    sourceKey: "id",
    as: "enrollments",
})

// Associations
Attendance.belongsTo(Student, { foreignKey: "student_id" })
Student.hasMany(Attendance, { foreignKey: "student_id", as: "Attendances" })

//Assessments
Assessment.hasMany(Questions, {
    foreignKey: "assessment_id",
    as: "questions",
})

Questions.belongsTo(Assessment, {
    foreignKey: "assessment_id",
    as: "assessment",
})

Questions.hasMany(Student_Answers, {
    foreignKey: "question_id",
    as: "answers",
})

Student_Answers.belongsTo(Questions, {
    foreignKey: "question_id",
    as: "question",
})

Student.hasMany(Student_Answers, {
    foreignKey: "student_id",
    as: "answers",
})

Student_Answers.belongsTo(Student, {
    foreignKey: "student_id",
    as: "student",
})

Final_Score.belongsTo(Student, { foreignKey: "student_id" })
Final_Score.belongsTo(Assessment, { foreignKey: "assessment_id" })
Student.hasMany(Final_Score, { foreignKey: "student_id" })
Assessment.hasMany(Final_Score, { foreignKey: "assessment_id" })

//end of assessments

Enrollment.belongsTo(Student, {
    foreignKey: "studentID",
    targetKey: "id",
    as: "student",
})

// 🔗 Associations
StudentTier.belongsTo(Student, { foreignKey: "studentId" })
Student.hasMany(StudentTier, { foreignKey: "studentId" })

StudentTier.belongsTo(Tier, { foreignKey: "tierId" })
Tier.hasMany(StudentTier, { foreignKey: "tierId" })

Intervention.hasMany(StudentIntervention, { foreignKey: "interventionId" })
StudentIntervention.belongsTo(Intervention, { foreignKey: "interventionId" })

// If you have a Student model:
StudentIntervention.belongsTo(Student, { foreignKey: "studentId" })
Student.hasMany(StudentIntervention, { foreignKey: "studentId" })

//score band
ScoreBand.belongsTo(Assessment, { foreignKey: "assessment_id" })
Assessment.hasMany(ScoreBand, { foreignKey: "assessment_id" })

// Associations
Course.belongsTo(Department, { foreignKey: "department_id" })
Department.hasMany(Course, { foreignKey: "department_id" })

Score.belongsTo(Course, { foreignKey: "course_id" })
Score.belongsTo(Task, { foreignKey: "task_id" })
Score.belongsTo(Term, { foreignKey: "term_id" })
Score.belongsTo(Student, { foreignKey: "student_id" }) // ✅ You need this

Student.hasMany(Score, { foreignKey: "student_id" })
Course.hasMany(Score, { foreignKey: "course_id" })
Task.hasMany(Score, { foreignKey: "task_id" })
Term.hasMany(Score, { foreignKey: "term_id" })

// Export models (optional, if you want to import them from this file in other parts of your app)
export { Student, Teacher, Enrollment, School, Score, Course, Department, Term, Task }
