const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); 
const router = express.Router();

const secret = process.env.JWT_SECRET || 'Kappa';  


router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name }, 
      secret, 
      { expiresIn: "6h" } 
    );

    res.json({
      message: "Login successful",
      token, // Send the token to the client
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
