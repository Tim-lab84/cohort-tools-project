const express = require("express");
const router = express.Router();
const Cohort = require("../models/Cohort");

// GET all cohorts
router.get("/", async (req, res, next) => {
  try {
    const cohorts = await Cohort.find();
    res.json(cohorts);
  } catch (error) {
    next(error);
  }
});

// GET a cohort by ID
router.get("/:cohortId", async (req, res, next) => {
  try {
    const cohort = await Cohort.findById(req.params.cohortId);
    if (!cohort) {
      const error = new Error("Cohort not found");
      error.statusCode = 404;
      throw error;
    }
    res.json(cohort);
  } catch (error) {
    next(error);
  }
});

// CREATE a new cohort
router.post("/", async (req, res, next) => {
  try {
    const cohort = new Cohort(req.body);
    await cohort.save();
    res.status(201).json(cohort);
  } catch (error) {
    next(error);
  }
});

// UPDATE a cohort
router.put("/:cohortId", async (req, res, next) => {
  try {
    const cohort = await Cohort.findByIdAndUpdate(
      req.params.cohortId,
      req.body,
      { new: true }
    );
    if (!cohort) {
      const error = new Error("Cohort not found");
      error.statusCode = 404;
      throw error;
    }
    res.json(cohort);
  } catch (error) {
    next(error);
  }
});

// DELETE a cohort
router.delete("/:cohortId", async (req, res, next) => {
  try {
    const cohort = await Cohort.findByIdAndDelete(req.params.cohortId);
    if (!cohort) {
      const error = new Error("Cohort not found");
      error.statusCode = 404;
      throw error;
    }
    res.json({ message: "Cohort deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
