const express        = require('express');
const rateLimit      = require('express-rate-limit');
const passport       = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const User           = require('../models/User');
const requireAuth    = require('../middleware/auth');
const logger         = require('../utils/logger');
const authController = require('../controllers/authController');

const router = express.Router();

// Strict rate limit for auth endpoints — 10 attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please try again in 15 minutes.' },
});

// ── Google OAuth setup ────────────────────────────────────────────────────────
logger.info(`[Google OAuth] Client ID loaded: ${process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.slice(0, 12) + '...' : 'MISSING'}`);

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
          user = await User.create({ name: profile.displayName, email, googleId: profile.id });
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

// ── Routes ────────────────────────────────────────────────────────────────────
router.post('/register', authLimiter, authController.register);
router.post('/login',    authLimiter, authController.login);
router.post('/logout',               authController.logout);
router.get('/me',        requireAuth, authController.me);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=google_failed' }),
  authController.googleCallback
);

module.exports = router;
