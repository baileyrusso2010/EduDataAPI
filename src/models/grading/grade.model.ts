import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"
import { Term } from "./term.model"
import { Task } from "./task.model"

export class Grade extends Model {
    public id!: number
    public enrollment_id!: number
    public term_id!: number
    public task_id!: number
    public score!: number

    // ✅ Add association fields for TypeScript:
    public Term?: Term
    public Task?: Task
}

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
