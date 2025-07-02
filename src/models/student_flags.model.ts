import { Model, DataTypes } from "sequelize"
import sequelize from "../database"
import { Student } from "./student.model"

export class StudentFlag extends Model {
    public id!: number
    public student_id!: number
    public flag_type!: string // e.g. 'low_score', 'attendance'
    public flag_reason!: string | null
    public is_active!: boolean
    public created_at!: Date
    public resolved_at!: Date | null
}

StudentFlag.init(
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
        flag_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        flag_reason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        resolved_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "student_flags",
        timestamps: false, // or true if you use Sequelize's built-in createdAt/updatedAt
    }
)

StudentFlag.belongsTo(Student, {
    foreignKey: "student_id",
    onDelete: "CASCADE",
})

Student.hasMany(StudentFlag, {
    foreignKey: "student_id",
    as: "flags",
})
