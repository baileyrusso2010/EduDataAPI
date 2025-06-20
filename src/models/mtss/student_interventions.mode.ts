import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"
import { Intervention } from "./interventions.model"

export class StudentIntervention extends Model {
    declare id: number
    declare studentId: number
    declare interventionId: number
    declare start_date: Date
    declare end_date?: Date
    declare assigned_by?: string

    declare Intervention?: Intervention
}

StudentIntervention.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        interventionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "intervention", // table name of the referenced model
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        end_date: {
            type: DataTypes.DATE,
        },
        assigned_by: {
            //should assign by teacher_id
            type: DataTypes.STRING,
        },
    },

    {
        sequelize,
        tableName: "student_intervention",
    }
)
