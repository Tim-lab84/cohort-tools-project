const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const errorHandler = require("./middleware/errorHandler"); // Import error middleware

// Import Auth Routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes"); // Import the user routes

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

// CONNECT TO MONGODB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// IMPORT ROUTES
const studentRoutes = require("./routes/students");
const cohortRoutes = require("./routes/cohorts");

// USE ROUTES
app.use("/api/students", studentRoutes);
app.use("/api/cohorts", cohortRoutes);

// AUTH ROUTES (Login, Signup, Verify)
app.use("/auth", authRoutes);  // Register auth routes under '/auth'
app.use("/api", userRoutes);   // Register user route (for user info) under '/api'

// SERVE DOCUMENTATION PAGE
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// ERROR HANDLING MIDDLEWARE (MUST BE AT THE END)
app.use(errorHandler);

// START SERVER
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
