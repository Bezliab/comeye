// middleware/auth.js
// Protects any route that requires an active admin session.

function requireAuth(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  // Store the originally requested URL so we can redirect after login
  req.session.returnTo = req.originalUrl;
  res.redirect('/admin/login');
}

module.exports = { requireAuth };
