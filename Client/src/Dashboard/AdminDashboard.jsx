import { useEffect, useState } from 'react';
import profile from '../assets/profile.png';
import { useUser } from '../context/UserContext';
import { addUserToTeam, removeUserFromTeam } from "../utils/api"; // adjust path
const AdminDashboard = () => {
  const {
    user,
    token,
    role,
    teamMembers,
    setTeamMembers,
    fetchTeamMembers,
  } = useUser();

  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (role === 'admin' && token) {
      fetchTeamMembers();
    }
  }, [role, token]);

  const handleAddUser = async () => {
    if (!email) {
      setError("Please enter an email.");
      return;
    }
    try {
      const data = await addUserToTeam(email);
      setSuccessMessage("User added successfully!");
      setEmail("");
      setError(null);
      setTeamMembers(prevMembers => Array.isArray(prevMembers) ? [...prevMembers, data] : [data]);
      fetchTeamMembers();
    } catch (err) {
      setError(err.message || "Failed to add user.");
    }
  };

  const handleRemoveUser = async (userId) => {
    try {
      const data = await removeUserFromTeam(userId);
      setSuccessMessage("User removed successfully!");
      setTeamMembers(prevMembers => prevMembers.filter(member => member._id !== userId));
    } catch (err) {
      setError(err.message || "Failed to remove user.");
    }
  };

  console.log(teamMembers);

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden text-white">
  {/* Background Decorative Circles */}
  <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-700/20 rounded-full blur-3xl animate-pulse-slow"></div>
  <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>

    {/* Main Dashboard Area */}
    <div className="flex-1 p-8 overflow-y-auto">
      {/* Header */}
      <h2 className="text-4xl font-bold text-blue-400 mb-8 text-center">Team Management</h2>

      {/* Add Team Member */}
      <div className="bg-gray-900 p-6 rounded-3xl shadow-lg mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <input
            type="email"
            placeholder="Enter team member's email to add in your team"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 flex-1 bg-gray-800 text-white rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddUser}
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Add Member
          </button>
        </div>
      </div>

      {/* Team Members */}
      <div className="space-y-4">
        {teamMembers.length > 0 ? (
          teamMembers.map((member) => (
            <div
              key={member._id}
              className="flex items-center justify-between bg-gray-800 p-4 rounded-2xl border border-gray-700 hover:bg-gray-700 shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <img
                  src={member.image ? member.image : profile}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                />
                <div>
                  <p className="font-semibold">{member.name} ({member.email})</p>
                  <p className="text-gray-400 text-sm">
                    Joined: {new Date(member?.joinedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveUser(member._id)}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No team members added yet.</p>
        )}
      </div>
    </div>
  </div>


  );
};

export default AdminDashboard;
