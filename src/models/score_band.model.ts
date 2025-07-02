import { Model, DataTypes } from "sequelize"
import sequelize from "../database"
import { Assessment } from "./assessments/assessment.model"

export class ScoreBand extends Model {
    declare id: number
    declare assessment_id: number
    declare label: string
    declare min_score: number
    declare max_score: number
    declare color: string
}

ScoreBand.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        assessment_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        label: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        min_score: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        max_score: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "score_bands",
        timestamps: true,
    }
)
