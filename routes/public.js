const express = require("express");
const router = express.Router();
const prisma = require("../lib/db");

router.get("/", async (req, res) => {
  const [announcements, events] = await Promise.all([
    prisma.announcement.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.event.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
  ]);
  res.render("pages/home", { announcements, events });
});

router.get("/about", (req, res) => res.render("pages/about"));
router.get("/services", (req, res) => res.render("pages/services"));

router.get("/events", async (req, res) => {
  const events = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.render("pages/events", { events });
});

router.get("/sermons", async (req, res) => {
  const sermons = await prisma.sermon.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.render("pages/sermons", { sermons });
});

router.get("/resources", async (req, res) => {
  const resources = await prisma.resource.findMany({
    orderBy: { uploadedAt: "desc" },
  });
  res.render("pages/resources", { resources });
});

router.get("/contact", (req, res) =>
  res.render("pages/contact", { success: false }),
);

router.post("/contact", (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log("Contact form:", { name, email, subject, message });
  res.render("pages/contact", { success: true });
});

// Public read-only API
router.get("/api/announcements", async (req, res) => {
  const data = await prisma.announcement.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(data);
});

router.get("/api/events", async (req, res) => {
  const { category } = req.query;
  const data = await prisma.event.findMany({
    where: category ? { category: category.toLowerCase() } : {},
    orderBy: { createdAt: "desc" },
  });
  res.json(data);
});

router.get("/api/sermons", async (req, res) => {
  const { category } = req.query;
  const data = await prisma.sermon.findMany({
    where: category ? { category } : {},
    orderBy: { createdAt: "desc" },
  });
  res.json(data);
});

router.get("/api/resources", async (req, res) => {
  const { category } = req.query;
  const data = await prisma.resource.findMany({
    where: category ? { category: category.toUpperCase() } : {},
    orderBy: { uploadedAt: "desc" },
  });
  res.json(data);
});

module.exports = router;
