const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  secure: process.env.NODE_ENV === 'production',
};

function signToken(user) {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

exports.COOKIE_OPTS = COOKIE_OPTS;
exports.signToken   = signToken;

exports.register = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
  res.json({ message: 'Logged out successfully.' });
};

exports.me = (req, res) => {
  res.json(req.user);
};

exports.googleCallback = (req, res) => {
  const token = signToken(req.user);
  res.cookie('token', token, COOKIE_OPTS);
  res.send(`<!DOCTYPE html><html><body><script>
    localStorage.setItem('has_session','1');
    location.replace('/items');
  </script></body></html>`);
};
