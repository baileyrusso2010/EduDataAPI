// models/enrollment.model.ts
import { Model, DataTypes } from "sequelize";
import sequelize from "../database"; // Adjust path as needed
import { Student } from "./student.model"; // Adjust path as needed
import { CourseSection } from "./courses/course_section.model"; // Adjust path as needed
import { School_year } from "./school_year.model";

export class Enrollment extends Model {}

Enrollment.init(
  {
    enrollmentID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studentID: {
      // Foreign Key to Student
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "students", // Must match the tableName of your Student model
        key: "id", // References the 'id' primary key of the Student table
      },
    },
    sectionID: {
      // Foreign Key to CourseSection
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "course_sections", // Must match the tableName of your CourseSection model
        key: "sectionID", // References the 'sectionID' primary key of the Course_Sections table
      },
    },
    school_year_id: {
      // Foreign Key to CourseSection
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "school_year", // Must match the tableName of your CourseSection model
        key: "id", // References the 'sectionID' primary key of the Course_Sections table
      },
    },
  },
  {
    sequelize,
    tableName: "enrollments", // Recommended: Plural, consistent
    timestamps: true,
  }
);
