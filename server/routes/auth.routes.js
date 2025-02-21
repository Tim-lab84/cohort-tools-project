const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');  
const auth = require('../middleware/auth');  
const router = express.Router();

// JWT secret
const secret = process.env.JWT_SECRET || 'Kappa';

// POST /auth/signup - Create a new user
router.post('/signup', async (req, res, next) => {
  const { email, password, name } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
    });

    await newUser.save();
    res.status(201).json({
      message: 'User created successfully',
      user: { email: newUser.email, name: newUser.name },
    });
  } catch (err) {
    next(err);
  }
});

// POST /auth/login - Check email and password, return JWT if valid
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      secret,
      { expiresIn: '6h' }
    );

    res.json({
      message: 'Login successful',
      token,  // Send the JWT token to the client
    });
  } catch (err) {
    next(err);
  }
});

// GET /auth/verify - Verify the JWT
router.get('/verify', auth, (req, res) => {
  // If the token is valid, it will reach here
  res.json({ message: 'Token is valid', user: req.auth });
});

module.exports = router;
