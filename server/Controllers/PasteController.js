const Paste = require("../Models/Paste");
const { validationResult } = require("express-validator");

const getCurrentTime = (req) => {
  if (process.env.TEST_MODE === "1" && req.headers["x-test-now-ms"]) {
    return new Date(parseInt(req.headers["x-test-now-ms"]));
  }
  return new Date();
};

// Create paste
exports.createPaste = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { content, ttl_seconds, max_views } = req.body;
    if (!content || !content.trim())
      return res.status(400).json({ error: "Content is required" });

    const pasteData = { content };

    if (Number.isInteger(max_views) && max_views > 0)
      pasteData.maxViews = max_views;
    if (Number.isInteger(ttl_seconds) && ttl_seconds > 0) {
      const now = getCurrentTime(req);
      pasteData.expiresAt = new Date(now.getTime() + ttl_seconds * 1000);
    }

    const paste = new Paste(pasteData);
    await paste.save();

    const baseUrl = process.env.PUBLIC_BASE_URL || "http://localhost:3000";
    res
      .status(201)
      .json({ id: paste.pasteId, url: `${baseUrl}/p/${paste.pasteId}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create paste" });
  }
};

// Get paste
exports.getPaste = async (req, res) => {
  try {
    const { id } = req.params;
    const now = getCurrentTime(req);

    const paste = await Paste.findOneAndUpdate(
      {
        pasteId: id,

        $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],

        $or: [{ maxViews: null }, { $expr: { $lt: ["$views", "$maxViews"] } }],
      },
      {
        $inc: { views: 1 },
      },
      {
        new: true,
      }
    );

    if (!paste) {
      return res.status(404).json({ error: "Paste not found or expired" });
    }

    res.json({
      content: paste.content,
      remaining_views:
        paste.maxViews !== null
          ? Math.max(0, paste.maxViews - paste.views)
          : null,
      expires_at: paste.expiresAt?.toISOString() || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch paste" });
  }
};

// Public HTML view
exports.renderPaste = async (req, res) => {
  try {
    const { id } = req.params;
    const now = getCurrentTime(req);

    const paste = await Paste.findOne({ pasteId: id });
    if (!paste || !paste.isAvailable(now))
      return res.status(404).send("<h1>Paste not found</h1>");

    const safeContent = paste.content
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    res.status(200).send(`<pre>${safeContent}</pre>`);
  } catch (err) {
    console.error(err);
    res.status(500).send("<h1>Server error</h1>");
  }
};
