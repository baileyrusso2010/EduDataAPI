import { Model, DataTypes } from "sequelize"
import sequelize from "../database"
import { School } from "./school.model"
import { BehaviorRecord } from "./behavior.model"
import { Enrollment } from "./enrollment.model"
import { StudentIntervention } from "./mtss/student_interventions.mode"
import { Intervention } from "./mtss/interventions.model"
import { StudentTier } from "./mtss/student_tier.model"
import { Attendance } from "./attendance.model"

export class Student extends Model {
    declare id: number
    declare student_number: string
    declare first_name: string
    declare last_name: string
    declare grade: string
    declare email: string
    declare ethnicity: string
    declare school_id: number
    declare behaviors?: BehaviorRecord[]
    declare StudentInterventions?: StudentIntervention[] // This allows `student.AssessmentResults`
    declare StudentTiers?: StudentTier[]
    declare Attendances?: Attendance[]
}

//    + ',' + 'Teacher First Name'
// + ',' + 'Teacher Last Name'
// + ',' + 'Teacher Email'
// + ',' + 'Teacher Person ID'
Student.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        student_number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        grade: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
        },
        ethnicity: {
            type: DataTypes.STRING,
        },
        school_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "students",
        timestamps: true,
    }
)

Student.belongsTo(School, { foreignKey: "school_id" })
