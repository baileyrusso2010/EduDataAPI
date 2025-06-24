const PORT = process.env.PORT || 3000;
import bodyParser from "body-parser";
import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
app.use(bodyParser.json({ limit: "10mb" })); //file upload
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
const allowedOrigins = ["http://localhost:5173", "https://chalkrecords.com"];
const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
import sequelize from "./src/database";
import "./src/models/associations";

import assessmentRoutes from "./src/routes/assessment.routes";
import attendanceRoutes from "./src/routes/attendance.routes";
import profileRoutes from "./src/routes/profile.routes";
import studentRoutes from "./src/routes/student.routes";
import teacherRoutes from "./src/routes/teacher.routes";
import mtssRoutes from "./src/routes/mtss.routes";
import behavior from "./src/routes/behavior.routes";
import { generateFakeData } from "./src/seed/fakeData";

//should use v1/
app.use("/assessments", assessmentRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/behavior", behavior);
app.use("/profile", profileRoutes);
app.use("/student", studentRoutes);
app.use("/teacher", teacherRoutes);
app.use("/mtss", mtssRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the School Management API");
});

app.listen(PORT, async () => {
  await sequelize
    .authenticate()
    .then(() => {
      console.log("connected to database");
    })
    .catch((error) => {
      console.error("Unable to connect to database");
    });

  await sequelize.sync({ alter: true });
  //   await sequelize.sync({ force: true });
  //   await generateFakeData();

  console.log(`Listening on PORT: ${PORT}`);
});
