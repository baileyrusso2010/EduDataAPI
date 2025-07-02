import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class Task extends Model {
    public id!: number
    public type!: string // "Quarter" | "Interim"
}

Task.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "tasks",
        timestamps: false,
    }
)
