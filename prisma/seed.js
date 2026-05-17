const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Clear existing data first
  await prisma.resource.deleteMany();
  await prisma.sermon.deleteMany();
  await prisma.event.deleteMany();
  await prisma.announcement.deleteMany();

  // ── ANNOUNCEMENTS ─────────────────────────────────────────────
  await prisma.announcement.createMany({
    data: [
      {
        title: "Your announcement title here",
        body: "Your announcement body text here.",
        color: "green", // green, red, or yellow
      },
      // copy and paste the block above to add more
    ],
  });

  // ── EVENTS ────────────────────────────────────────────────────
  await prisma.event.createMany({
    data: [
      {
        title: "Your event title here",
        category: "special", // special, quarterly, monthly, midweek
        date: "Mar 15, 2026",
        venue: "Main Sanctuary",
        description: "Your event description here.",
      },
      // copy and paste the block above to add more
    ],
  });

  // ── SERMONS ───────────────────────────────────────────────────
  await prisma.sermon.createMany({
    data: [
      {
        title: "Your sermon title here",
        speaker: "Pastor Name",
        date: "May 11, 2026",
        category: "Faith", // Faith, Prayer, Growth, Family, Prophecy
        mediaUrl: "https://youtube.com/watch?v=...", // leave empty string '' if none
      },
      // copy and paste the block above to add more
    ],
  });

  console.log("✅ Database seeded successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
