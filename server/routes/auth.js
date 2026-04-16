// server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");


const { register, login, updateMe } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.put('/me', authMiddleware, updateMe);
router.post("/forgot-password", async (req, res) => {
    try {
      const { email, newPassword } = req.body;
  
      if (!email || !newPassword) {
        return res.status(400).json({ message: "All fields required" });
      }
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      user.password = hashedPassword;
      await user.save();
  
      res.json({ message: "Password updated successfully" });
  
    } catch (error) {
      console.log("Forgot Password Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

module.exports = router;
