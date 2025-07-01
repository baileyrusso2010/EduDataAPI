import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class Final_score extends Model {}

Final_score.init(
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
