// controllers/userController.js
const User = require('../models/User');

exports.addUserToTeam = async (req, res) => {
  try {
    const { email } = req.body;
    const adminId = req.user.id;

    if (!email) return res.status(400).json({ error: 'Email is required.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    if (user.teamLeader) return res.status(400).json({ error: 'User is already part of a team.' });

    // Add user to the team and save current time
    user.teamLeader = adminId;
    user.teamLeaderJoinedAt = new Date();
    await user.save();

    // Add the user to admin's team members
    await User.findByIdAndUpdate(adminId, {
      $addToSet: { teamMembers: user._id }
    });

    res.status(200).json(user); // now user has the correct join time
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add user to team.' });
  }
};

exports.removeUserFromTeam = async (req, res) => {
  try {
    const { userId } = req.body; // user ID of team member
    const adminId = req.user.id; // admin's ID

    // Find the user
    const user = await User.findById(userId);
    if (!user || String(user.teamLeader) !== String(adminId)) {
      return res.status(403).json({ message: 'User not part of your team' });
    }

    // Remove user’s teamLeader and joined time
    user.teamLeader = null;
    user.teamLeaderJoinedAt = null;
    await user.save();

    // Remove user from admin’s teamMembers array
    await User.findByIdAndUpdate(adminId, {
      $pull: { teamMembers: userId }
    });

    res.status(200).json({ 
      message: 'User removed from team successfully', 
      user 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.getTeamMembers = async (req, res) => {
  try {
    const adminId = req.user.id; // Admin ID from auth middleware

    // Ensure only admin can access this route
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can view team members.' });
    }

    // Find users whose `teamLeader` is the current admin
    const teamMembers = await User.find({ teamLeader: adminId })
      .select('name email image teamLeaderJoinedAt createdAt');

    // If no members found
    if (!teamMembers || teamMembers.length === 0) {
      return res.status(404).json({ message: 'No team members found.' });
    }

    // Map each member to include readable join date
    const membersWithJoinedDate = teamMembers.map(member => ({
      _id: member._id,
      name: member.name,
      email: member.email,
      image: member.image,
      joinedAt: member.teamLeaderJoinedAt || member.createdAt, // prefer teamLeaderJoinedAt if available
    }));

    // Return members
    return res.status(200).json(membersWithJoinedDate);

  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({
      message: 'Server error. Please try again later.',
      error: error.message,
    });
  }
};

exports.getTeamLeader = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .select('teamLeader')
      .populate({
        path: 'teamLeader',
        select: 'name email image role createdAt'
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.teamLeader) {
      return res.status(404).json({ message: 'No team leader assigned' });
    }

    res.status(200).json({ teamLeader: user.teamLeader });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
