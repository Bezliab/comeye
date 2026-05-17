const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const prisma = require("../lib/db");
const { requireAuth } = require("../middleware/auth");

// File upload setup
const UPLOAD_DIR = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-z0-9.\-_]/gi, "_");
    cb(null, `${Date.now()}-${safe}`);
  },
});
const ALLOWED_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "audio/mpeg",
  "video/mp4",
];
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    ALLOWED_MIME.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("File type not allowed"));
  },
});

// GET /admin/login
router.get("/login", (req, res) => {
  if (req.session.isAdmin) return res.redirect("/admin");
  res.render("pages/admin-login", { error: req.flash("error") });
});

// POST /admin/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || "";
  const adminHash = process.env.ADMIN_PASSWORD_HASH || "";

  if (!email || !password) {
    req.flash("error", "Please enter your email and password.");
    return res.redirect("/admin/login");
  }

  const emailMatch = email.trim().toLowerCase() === adminEmail.toLowerCase();
  const passMatch = await bcrypt.compare(password, adminHash);

  if (emailMatch && passMatch) {
    req.session.isAdmin = true;
    req.session.adminEmail = email.trim().toLowerCase();
    const returnTo = req.session.returnTo || "/admin";
    delete req.session.returnTo;
    return res.redirect(returnTo);
  }

  req.flash("error", "Incorrect email or password.");
  res.redirect("/admin/login");
});

// POST /admin/logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/admin/login"));
});

// All routes below require login
router.use(requireAuth);

// GET /admin — dashboard
router.get("/", async (req, res) => {
  const [announcements, events, sermons, resources] = await Promise.all([
    prisma.announcement.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.event.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.sermon.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.resource.findMany({ orderBy: { uploadedAt: "desc" } }),
  ]);

  res.render("pages/admin", {
    adminEmail: req.session.adminEmail,
    stats: {
      announcements: announcements.filter((a) => a.active).length,
      events: events.length,
      sermons: sermons.length,
      resources: resources.length,
    },
    announcements,
    events,
    sermons,
    resources,
  });
});

// ANNOUNCEMENTS
router.post("/announcements", async (req, res) => {
  const { title, body, color } = req.body;
  if (!title || !body)
    return res.status(400).json({ error: "Title and body are required" });
  const item = await prisma.announcement.create({
    data: { title, body, color: color || "green" },
  });
  res.json({ success: true, item });
});

router.put("/announcements/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const item = await prisma.announcement.update({
    where: { id },
    data: req.body,
  });
  res.json({ success: true, item });
});

router.delete("/announcements/:id", async (req, res) => {
  await prisma.announcement.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ success: true });
});

// EVENTS
router.post("/events", async (req, res) => {
  const { title, category, date, venue, description } = req.body;
  if (!title || !date || !venue)
    return res.status(400).json({ error: "Title, date and venue required" });
  const item = await prisma.event.create({
    data: {
      title,
      category: category || "special",
      date,
      venue,
      description: description || "",
    },
  });
  res.json({ success: true, item });
});

router.delete("/events/:id", async (req, res) => {
  await prisma.event.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ success: true });
});

// SERMONS
router.post("/sermons", async (req, res) => {
  const { title, speaker, date, category, mediaUrl } = req.body;
  if (!title || !speaker || !date)
    return res.status(400).json({ error: "Title, speaker and date required" });
  const item = await prisma.sermon.create({
    data: {
      title,
      speaker,
      date,
      category: category || "Faith",
      mediaUrl: mediaUrl || "",
    },
  });
  res.json({ success: true, item });
});

router.delete("/sermons/:id", async (req, res) => {
  await prisma.sermon.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ success: true });
});

// RESOURCES — file upload
router.post("/resources/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const { title, category, description } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });

  const item = await prisma.resource.create({
    data: {
      title,
      category: (category || "OTHER").toUpperCase(),
      description: description || "",
      filePath: `/uploads/${req.file.filename}`,
      fileSize: `${(req.file.size / 1024).toFixed(0)} KB`,
      fileType: req.file.originalname.split(".").pop().toUpperCase(),
    },
  });
  res.json({ success: true, item });
});

router.delete("/resources/:id", async (req, res) => {
  const item = await prisma.resource.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  if (!item) return res.status(404).json({ error: "Not found" });
  if (item.filePath) {
    const abs = path.join(__dirname, "../public", item.filePath);
    if (fs.existsSync(abs)) fs.unlinkSync(abs);
  }
  await prisma.resource.delete({ where: { id: item.id } });
  res.json({ success: true });
});

module.exports = router;
