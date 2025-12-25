// server/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_here';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

// helper: create JWT
function createToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

// Register controller
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
      role = 'buyer',
      address = {}
    } = req.body;

    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Name, email, phone and passwords are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    if (!['farmer', 'buyer'].includes(role)) {
      return res.status(400).json({ message: "Role must be 'farmer' or 'buyer'." });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashed,
      role,
      address: {
        street: address.street || '',
        city: address.city || '',
        state: address.state || '',
        zipcode: address.zipcode || ''
      }
    });

    const token = createToken(user);
    const userObj = user.toObject();
    delete userObj.password;

    return res.status(201).json({ user: userObj, token });
  } catch (err) {
    console.error('Register error:', err);
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Email or phone already registered.' });
    }
    return res.status(500).json({ message: 'Server error' });
  }
};

// Login controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(user);
    const userObj = user.toObject();
    delete userObj.password;

    return res.json({ user: userObj, token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update current logged-in user (updateMe)
// Update current logged-in user (buyer & farmer)
exports.updateMe = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, phone, address } = req.body;

    const updates = {};

    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;

    // ✅ SAFELY HANDLE ADDRESS
    if (address) {
      updates.address = {
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        zipcode: address.zipcode || ""
      };
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user: updated });

  } catch (err) {
    console.error("updateMe error:", err);
    return res.status(500).json({ message: "Profile update failed" });
  }
};


