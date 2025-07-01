import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class Student_Answers extends Model {}

Student_Answers.init(
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
        question_id: {
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
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "student_answers",
        timestamps: false,
    }
)
