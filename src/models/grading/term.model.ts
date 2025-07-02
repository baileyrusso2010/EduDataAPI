import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class Term extends Model {
    public id!: number
    public name!: string
    public school_year!: string // e.g. "2024-2025"
}

Term.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        school_year: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "terms",
        timestamps: false,
    }
)
