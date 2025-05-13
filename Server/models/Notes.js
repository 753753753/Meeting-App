const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
  meetingId: { type: mongoose.Schema.Types.ObjectId, ref: 'PreviousMeeting' },
  meetingDetails: {
    title: String,
    date: String,
    participants: [String],
    endedAt: Date,
  },
  summary: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notes', notesSchema);
