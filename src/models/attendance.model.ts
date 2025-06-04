import { Model, DataTypes } from "sequelize"
import sequelize from "../database"
import { Student } from "./student.model"

export class Attendance extends Model {}

Attendance.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        school_year: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        course_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        term_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        period: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("present", "absent", "tardy"),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "attendance",
        timestamps: true,
    }
)

// Associations
Attendance.belongsTo(Student, { foreignKey: "student_id" })
Student.hasMany(Attendance, { foreignKey: "student_id" })
