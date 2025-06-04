const PORT = process.env.PORT || 3000
import express from "express"
const app = express()
import dotenv from "dotenv"
dotenv.config()
const cors = require("cors")
import sequelize from "./src/database"
import {
    generateFakeAttendance,
    generateFakeBehavior,
    generateFakeData,
    createAssessmentWithResults,
    createBandScores,
} from "./src/seed/fakeRoster"

// import behaviorRoutes from "./src/controller/behavior"
app.use(cors())
app.use(express.json())
// app.use("/api/behavior-records", behaviorRoutes)

app.listen(PORT, async () => {
    console.log(process.env.DB_HOST)
    await sequelize
        .authenticate()
        .then(() => {
            console.log("connected to database")
        })
        .catch((error) => {
            console.error("Unable to connect to database")
        })

    await sequelize.sync({ alter: true })
    // await createAssessmentWithResults("NWEA Reading Fall 2024", 6, true)
    // await createBandScores()

    // generateFakeData().catch(console.error)
    console.log(`Listening on PORT: ${PORT}`)
})
