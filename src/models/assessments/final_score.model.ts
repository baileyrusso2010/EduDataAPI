import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"
import { Assessment } from "./assessment.model"

export class Final_Score extends Model {
    public id!: number
    public student_id!: number
    public assessment_id!: number
    public score_value!: string

    // Association
    public Assessment?: Assessment
}

Final_Score.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        assessment_id: {
            //allows for faster look ups without joing questions
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        score_value: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "final_score",
    }
)
