const mongoose = require("mongoose");

exports.healthCheck = async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1;

    res.status(200).json({
      ok: dbStatus,
      timestamp: new Date().toISOString(),
      database: dbStatus ? "connected" : "disconnected",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: "Health check failed",
    });
  }
};
