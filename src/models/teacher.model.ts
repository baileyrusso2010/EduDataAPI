// models/teacher.model.ts
import { Model, DataTypes } from "sequelize"
import sequelize from "../database" // Adjust path as needed
import { CourseSection } from "./courses/course_section.model" // Assuming correct path

export class Teacher extends Model {
	declare id: number
	declare person_id: string
	declare name: string
	declare email: string
	declare createdAt: Date
	declare updatedAt: Date
}

Teacher.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true, // Added: Auto-increment for primary key
			primaryKey: true,
		},
		person_id: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "teachers", // Corrected: Relevant table name
		timestamps: true,
	}
)
