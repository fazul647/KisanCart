// server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const { register, login, updateMe } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// ========================
// 🔹 Nodemailer Transporter
// ========================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ========================
// 🔹 ROUTES
// ========================
router.post('/register', register);
router.post('/login', login);
router.put('/me', authMiddleware, updateMe);

// ========================
// 🔹 FORGOT PASSWORD
// ========================
router.post("/forgot-password", async (req, res) => {
  
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔐 Generate token
    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    // 📧 Send Email
    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset - Kisan Cart",
      html: `
        <h3>Password Reset Request</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    console.log("Reset link sent:", resetLink);

    res.json({ message: "Reset link sent to your email" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ========================
// 🔹 RESET PASSWORD
// ========================
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // 🔐 Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // ❌ Clear token
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
const upload = require("../middlewares/upload");

router.post(
  "/upload-profile",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      user.profilePic = `/uploads/${req.file.filename}`;
      await user.save();

      res.json({
        message: "Profile updated",
        profilePic: user.profilePic,
      });
    } catch (err) {
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

module.exports = router;