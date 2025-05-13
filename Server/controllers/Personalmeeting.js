const PersonalMeeting = require('../models/PersonalMeeting');

exports.createPersonalMeeting = async (req, res) => {
  try {
    const { title, date, password, participants } = req.body;
    console.log(title, date, participants, password);
    console.log(req.user.id);

    const meeting = new PersonalMeeting({
      title,
      password,
      date,
      participants,
      createdBy: req.user.id,
    });

    await meeting.save();

    console.log("ayush");

    res.status(201).json({ message: 'Meeting created successfully', meeting });
  } catch (error) {
    console.error("❌ Error saving meeting:", error); // 🔥 This is important
    res.status(500).json({ message: 'Error creating meeting', error });
  }
};


exports.getPersonalMeetings = async (req, res) => {
  try {
    const meetings = await PersonalMeeting.find({ createdBy: req.user.id });
    res.status(200).json({ meetings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meetings', error });
  }
};

exports.deletePersonalMeeting = async (req, res) => {
  try {
    const meeting = await PersonalMeeting.findByIdAndDelete(req.params.id);
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

exports.updatePersonalMeeting = async (req, res) => {
  try {
    const meeting = await PersonalMeeting.findById(req.params.id);
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