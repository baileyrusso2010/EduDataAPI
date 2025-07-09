import { Model, DataTypes } from "sequelize";
import sequelize from "../../database";
import { Tier } from "./tier.model";

export class StudentTier extends Model {
  declare id: number;
  declare studentId: number;
  declare tierId: number;
  declare assigned_date: Date;
  declare end_date: Date | null;
  declare notes: string | null;

  // Add this line:
  declare Tier?: Tier;
}

StudentTier.init(
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
    tierId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    assigned_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: "student_tier",
    timestamps: false,
  }
);
