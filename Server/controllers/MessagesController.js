const Message = require('../models/Message');
const User = require('../models/User');
const mongoose = require('mongoose'); // ✅ Add this

// Send message in group
exports.sendMessage = async (req, res) => {
    try {
    const { senderId, receiverId, content } = req.body;
    
    if (!senderId || !receiverId || !content)
      return res.status(400).json({ message: 'All fields are required' });

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all messages for a team group
exports.getMessages = async (req, res) => {
  try {
    const { userId, memberId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: memberId },
        { sender: memberId, receiver: userId },
      ],
    }).sort({ createdAt: 1 }); // sort by time

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getMessagesWithLeader = async (req, res) => {
  console.log("enter");
  try {
   const memberId = req.user.id;

    // 1. Validate memberId
    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      return res.status(400).json({ message: 'Invalid member ID' });
    }

    // 2. Find member and populate their teamLeader
    const user = await User.findById(memberId).populate('teamLeader', '_id name image');
    if (!user || !user.teamLeader) {
      return res.status(404).json({ message: 'Team leader not found' });
    }

    const leaderId = user.teamLeader._id; // ✅ Must be ObjectId
    console.log('Leader ID:', leaderId);

    // 3. Fetch messages between member and leader
    const messages = await Message.find({
      $or: [
        { sender: memberId, receiver: leaderId },
        { sender: leaderId, receiver: memberId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'name image')
      .populate('receiver', 'name image');

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages with leader:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
