import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class ProgressMonitoring extends Model {}

ProgressMonitoring.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        studentId: {
            type: DataTypes.INTEGER,
        },
        assessment_name: {
            type: DataTypes.TEXT,
        },
        date_taken: {
            type: DataTypes.DATE,
        },
        score: {
            type: DataTypes.NUMBER,
        },
        benchmark: {
            type: DataTypes.NUMBER,
        },
        notes: {
            type: DataTypes.TEXT,
        },
    },
    {
        sequelize,
        tableName: "progress_monitoring",
        timestamps: true,
    }
)
