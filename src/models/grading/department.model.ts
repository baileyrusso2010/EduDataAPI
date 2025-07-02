import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class Department extends Model {
    public id!: number
    public name!: string
}

Department.init(
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
    },
    {
        sequelize,
        tableName: "departments",
        timestamps: false,
    }
)
