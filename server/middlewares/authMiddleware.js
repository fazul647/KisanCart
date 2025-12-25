// server/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: 'No token provided' });

    const token = header.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_jwt_secret_here');

    // attach user id and role
    req.user = { id: decoded.id, role: decoded.role };

    // OPTIONAL role enforcement example (remove if not needed)
    // const user = await User.findById(decoded.id);
    // if (user && user.role !== 'farmer') {
    //   return res.status(403).json({ message: 'Only farmers allowed' });
    // }

    return next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
