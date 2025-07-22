import { Model, DataTypes } from "sequelize"
import sequelize from "../database"
import { Student } from "./student.model"

export class StudentDemographic extends Model {
    public id!: number
    public student_id!: number
    public iep!: boolean
    public section_504!: boolean
    public poverty!: boolean
    // Add more fields as needed
}

StudentDemographic.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Student,
                key: "id",
            },
            unique: true,
        },
        iep: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        section_504: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        poverty: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        // Add more fields here as needed
    },
    {
        sequelize,
        tableName: "student_demographics",
        timestamps: false,
    }
)
