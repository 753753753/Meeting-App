const Meeting = require('../models/Meeting');

exports.createMeeting = async (req, res) => {
  try {
    const { title, date, participants } = req.body;

    const meeting = new Meeting({
      title,
      date,
      participants,
      createdBy: req.user.id,
    });

    await meeting.save();

    res.status(201).json({ message: 'Meeting created successfully', meeting });
  } catch (error) {
    res.status(500).json({ message: 'Error creating meeting', error });
  }
};

exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ createdBy: req.user.id });
    res.status(200).json({ meetings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meetings', error });
  }
};

exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);
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

exports.updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });

    if (meeting.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    meeting.title = req.body.title || meeting.title;
    meeting.date = req.body.date || meeting.date;

    const updatedMeeting = await meeting.save();
    res.status(200).json({ message: 'Meeting updated', updatedMeeting });
  } catch (error) {
    res.status(500).json({ message: 'Error updating meeting', error });
  }
};