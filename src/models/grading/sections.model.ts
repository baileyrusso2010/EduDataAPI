import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class Section extends Model {
    public id!: number
    public course_id!: number
    public teacher_id!: number
    public period!: string
    public section_number!: number
}

Section.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        teacher_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        period: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        section_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "section",
        timestamps: false,
    }
)
