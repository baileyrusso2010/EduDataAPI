const PORT = process.env.PORT || 3000
import bodyParser from "body-parser"
import express from "express"
const app = express()

import dotenv from "dotenv"
dotenv.config()

const cors = require("cors")
app.use(bodyParser.json({ limit: "10mb" }))
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }))
app.use(cors())
app.use(express.json())

import sequelize from "./src/database"
import assessmentRoutes from "./src/routes/assessment.routes"
import attendanceRoutes from "./src/routes/attendance.routes"
import profileRoutes from "./src/routes/profile.routes"
import { generateFakeBehavior, generateFakeData, generateFakeGrades } from "./src/seed/fakeRoster"
import { r } from "@faker-js/faker/dist/airline-BUL6NtOJ"

app.use("/assessments", assessmentRoutes)
app.use("/attendance", attendanceRoutes)
app.use("/profile", profileRoutes)

app.get("/", (req, res) => {
    res.send("Welcome to the School Management API")   
})

app.listen(PORT, async () => {
    await sequelize
        .authenticate()
        .then(() => {
            console.log("connected to database")
        })
        .catch((error) => {
            console.error("Unable to connect to database")
        })

    await sequelize.sync({ alter: true })

    console.log(`Listening on PORT: ${PORT}`)
})
