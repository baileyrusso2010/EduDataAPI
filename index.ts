const PORT = 5000
import express from "express"
const app = express()
const cors = require("cors")
import behaviorRoutes from "./src/controller/behavior"

app.use(cors())
app.use(express.json())
app.use("/api/behavior-records", behaviorRoutes)

app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`)
})
