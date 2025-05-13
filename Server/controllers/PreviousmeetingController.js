const UpcomingMeeting = require('../models/Meeting');
const PreviousMeeting = require('../models/PreviousMeeting')

exports.createPreviousMeeting = async (req, res) => {
  console.log("enter");
  const meetingId = req.params.id;
  console.log(meetingId);

  try {
    const meeting = await UpcomingMeeting.findById(meetingId);
    console.log(meeting);
    if (!meeting) return res.status(404).send("Meeting not found");

    // Move to previous
    const previous = new PreviousMeeting({
      title: meeting.title,
      date: meeting.date,
      participants: meeting.participants,
      roomId: meeting._id, // Set the original ID
    });
    await previous.save();

    // Delete from upcoming
    await UpcomingMeeting.findByIdAndDelete(meetingId);

    res.status(200).send("Meeting ended and moved to previous.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error ending meeting");
  }
};

exports.getPreviousMeetings = async (req, res) => {
  try {
    const meetings = await PreviousMeeting.find().sort({ date: -1 }); // Latest first
    res.status(200).json(meetings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch previous meetings." });
  }
};

exports.deletePreviousMeetings = async (req, res) => {
  try {
    const meeting = await PreviousMeeting.findByIdAndDelete(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });

    if (meeting.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await meeting.deleteOne();
    res.status(200).json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting meeting', error });
  }
};
