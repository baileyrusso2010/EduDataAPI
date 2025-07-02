import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class School_year extends Model {}

School_year.init(
    {
        id: {
            // manually assigned school ID
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        year_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "school_year",
        timestamps: false,
    }
)
