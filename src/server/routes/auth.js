const express     = require('express');
const jwt         = require('jsonwebtoken');
const rateLimit   = require('express-rate-limit');
const passport    = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
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
router.post('/register', authLimiter, async (req, res, next) => {
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
});

// ── POST /api/auth/login ───────────────────────────────────────────────────
router.post('/login', authLimiter, async (req, res, next) => {
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

// ── Google OAuth ───────────────────────────────────────────────────────────
console.log('[Google OAuth] Client ID loaded:', process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.slice(0, 12) + '...' : 'MISSING');

passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  `${process.env.APP_URL || 'http://localhost:3000'}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value.toLowerCase();
        let user = await User.findOne({ $or: [{ googleId: profile.id }, { email }] });

        if (!user) {
          user = await User.create({
            name:     profile.displayName,
            email,
            googleId: profile.id,
          });
        } else if (!user.googleId) {
          // Existing email/password account — link Google to it
          user.googleId = profile.id;
          await user.save();
        }

        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

// GET /api/auth/google — redirect to Google consent screen
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
}));

// GET /api/auth/google/callback — Google redirects here after consent
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=google_failed' }),
  (req, res) => {
    const token = signToken(req.user);
    res.cookie('token', token, COOKIE_OPTS);
    // Set the localStorage hint client-side, then redirect into the app
    res.send(`<!DOCTYPE html><html><body><script>
      localStorage.setItem('has_session','1');
      location.replace('/items');
    </script></body></html>`);
  }
);

module.exports = router;
