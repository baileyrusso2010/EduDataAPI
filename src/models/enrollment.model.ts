// models/enrollment.model.ts
import { Model, DataTypes } from "sequelize"
import sequelize from "../database" // Adjust path as needed

// ENROLLMENT
export class Enrollment extends Model {
    public id!: number
    public student_id!: number
    public section_id!: number
    public enrollment_start_date!: Date
    public enrollment_end_date!: Date | null
    public enrollment_start_status!: string
    public enrollment_end_status!: string
}

Enrollment.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        student_id: { type: DataTypes.INTEGER, allowNull: false },
        section_id: { type: DataTypes.INTEGER, allowNull: false },
        enrollment_start_date: DataTypes.DATEONLY,
        enrollment_end_date: DataTypes.DATEONLY,
        enrollment_start_status: DataTypes.STRING,
        enrollment_end_status: DataTypes.STRING,
    },
    { sequelize, tableName: "enrollments", timestamps: false }
)
