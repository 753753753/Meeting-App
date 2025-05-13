// routes/PreviousmeetingRoutes.js
const express = require("express");
const router = express.Router();

const {
  createPreviousMeeting,
  getPreviousMeetings,
  deletePreviousMeetings
} = require("../controllers/PreviousmeetingController");

const authenticate = require("../middleware/authMiddleware");

// Define routes
router.post("/end-meeting/:id", authenticate, createPreviousMeeting);
router.get("/", authenticate, getPreviousMeetings); // GET /api/Previousmeetings/
router.delete("/:id", authenticate, deletePreviousMeetings);
// ✅ EXPORT the router
module.exports = router;