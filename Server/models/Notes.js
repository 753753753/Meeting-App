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
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // <-- add this
});

module.exports = mongoose.model('Notes', notesSchema);
