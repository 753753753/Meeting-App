import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';

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

 const handleAddUser = () => {
  if (!email) {
    setError('Please enter an email.');
    return;
  }

  fetch('http://localhost:5000/api/adminroutes/add', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        setError(data.error);
      } else {
        setSuccessMessage('User added successfully!');
        setEmail('');
        setError(null);
        // Ensure prevMembers is an array before appending
        setTeamMembers(prevMembers => Array.isArray(prevMembers) ? [...prevMembers, data] : [data]);
      }
    })
    .catch(() => setError('Failed to add user.'));
};

  const handleRemoveUser = (userId) => {
    fetch('http://localhost:5000/api/adminroutes/remove', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setSuccessMessage('User removed successfully!');
          setTeamMembers(prevMembers => prevMembers.filter(member => member._id !== userId));
        }
      })
      .catch(() => setError('Failed to remove user.'));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-gray-900 p-8 rounded-2xl shadow-xl space-y-6">
        <h2 className="text-3xl font-bold text-blue-400 text-center">Admin Dashboard</h2>

        {error && <div className="text-red-400 text-center">{error}</div>}
        {successMessage && <div className="text-green-400 text-center">{successMessage}</div>}

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-blue-300">Add a Team Member</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-3">
              <input
                type="email"
                className="p-2 flex-1 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter team member's email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={handleAddUser}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
              >
                Add Member
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-blue-300 mb-3">Team Members</h3>
            <div className="space-y-3">
              {teamMembers.length > 0 ? (
                teamMembers.map((member) => (
                  <div
                    key={member._id}
                    className="flex justify-between items-center bg-gray-800 p-3 rounded-md border border-gray-700"
                  >
                    <p>{member.name} ({member.email})</p>
                    <button
                      onClick={() => handleRemoveUser(member._id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No team members added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
