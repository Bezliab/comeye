// routes/admin.js
const express = require('express');
const bcrypt  = require('bcryptjs');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const router  = express.Router();

const { requireAuth } = require('../middleware/auth');
const store           = require('../data/store');

// ── File upload setup ─────────────────────────────────────────────────────────
const UPLOAD_DIR = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename:    (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-z0-9.\-_]/gi, '_');
    cb(null, `${Date.now()}-${safe}`);
  },
});
const ALLOWED_MIME = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg', 'image/png',
  'audio/mpeg', 'video/mp4',
];
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME.includes(file.mimetype)) return cb(null, true);
    cb(new Error('File type not allowed'));
  },
});

// ── GET /admin/login ──────────────────────────────────────────────────────────
router.get('/login', (req, res) => {
  if (req.session.isAdmin) return res.redirect('/admin');
  res.render('pages/admin-login', { error: req.flash('error') });
});

// ── POST /admin/login ─────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const adminEmail    = process.env.ADMIN_EMAIL    || 'admin@hismercyandglory.org';
  const adminHash     = process.env.ADMIN_PASSWORD_HASH || '';

  if (!email || !password) {
    req.flash('error', 'Please enter your email and password.');
    return res.redirect('/admin/login');
  }

  const emailMatch = email.trim().toLowerCase() === adminEmail.toLowerCase();
  const passMatch  = adminHash ? await bcrypt.compare(password, adminHash) : password === 'admin123';

  if (emailMatch && passMatch) {
    req.session.isAdmin = true;
    req.session.adminEmail = email.trim().toLowerCase();
    const returnTo = req.session.returnTo || '/admin';
    delete req.session.returnTo;
    return res.redirect(returnTo);
  }

  req.flash('error', 'Incorrect email or password. Please try again.');
  res.redirect('/admin/login');
});

// ── POST /admin/logout ────────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

// ── All routes below require a valid session ──────────────────────────────────
router.use(requireAuth);

// ── GET /admin — dashboard ────────────────────────────────────────────────────
router.get('/', (req, res) => {
  res.render('pages/admin', {
    adminEmail: req.session.adminEmail,
    stats: {
      announcements: store.announcements.filter(a => a.active).length,
      events:        store.events.length,
      sermons:       store.sermons.length,
      resources:     store.resources.length,
    },
    announcements: store.announcements,
    events:        store.events,
    sermons:       store.sermons,
    resources:     store.resources,
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  ANNOUNCEMENTS API
// ═══════════════════════════════════════════════════════════════════════════════

router.post('/announcements', (req, res) => {
  const { title, body, color } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'Title and body are required' });

  const item = {
    id: store.nextId.announcements++,
    title: title.trim(),
    body:  body.trim(),
    color: color || 'green',
    active: true,
    createdAt: new Date().toISOString().split('T')[0],
  };
  store.announcements.unshift(item);
  res.json({ success: true, item });
});

router.put('/announcements/:id', (req, res) => {
  const id   = parseInt(req.params.id);
  const item = store.announcements.find(a => a.id === id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  const { title, body, color, active } = req.body;
  if (title  !== undefined) item.title  = title.trim();
  if (body   !== undefined) item.body   = body.trim();
  if (color  !== undefined) item.color  = color;
  if (active !== undefined) item.active = active;
  res.json({ success: true, item });
});

router.delete('/announcements/:id', (req, res) => {
  const id  = parseInt(req.params.id);
  const idx = store.announcements.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  store.announcements.splice(idx, 1);
  res.json({ success: true });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  EVENTS API
// ═══════════════════════════════════════════════════════════════════════════════

router.post('/events', (req, res) => {
  const { title, category, date, venue, description } = req.body;
  if (!title || !date || !venue) return res.status(400).json({ error: 'Title, date, and venue are required' });

  const item = {
    id: store.nextId.events++,
    title: title.trim(),
    category: (category || 'special').toLowerCase(),
    date:  date.trim(),
    venue: venue.trim(),
    description: (description || '').trim(),
  };
  store.events.push(item);
  res.json({ success: true, item });
});

router.put('/events/:id', (req, res) => {
  const item = store.events.find(e => e.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: 'Not found' });
  Object.assign(item, req.body);
  res.json({ success: true, item });
});

router.delete('/events/:id', (req, res) => {
  const idx = store.events.findIndex(e => e.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  store.events.splice(idx, 1);
  res.json({ success: true });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  SERMONS API
// ═══════════════════════════════════════════════════════════════════════════════

router.post('/sermons', (req, res) => {
  const { title, speaker, date, category, mediaUrl } = req.body;
  if (!title || !speaker || !date) return res.status(400).json({ error: 'Title, speaker, and date are required' });

  const item = {
    id: store.nextId.sermons++,
    title:    title.trim(),
    speaker:  speaker.trim(),
    date:     date.trim(),
    category: (category || 'Faith').trim(),
    mediaUrl: (mediaUrl || '').trim(),
  };
  store.sermons.unshift(item);
  res.json({ success: true, item });
});

router.put('/sermons/:id', (req, res) => {
  const item = store.sermons.find(s => s.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: 'Not found' });
  Object.assign(item, req.body);
  res.json({ success: true, item });
});

router.delete('/sermons/:id', (req, res) => {
  const idx = store.sermons.findIndex(s => s.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  store.sermons.splice(idx, 1);
  res.json({ success: true });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  RESOURCES / FILE UPLOAD API
// ═══════════════════════════════════════════════════════════════════════════════

router.post('/resources/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const { title, category, description } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const item = {
    id:          store.nextId.resources++,
    title:       title.trim(),
    category:    (category || 'OTHER').toUpperCase(),
    description: (description || '').trim(),
    filePath:    `/uploads/${req.file.filename}`,
    fileSize:    `${(req.file.size / 1024).toFixed(0)} KB`,
    fileType:    req.file.originalname.split('.').pop().toUpperCase(),
    uploadedAt:  new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
  };
  store.resources.unshift(item);
  res.json({ success: true, item });
});

router.delete('/resources/:id', (req, res) => {
  const idx  = store.resources.findIndex(r => r.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const item = store.resources[idx];
  // Delete physical file if it exists
  if (item.filePath) {
    const abs = path.join(__dirname, '../public', item.filePath);
    if (fs.existsSync(abs)) fs.unlinkSync(abs);
  }
  store.resources.splice(idx, 1);
  res.json({ success: true });
});

module.exports = router;
