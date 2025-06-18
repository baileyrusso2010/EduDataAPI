import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class StudentTier extends Model {}

StudentTier.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tierId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        assigned_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        end_date: {
            type: DataTypes.DATE,
        },
        notes: {
            type: DataTypes.TEXT,
        },
    },
    {
        sequelize,
        tableName: "student_tier",
        timestamps: false,
    }
)
