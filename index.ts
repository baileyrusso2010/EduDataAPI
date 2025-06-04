const PORT = process.env.PORT || 3000
import express from "express"
const app = express()
import dotenv from "dotenv"
dotenv.config()
const cors = require("cors")
import bodyParser from "body-parser"
app.use(bodyParser.json({ limit: "10mb" }))
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }))

app.use(cors())
app.use(express.json())
import sequelize from "./src/database"
import assessmentRoutes from "./src/routes/assessment.routes"
import attendanceRoutes from "./src/routes/attendance.routes"

app.use("/assessments", assessmentRoutes)
app.use("/attendance", attendanceRoutes)

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
    // await createAssessmentWithResults("NWEA Reading Fall 2024", 6, true)
    // await createBandScores()

    // generateFakeData().catch(console.error)
    console.log(`Listening on PORT: ${PORT}`)
})
