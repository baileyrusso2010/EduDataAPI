import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class Tier extends Model {}

Tier.init(
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
        description: {
            type: DataTypes.TEXT,
        },
    },
    {
        sequelize,
        tableName: "tier",
        timestamps: true,
    }
)
