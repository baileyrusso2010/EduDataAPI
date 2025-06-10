// models/courses/course_section.model.ts
import { Model, DataTypes } from "sequelize"
import sequelize from "../../database" // Adjust path as needed
import { Enrollment } from "../enrollment.model" // Adjust path as needed
import { Courses } from "./courses.model" // Adjust path as needed
import { Teacher } from "../teacher.model" // Adjust path as needed

export class CourseSection extends Model {
    declare sectionID: number
    declare courseID: number
    declare teacher_id: number
    declare section: string
    declare period: string
    declare term: string
    declare school_year: string
}

CourseSection.init(
    {
        sectionID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        courseID: {
            // Foreign Key to Courses
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "courses", // Must match the tableName of your Courses model
                key: "id", // References the 'id' primary key of the Courses table
            },
        },
        teacher_id: {
            // Foreign Key to Teacher (renamed and typed correctly)
            type: DataTypes.INTEGER, // Must match the type of Teacher.id (INTEGER)
            allowNull: false,
            references: {
                model: "teachers", // Must match the tableName of your Teacher model
                key: "id", // References the 'id' primary key of the Teachers table
            },
        },
        section: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        period: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        term: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        school_year: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "course_sections", // Your chosen table name
        timestamps: false,
    }
)
