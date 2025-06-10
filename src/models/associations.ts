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

// Define Associations

// Student and School
Student.belongsTo(School, { foreignKey: "school_id" })

// Student and Enrollment
Student.hasMany(Enrollment, {
    foreignKey: "studentID",
    sourceKey: "id",
    as: "enrollments",
})
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

// Export models (optional, if you want to import them from this file in other parts of your app)
export { Student, Teacher, Courses, CourseSection, Enrollment, School }
