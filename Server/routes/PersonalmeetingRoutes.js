const express = require("express");
const router = express.Router();
const {
  createPersonalMeeting,
  getPersonalMeetings,
  deletePersonalMeeting,
  updatePersonalMeeting
} = require("../controllers/Personalmeeting");
const authenticate = require("../middleware/authMiddleware");

router.post("/create", authenticate, createPersonalMeeting);
router.get("/", authenticate, getPersonalMeetings);
router.delete("/:id", authenticate, deletePersonalMeeting);
router.put('/edit/:id', authenticate, 
    updatePersonalMeeting
);

module.exports = router;
