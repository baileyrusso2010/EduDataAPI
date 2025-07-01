import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class Questions extends Model {
    public id!: number
    public assessment_id!: number
    public question_num!: number
    public text!: string | null
}

Questions.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        assessment_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        question_num: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        text: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "questions",
        timestamps: false,
    }
)
