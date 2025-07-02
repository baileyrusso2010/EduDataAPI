import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class Course extends Model {
    public id!: number
    public name!: string
    public department_id!: number
}

Course.init(
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
        department_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "courses",
        timestamps: false,
    }
)
