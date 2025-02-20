const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// GET all students (with error handling)
router.get("/", async (req, res, next) => {
  try {
    const students = await Student.find().populate("cohort");
    res.json(students);
  } catch (error) {
    next(error); // Forward error to middleware
  }
});

// GET students by cohort
router.get("/cohort/:cohortId", async (req, res, next) => {
  try {
    const students = await Student.find({
      cohort: req.params.cohortId,
    }).populate("cohort");
    res.json(students);
  } catch (error) {
    next(error);
  }
});

// GET a student by ID
router.get("/:studentId", async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.studentId).populate(
      "cohort"
    );
    if (!student) {
      const error = new Error("Student not found");
      error.statusCode = 404;
      throw error;
    }
    res.json(student);
  } catch (error) {
    next(error);
  }
});

// CREATE a new student
router.post("/", async (req, res, next) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
});

// UPDATE a student
router.put("/:studentId", async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.studentId,
      req.body,
      { new: true }
    );
    if (!student) {
      const error = new Error("Student not found");
      error.statusCode = 404;
      throw error;
    }
    res.json(student);
  } catch (error) {
    next(error);
  }
});

// DELETE a student
router.delete("/:studentId", async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.studentId);
    if (!student) {
      const error = new Error("Student not found");
      error.statusCode = 404;
      throw error;
    }
    res.json({ message: "Student deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
