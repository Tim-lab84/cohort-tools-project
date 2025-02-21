const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');  
const router = express.Router();


router.get('/users/:id', auth, async (req, res, next) => {
  const userId = req.params.id;

  try {
  
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    res.json({
      email: user.email,
      name: user.name,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
