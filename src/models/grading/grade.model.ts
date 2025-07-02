import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class Grade extends Model {}

Grade.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        enrollment_id: { type: DataTypes.INTEGER, allowNull: false },
        term_id: { type: DataTypes.INTEGER, allowNull: false },
        task_id: { type: DataTypes.INTEGER, allowNull: false },
        score: { type: DataTypes.FLOAT, allowNull: true },
    },
    { sequelize, tableName: "grades", timestamps: false }
)
