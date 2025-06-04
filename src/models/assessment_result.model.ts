import { Model, DataTypes } from "sequelize"
import sequelize from "../database"
import { Student } from "./student.model"
import { Assessment } from "./assessment.model"

export class AssessmentResult extends Model {
    declare id: number
    declare student_id: number
    declare assessment_id: number
    declare final_score: number
    declare questions: {
        question: string
        maxPoints: number
        earnedPoints: number
    }[]
}

AssessmentResult.init(
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
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        final_score: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        questions: {
            type: DataTypes.JSONB, // for Postgres
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "assessment_results",
        timestamps: true,
    }
)

// Relations
AssessmentResult.belongsTo(Student, { foreignKey: "student_id" })
AssessmentResult.belongsTo(Assessment, { foreignKey: "assessment_id", as: "assessment" })

Student.hasMany(AssessmentResult, { foreignKey: "student_id" })
Assessment.hasMany(AssessmentResult, { foreignKey: "assessment_id" })
