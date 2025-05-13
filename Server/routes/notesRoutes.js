const express = require("express");
const router = express.Router();
const PreviousMeeting = require("../models/PreviousMeeting");
const Notes = require("../models/Notes"); // Import Notes model
const authenticate = require("../middleware/authMiddleware");

router.post("/save", authenticate , async (req, res) => {
  const { roomid, transcript } = req.body;
  console.log("hii")
  console.log(roomid, transcript);
 
  try {
    
    // Generate summary using AI
    let summary = transcript;
    // if (transcript) {
    //   try {
    //     summary = await getAIUpdatedNotes(transcript);
    //   } catch (err) {
    //     console.warn("AI summarization failed:", err.message);
    //   }
    // }

    // Fetch the full PreviousMeeting details
    const meeting = await PreviousMeeting.findOne({ roomId: roomid });
    if (!meeting) return res.status(404).json({ error: "Meeting not found" });

    // Create a new Notes document with embedded meeting details
    const newNote = new Notes({
      meetingId: meeting._id,
      meetingDetails: {
        title: meeting.title,
        date: meeting.date,
        participants: meeting.participants,
        endedAt: meeting.endedAt,
      },
      summary,
      createdBy: req.user.id, // <-- capture current user
    });

    await newNote.save();

    res
      .status(200)
      .json({ message: "Meeting and notes saved successfully!", summary });
  } catch (error) {
    console.error("Error saving meeting and notes:", error);
    res.status(500).json({ error: "Failed to save meeting and notes" });
  }
});

// Get all notes
router.get("/notes",authenticate, async (req, res) => {
  try {
    const notes = await Notes.find({ createdBy: req.user.id }).sort({ date: -1 }); // Fetch all notes
    res.status(200).json({ notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// Download notes for a specific meeting
router.get("/download-notes/:meetingId", authenticate , async (req, res) => {
  try {
    const meetingId = req.params.meetingId;
    const note = await Notes.findById(meetingId);

    if (!note) {
      return res.status(404).json({ error: 'Notes not found' });
    }

    // Create text file for download
    const notesContent = `Meeting Title: ${note.meetingDetails.title}\nDate: ${note.meetingDetails.date}\n\nSummary:\n${note.summary}`;
    const buffer = Buffer.from(notesContent, 'utf-8');
    
    res.setHeader('Content-Disposition', 'attachment; filename="meeting_notes.txt"');
    res.setHeader('Content-Type', 'text/plain');
    res.send(buffer);
  } catch (error) {
    console.error('Error downloading notes:', error);
    res.status(500).json({ error: 'Failed to download notes' });
  }
});

// Delete Note by meetingId
router.delete('/:id',authenticate, async (req, res) => {
  try {
    const noteId = req.params.id;
    const deletedNote = await Notes.findByIdAndDelete(noteId);

    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
