import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class StudentIntervention extends Model {}

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
