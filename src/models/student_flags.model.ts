import { Model, DataTypes } from "sequelize"
import sequelize from "../database"
import { Student } from "./student.model"

export class Student_flags extends Model {
    declare id: number
    declare student_number: string
    declare iep: boolean
    declare section_504: boolean
    declare frl_eligible: boolean
}

Student_flags.init(
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
        iep: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        section_504: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        frl_eligible: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "student_flags",
        timestamps: true,
    }
)

Student_flags.belongsTo(Student, {
    foreignKey: "student_id",
    onDelete: "CASCADE",
})

Student.hasOne(Student_flags, {
    foreignKey: "student_id",
    as: "flags",
})
