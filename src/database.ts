// src/database.ts
import { Sequelize } from "sequelize"

const sequelize = new Sequelize({
    dialect: "postgres",
    host: String(process.env.DB_HOST), // or 'localhost'
    port: Number(process.env.DB_PORT),
    database: String(process.env.DB_DATABASE),
    username: String(process.env.DB_USERNAME),
    password: String(process.env.DB_PASSWORD),
    logging: false, // optional
    dialectOptions: {
        // ssl: {
        //     required: true,
        //     rejectUnauthorized: false // ⛔ Not for production
        // }
        // rejectUnauthorized: false,
    },
})

export default sequelize
