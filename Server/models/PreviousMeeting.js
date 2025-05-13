const mongoose = require('mongoose');

const previousMeetingSchema = new mongoose.Schema({
  title: String,
  date: String,
  participants: [String],
  endedAt: { type: Date, default: Date.now },
  roomId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Added field
});

module.exports = mongoose.model('PreviousMeeting', previousMeetingSchema);
