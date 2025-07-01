import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class Staff extends Model {}

Staff.init(
    {
        personID: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },

    {
        sequelize,
        tableName: "staff",
        timestamps: true,
    }
)

//create a btw table
