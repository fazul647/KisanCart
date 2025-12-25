// server/routes/auth.js
const express = require('express');
const router = express.Router();

const { register, login, updateMe } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.put('/me', authMiddleware, updateMe);

module.exports = router;
