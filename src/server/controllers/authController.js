const authService = require('../services/authService');

exports.register = async (req, res, next) => {
  try {
    const { token, user } = await authService.register(req.body);
    res.cookie('token', token, authService.COOKIE_OPTS);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { token, user } = await authService.login(req.body);
    res.cookie('token', token, authService.COOKIE_OPTS);
    res.json(user);
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
  const token = authService.signToken(req.user);
  res.cookie('token', token, authService.COOKIE_OPTS);
  res.send(`<!DOCTYPE html><html><body><script>
    localStorage.setItem('has_session','1');
    location.replace('/items');
  </script></body></html>`);
};
