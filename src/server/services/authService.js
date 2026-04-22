const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { httpError } = require('../utils/httpError');

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  secure: process.env.NODE_ENV === 'production',
};

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email };
}

function signToken(user) {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

async function register({ name, email, password }) {
  if (!name?.trim() || !email?.trim() || !password) {
    throw httpError(400, 'Name, email, and password are required.');
  }
  if (password.length < 6) {
    throw httpError(400, 'Password must be at least 6 characters.');
  }

  const normalizedEmail = email.toLowerCase().trim();
  const exists = await User.findOne({ email: normalizedEmail });
  if (exists) {
    throw httpError(409, 'An account with that email already exists.');
  }

  const user = await User.create({ name: name.trim(), email: normalizedEmail, password });

  return {
    token: signToken(user),
    user: publicUser(user),
  };
}

async function login({ email, password }) {
  if (!email?.trim() || !password) {
    throw httpError(400, 'Email and password are required.');
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user || !(await user.comparePassword(password))) {
    throw httpError(401, 'Invalid email or password.');
  }

  return {
    token: signToken(user),
    user: publicUser(user),
  };
}

async function findOrCreateGoogleUser(profile) {
  const email = profile.emails[0].value.toLowerCase();
  let user = await User.findOne({ $or: [{ googleId: profile.id }, { email }] });

  if (!user) {
    user = await User.create({ name: profile.displayName, email, googleId: profile.id });
  } else if (!user.googleId) {
    user.googleId = profile.id;
    await user.save();
  }

  return user;
}

module.exports = {
  COOKIE_OPTS,
  findOrCreateGoogleUser,
  login,
  register,
  signToken,
};
