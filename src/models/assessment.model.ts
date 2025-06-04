import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class Assessment extends Model {
    declare id: number
    declare test_name: string
    declare standardized: string
}

Assessment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        test_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        standardized: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: "assessments",
        timestamps: true,
    }
)
