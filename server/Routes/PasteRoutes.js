const express = require("express");
const router = express.Router();
const pasteController = require("../Controllers/PasteController");
const healthController = require("../Controllers/HealthController");
const validation = require("../Middlewares/Validation");

// Health check
router.get("/healthz", healthController.healthCheck);

// Create paste
router.post(
  "/pastes",
  validation.createPasteValidation,
  pasteController.createPaste
);
router.get("/pastes/:id", pasteController.getPaste);
router.get("/p/:id", pasteController.renderPaste);

module.exports = router;
