// controllers/groupChatController.js
const GroupMessage = require('../models/groupMessageModel');
const User = require('../models/User');

// Send message in group
exports.sendGroupMessage = async (req, res) => {
   console.log("reach message");
  try {
    const { content } = req.body;
    const senderId = req.user.id;
    console.log('senderId' , senderId);
    console.log('content' , content);
    const sender = await User.findById(senderId);
    if (!sender) return res.status(404).json({ message: 'Sender not found' });

    // Determine team leader for this group
    const teamLeaderId = sender.teamLeader || sender._id;

    // Allow only leader or their members
    if (sender._id.toString() !== teamLeaderId.toString()) {
      const leader = await User.findById(teamLeaderId);
      if (!leader.teamMembers.includes(senderId)) {
        return res.status(403).json({ message: 'Not allowed in this group' });
      }
    }

    const message = await GroupMessage.create({
      teamLeader: teamLeaderId,
      sender: senderId,
      content
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all messages for a team group
exports.getGroupMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const teamLeaderId = user.teamLeader || user._id;

    // Fetch messages for this group
    const messages = await GroupMessage.find({ teamLeader: teamLeaderId })
      .populate('sender', 'name image')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
