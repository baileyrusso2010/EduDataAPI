import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"
import { Course } from "./course.model"
import { Term } from "./term.model"

export class Score extends Model {
    public id!: number
    public student_id!: number
    public course_id!: number
    public term_id!: number
    public task_id!: number
    public score!: number

    // Add the Course property for association typing
    public Course?: Course
    public Term?: Term
}

Score.init(
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
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        term_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        task_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        score: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "scores",
        timestamps: false,
    }
)
