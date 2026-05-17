// data/store.js
// Simple in-memory store. Replace each array/object with real DB calls
// (Prisma, Mongoose, pg, etc.) when you're ready.

const announcements = [
  {
    id: 1,
    title: 'Annual Convention Registration Now Open',
    body: 'The 39th Annual Conventions holds March 15–17. Early registration closes February 28. Accommodation packages available.',
    active: true,
    color: 'green',
    createdAt: '2026-02-12',
  },
  {
    id: 2,
    title: 'Communion Sunday – February 23',
    body: "All members are encouraged to attend both services. New members' class precedes the 7:30 AM service.",
    active: true,
    color: 'red',
    createdAt: '2026-02-18',
  },
  {
    id: 3,
    title: 'Youth Camp 2026 – Applications Open',
    body: 'Ages 13–25. June 6–8 at Covenant Retreat Centre. Download application form in Resources.',
    active: true,
    color: 'yellow',
    createdAt: '2026-02-10',
  },
  {
    id: 4,
    title: 'Sunday Bulletins Now Available Online',
    body: 'Download weekly bulletins every Friday from the Resources section. Printer-friendly format included.',
    active: true,
    color: 'green',
    createdAt: '2026-02-05',
  },
];

const events = [
  { id: 1, title: '40-Day Prayer & Fasting Revival', category: 'special',   date: 'Mar 1 – Apr 9, 2026', venue: 'Main Sanctuary',    description: 'Join the church in 40 days of consecrated prayer and fasting to usher in breakthrough and revival.' },
  { id: 2, title: '39th Annual Convention',          category: 'quarterly', date: 'Mar 15–17, 2026',      venue: 'Grace Hall',         description: 'Three days of powerful ministry, worship, and fellowship with guest ministers from across the nation.' },
  { id: 3, title: 'Youth Breakfast & Mentoring',     category: 'monthly',   date: 'Mar 8, 2026',          venue: 'Fellowship Hall',    description: 'Monthly breakfast for young adults aged 18–35 with mentoring, networking, and morning devotion.' },
  { id: 4, title: 'Virtuous Women Fellowship',       category: 'monthly',   date: 'Mar 1, 2026',          venue: "Women's Hall",       description: 'Uplifting gathering for women of all ages to share, grow, and support one another.' },
  { id: 5, title: 'All-Night Vigil',                 category: 'monthly',   date: 'Mar 27, 2026',         venue: 'Main Sanctuary',    description: 'Monthly night of worship, intercession, and prayer warfare. 10 PM to dawn.' },
  { id: 6, title: 'Power Hour Prayer Meeting',       category: 'midweek',   date: 'Every Wednesday',      venue: 'Prayer Chapel',      description: 'Spirit-filled intercession session every Wednesday evening from 6 PM.' },
  { id: 7, title: 'Easter Cantata & Passion Play',   category: 'special',   date: 'Apr 18, 2026',         venue: 'Main Sanctuary',    description: "Dramatic presentation of Christ's passion through music, drama, and dance." },
  { id: 8, title: 'GCC Youth Camp 2026',             category: 'special',   date: 'Jun 6–8, 2026',        venue: 'Covenant Retreat Centre', description: 'Three-day camp for ages 13–25. Leadership, worship, sports, and discipleship activities.' },
];

const sermons = [
  { id: 1, title: 'The Anatomy of a Breakthrough',                          speaker: 'Pastor David Adeyemi',   date: 'Feb 16, 2026', category: 'Faith',    mediaUrl: '' },
  { id: 2, title: 'When Prayer Changes Nothing (But Changes You)',          speaker: 'Pastor David Adeyemi',   date: 'Feb 9, 2026',  category: 'Prayer',   mediaUrl: '' },
  { id: 3, title: 'Marriage: Building on the Right Foundation',             speaker: 'Pst. Mrs. Grace Adeyemi',date: 'Feb 2, 2026',  category: 'Family',   mediaUrl: '' },
  { id: 4, title: 'The Year of Open Doors — Prophetic Declaration 2026',   speaker: 'Pastor David Adeyemi',   date: 'Jan 5, 2026',  category: 'Prophecy', mediaUrl: '' },
  { id: 5, title: 'Rooted: Growing Deep in Dry Seasons',                   speaker: 'Pastor Joshua Nwosu',    date: 'Jan 26, 2026', category: 'Growth',   mediaUrl: '' },
  { id: 6, title: 'Standing on the Promises: Faith for the Impossible',    speaker: 'Deacon Samuel Okeke',    date: 'Jan 19, 2026', category: 'Faith',    mediaUrl: '' },
];

const resources = [
  { id: 1, title: 'Sunday Bulletin — Feb 22, 2026',     category: 'BULLETIN',      description: 'This week\'s order of service, announcements, tithing update, and weekly Bible reading plan.', fileSize: '450 KB',  fileType: 'PDF',  uploadedAt: 'Feb 21', filePath: null },
  { id: 2, title: 'Daily Devotional — February 2026',   category: 'DEVOTIONAL',    description: '31-day devotional guide for the month. Scripture, reflection, and prayer points for each day.', fileSize: '1.2 MB',  fileType: 'PDF',  uploadedAt: 'Jan 31', filePath: null },
  { id: 3, title: 'Annual Convention Programme 2026',   category: 'PROGRAMME',     description: 'Full schedule, speaker profiles, accommodation info, and registration details for the 39th Annual Convention.', fileSize: '2.1 MB',  fileType: 'PDF',  uploadedAt: 'Feb 10', filePath: null },
  { id: 4, title: 'Youth Camp Application Form 2026',   category: 'FORM',          description: 'Download, complete, and return to church office by May 15. Attach medical info if applicable.', fileSize: '120 KB',  fileType: 'DOCX', uploadedAt: 'Feb 10', filePath: null },
  { id: 5, title: '40-Day Fasting Prayer Guide',        category: 'ANNOUNCEMENT',  description: "Structured daily prayer and fasting guide for the church's annual 40-Day Prayer & Fasting Revival starting March 1.", fileSize: '800 KB',  fileType: 'PDF',  uploadedAt: 'Feb 20', filePath: null },
  { id: 6, title: 'Sunday Bulletin — Feb 15, 2026',     category: 'BULLETIN',      description: 'Order of service, sermon notes outline, tithing, and upcoming events for the week of Feb 15.', fileSize: '430 KB',  fileType: 'PDF',  uploadedAt: 'Feb 14', filePath: null },
  { id: 7, title: 'Worship Songs — Covenant Night Vigil', category: 'MEDIA',       description: 'Audio recordings of the worship session from the January All-Night Vigil. Includes lyrics PDF.', fileSize: '45 MB',   fileType: 'MP3',  uploadedAt: 'Jan 28', filePath: null },
  { id: 8, title: 'New Member Registration Form',       category: 'FORM',          description: 'Welcome to the family! Complete this form and return it to the membership desk on any Sunday.', fileSize: '95 KB',   fileType: 'PDF',  uploadedAt: 'Jan 1',  filePath: null },
];

let nextId = {
  announcements: announcements.length + 1,
  events: events.length + 1,
  sermons: sermons.length + 1,
  resources: resources.length + 1,
};

module.exports = { announcements, events, sermons, resources, nextId };
