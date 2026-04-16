const express     = require('express');
const jwt         = require('jsonwebtoken');
const rateLimit   = require('express-rate-limit');
const User        = require('../models/User');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// Strict rate limit for auth endpoints — 10 attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please try again in 15 minutes.' },
});

const COOKIE_OPTS = {
  httpOnly: true,          // Not accessible from JS — immune to XSS
  sameSite: 'lax',         // Sent on same-origin navigations
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
};

function signToken(user) {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// ── POST /api/auth/register ────────────────────────────────────────────────
router.post('/register', authLimiter, async (req, res) => {
  const { name, email, password } = req.body;

  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  const exists = await User.findOne({ email: email.toLowerCase().trim() });
  if (exists) {
    return res.status(409).json({ message: 'An account with that email already exists.' });
  }

  const user  = await User.create({ name: name.trim(), email, password });
  const token = signToken(user);

  res.cookie('token', token, COOKIE_OPTS);
  res.status(201).json({ id: user._id, name: user.name, email: user.email });
});

// ── POST /api/auth/login ───────────────────────────────────────────────────
router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user || !(await user.comparePassword(password))) {
    // Deliberately vague — don't reveal whether email exists
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = signToken(user);
  res.cookie('token', token, COOKIE_OPTS);
  res.json({ id: user._id, name: user.name, email: user.email });
});

// ── POST /api/auth/logout ──────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
  res.json({ message: 'Logged out successfully.' });
});

// ── GET /api/auth/me ───────────────────────────────────────────────────────
// Returns the current user from the cookie — used by the client to restore session
router.get('/me', requireAuth, (req, res) => {
  res.json(req.user);
});

module.exports = router;
