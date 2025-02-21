const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Ensure passwords have a minimum length
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true }); // Adds createdAt & updatedAt fields

module.exports = mongoose.model("User", userSchema);