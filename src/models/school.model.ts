import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class School extends Model {
    declare id: number
    declare name: string
}

School.init(
    {
        id: {
            // manually assigned school ID
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "schools",
        timestamps: false,
    }
)
