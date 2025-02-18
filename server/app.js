const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 5005;

// INITIALIZE EXPRESS APP
const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://example.com"],
  })
);

// 🔹 Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 🔹 Import Models (to be created)
const Student = require("./models/Student");
const Cohort = require("./models/Cohort");

// 🔹 API Routes
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
});

app.get("/api/cohorts", async (req, res) => {
  try {
    const cohorts = await Cohort.find();
    res.json(cohorts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cohorts", error });
  }
});

// Serve Docs Page
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

//MODEL ROUTES
app.get("/api/cohorts", async (req, res) => {
  try {
    const cohorts = await Cohort.find();
    res.json(cohorts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cohorts", error });
  }
});

//students model
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find().populate("cohort"); // Populate cohort details !!!!!!
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
