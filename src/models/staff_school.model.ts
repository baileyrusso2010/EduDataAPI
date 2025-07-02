import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class StaffSchool extends Model {
    public staffId!: number
    public SchoolId!: number
}

StaffSchool.init(
    {
        staffId: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            references: {
                model: "staff", // Replace with your actual staff table name
                key: "personID",
            },
        },
        SchoolId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: "schools", // Replace with your actual school year table name
                key: "id",
            },
        },
    },
    {
        sequelize,
        tableName: "staff_school",
        timestamps: false,
    }
)
