// controllers/userController.js
const User = require('../models/User');

exports.addUserToTeam = async (req, res) => {
  try {
    const { email } = req.body;
    const adminId = req.user.id; // Assuming user is authenticated
    console.log(adminId)
    // Check if email is provided
    if (!email) return res.status(400).json({ error: 'Email is required.' });

    // Find user to add
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    // Check if the user is already part of a team
    if (user.teamLeader) return res.status(400).json({ error: 'User is already part of a team.' });

    // Add user to the team
    user.teamLeader = adminId;
    await user.save();

    // Add the user to admin's team members
    await User.findByIdAndUpdate(adminId, {
      $addToSet: { teamMembers: user._id }
    });

    res.status(200).json(user); // Return the user object after adding
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add user to team.' });
  }
};


exports.removeUserFromTeam = async (req, res) => {
  try {
    const { userId } = req.body; // user ID of team member
    const adminId = req.user.id; // admin's ID

    // Remove user’s teamLeader
    const user = await User.findById(userId);
    if (!user || String(user.teamLeader) !== String(adminId)) {
      return res.status(403).json({ message: 'User not part of your team' });
    }

    user.teamLeader = null;
    await user.save();

    // Remove user from admin’s teamMembers array
    await User.findByIdAndUpdate(adminId, {
      $pull: { teamMembers: userId }
    });

    res.status(200).json({ message: 'User removed from team successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.getTeamMembers = async (req, res) => {
  console.log("ldl")
  try {
    const adminId = req.user.id; // Admin's ID from auth middleware
    // Find users whose `teamLeader` is the current admin
    const teamMembers = await User.find({ teamLeader: adminId }).select('name email');

    if (!teamMembers || teamMembers.length === 0) {
      return res.status(404).json({ message: 'No team members found' });
    }

    res.status(200).json(teamMembers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};