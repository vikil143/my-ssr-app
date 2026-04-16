const jwt = require('jsonwebtoken');

/**
 * requireAuth — Express middleware that validates the JWT stored in the
 * httpOnly "token" cookie.  Attaches decoded payload to req.user on success.
 */
module.exports = function requireAuth(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res
      .status(401)
      .json({ message: 'Invalid or expired session. Please log in again.' });
  }
};
