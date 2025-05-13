const { convertAudioToText } = require('../utils/audioToText');
const { getSummary } = require('../utils/summarizeText');
const Notes = require('../models/Notes');
const fs = require('fs');

exports.saveMeetingNotes = async (req, res) => {
  try {
    const audioPath = req.file.path;
    const meetingId = req.body.meetingId;

    // Step 1: Convert audio to text
    const text = await convertAudioToText(audioPath);

    // Step 2: Summarize the text
    const summary = await getSummary(text);

    // Step 3: Save notes in MongoDB
    const note = new Notes({ meetingId, summary });
    await note.save();

    // Delete the uploaded audio file after processing
    fs.unlinkSync(audioPath);

    res.status(200).json({ message: 'Summary saved', note });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate notes' });
  }
};
