import { Model, DataTypes } from "sequelize";
import sequelize from "../database";
import { Student } from "./student.model";

export class GradeBook extends Model {}
//need to update this.
GradeBook.init(
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
    school_year: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    term_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    task: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    course_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    score: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "grade_book",
    timestamps: true,
  }
);

Student.hasMany(GradeBook, { foreignKey: "student_id", as: "grade_book" });
GradeBook.belongsTo(Student, { foreignKey: "student_id" });
