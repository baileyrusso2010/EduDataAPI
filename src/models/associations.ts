// models/index.ts (or associations.ts)
// This file sets up all relationships AFTER models are defined

// Import all your models
import { Student } from "./student.model"
import { Teacher } from "./teacher.model"
import { Courses } from "./courses/courses.model"
import { CourseSection } from "./courses/course_section.model"
import { Enrollment } from "./enrollment.model"
// Assuming you have a School model
import { School } from "./school.model" // Adjust path as needed
import { StudentTier } from "./mtss/student_tier.model"
import { Tier } from "./mtss/tier.model"
import { StudentIntervention } from "./mtss/student_interventions.mode"
import { Intervention } from "./mtss/interventions.model"
import { Attendance } from "./attendance.model"

// Define Associations

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

Enrollment.belongsTo(Student, {
    foreignKey: "studentID",
    targetKey: "id",
    as: "student",
})

// Courses and CourseSection
Courses.hasMany(CourseSection, {
    foreignKey: "courseID",
    sourceKey: "id",
    as: "sections",
})
CourseSection.belongsTo(Courses, {
    foreignKey: "courseID",
    targetKey: "id",
    as: "course",
})

// Teacher and CourseSection
Teacher.hasMany(CourseSection, {
    foreignKey: "teacher_id",
    sourceKey: "id",
    as: "sections",
})
CourseSection.belongsTo(Teacher, {
    foreignKey: "teacher_id",
    targetKey: "id",
    as: "teacher",
})

// CourseSection and Enrollment
CourseSection.hasMany(Enrollment, {
    foreignKey: "sectionID",
    sourceKey: "sectionID",
    as: "enrollments",
})
Enrollment.belongsTo(CourseSection, {
    foreignKey: "sectionID",
    targetKey: "sectionID",
    as: "courseSection",
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

// Export models (optional, if you want to import them from this file in other parts of your app)
export { Student, Teacher, Courses, CourseSection, Enrollment, School }
