import { Model, DataTypes } from "sequelize";
import sequelize from "../database";
import { Student } from "./student.model";
import { CourseSection } from "./associations";

export class Attendance extends Model {
  public id!: number;
  public student_id!: number;
  public date!: Date;
  public school_year_id!: number;
  public sectionID!: number;
  public status!: "present" | "absent" | "tardy";

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Attendance.init(
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
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    school_year_id: {
      // Foreign Key to CourseSection
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "school_year", // Must match the tableName of your CourseSection model
        key: "id", // References the 'sectionID' primary key of the Course_Sections table
      },
    },
    sectionID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: CourseSection,
        key: "sectionID",
      },
    },
    status: {
      type: DataTypes.ENUM("present", "absent", "tardy"),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "attendance",
    timestamps: true,
  }
);
