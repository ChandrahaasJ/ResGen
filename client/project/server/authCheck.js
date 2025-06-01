import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach decoded payload to req.user
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

// Route to check if token is valid
app.get('/auth/check', authMiddleware, (req, res) => {
  res.json({ success: true, user: req.user });
});

export default app;
