// routes/public.js
const express = require('express');
const router  = express.Router();
const store   = require('../data/store');

router.get('/',          (req, res) => res.render('pages/home',      { announcements: store.announcements.filter(a => a.active).slice(0, 4), events: store.events.slice(0, 3) }));
router.get('/about',     (req, res) => res.render('pages/about'));
router.get('/services',  (req, res) => res.render('pages/services'));
router.get('/events',    (req, res) => res.render('pages/events',    { events: store.events }));
router.get('/sermons',   (req, res) => res.render('pages/sermons',   { sermons: store.sermons }));
router.get('/resources', (req, res) => res.render('pages/resources', { resources: store.resources }));
router.get('/contact',   (req, res) => res.render('pages/contact',   { success: false }));

// Contact form POST
router.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  // TODO: wire up an email provider (Nodemailer, SendGrid, etc.)
  console.log('Contact form submission:', { name, email, subject, message });
  res.render('pages/contact', { success: true });
});

// Public API — read-only data for the front-end
router.get('/api/announcements', (req, res) => res.json(store.announcements.filter(a => a.active)));
router.get('/api/events',        (req, res) => {
  const { category } = req.query;
  const data = category ? store.events.filter(e => e.category === category.toLowerCase()) : store.events;
  res.json(data);
});
router.get('/api/sermons',       (req, res) => {
  const { category } = req.query;
  const data = category ? store.sermons.filter(s => s.category === category) : store.sermons;
  res.json(data);
});
router.get('/api/resources',     (req, res) => {
  const { category } = req.query;
  const data = category ? store.resources.filter(r => r.category === category.toUpperCase()) : store.resources;
  res.json(data);
});

module.exports = router;
