import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class Intervention extends Model {
    public id!: number
    public name!: string
    public focus_area!: string
    public tier_level!: number
    public frequency?: string
    public description?: string

    public readonly createdAt!: Date
    public readonly updatedAt!: Date
}

Intervention.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        focus_area: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tier_level: {
            type: DataTypes.INTEGER, // 2 or 3
            allowNull: false,
        },
        frequency: {
            type: DataTypes.STRING, // e.g. "3x/week", "Daily"
        },
        description: {
            type: DataTypes.TEXT,
        },
    },
    {
        sequelize,
        tableName: "intervention",
        timestamps: true,
    }
)
