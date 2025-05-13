const express = require("express");
const router = express.Router();
const {
  createMeeting,
  getMeetings,
  deleteMeeting,
  updateMeeting
} = require("../controllers/UpcomingmeetingController");
const authenticate = require("../middleware/authMiddleware");

router.post("/create", authenticate, createMeeting);
router.get("/", authenticate, getMeetings);
router.delete("/:id", authenticate, deleteMeeting);
router.put('/edit/:id', authenticate, updateMeeting);

module.exports = router;
