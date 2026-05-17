require('dotenv').config();

const path    = require('path');
const express = require('express');
const session = require('express-session');
const flash   = require('connect-flash');

const publicRoutes = require('./routes/public');
const adminRoutes  = require('./routes/admin');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── View engine ───────────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ── Static files ──────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── Sessions ──────────────────────────────────────────────────────────────────
app.use(session({
  secret:            process.env.SESSION_SECRET || 'fallback_secret_change_me',
  resave:            false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production', // true behind HTTPS in prod
    maxAge:   8 * 60 * 60 * 1000,                   // 8-hour session
  },
}));

// ── Flash messages ────────────────────────────────────────────────────────────
app.use(flash());

// ── Expose session to all views ───────────────────────────────────────────────
app.use((req, res, next) => {
  res.locals.isAdmin = req.session && req.session.isAdmin ? true : false;
  next();
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/',      publicRoutes);
app.use('/admin', adminRoutes);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('pages/404');
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong. Please try again.');
});

app.listen(PORT, () => console.log(`✅  Server running on http://localhost:${PORT}`));
