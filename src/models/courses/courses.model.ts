// models/courses/courses.model.ts
import { Model, DataTypes } from "sequelize"
import sequelize from "../../database" // Adjust path as needed
import { CourseSection } from "./course_section.model" // Assuming correct path

export class Courses extends Model {
    declare id: number
    declare course_name: string
    declare course_dept: string
}

Courses.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        course_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        course_dept: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "courses", // Your chosen table name
        timestamps: true,
    }
)
