import { Model, DataTypes } from "sequelize"
import sequelize from "../database"
import { Student } from "./student.model"

export class BehaviorRecord extends Model {}

BehaviorRecord.init(
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
        staff_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        incident_datetime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        resolution: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
    },
    {
        sequelize,
        tableName: "behavior_records",
        timestamps: true,
    }
)

// Associations
Student.hasMany(BehaviorRecord, { foreignKey: "student_id", as: "behaviors" })
BehaviorRecord.belongsTo(Student, { foreignKey: "student_id" })
