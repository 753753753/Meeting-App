import { useEffect, useState } from 'react';
import { AiOutlineCalendar, AiOutlineCheckCircle, AiOutlineMail, AiOutlineUser } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import profile from '../../assets/profile.png';
import { useUser } from '../../context/UserContext'; // ✅ Import the context hook
import { fetchTeamLeader } from '../../utils/api';

function Profile() {
    const { role, user, token, teamMembers, fetchTeamMembers, } = useUser(); // ✅ Use context

    useEffect(() => {
        if (role === 'admin' && token) {
            fetchTeamMembers();
        }
    }, [role, token]);

    const [teamLeader, setTeamLeader] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchTeamLeader();
            setTeamLeader(data.teamLeader);
        };
        fetchData();
    }, [role, token]);


    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center relative overflow-hidden px-6 md:px-12 pb-12">
            {/* Top Section: Profile Info */}
            <div className="flex flex-col md:flex-row max-w-5xl w-full gap-8 md:gap-10 mt-12 md:mt-6">
                {/* Left Side - Profile Picture */}
                <div className="relative bg-gradient-to-b from-blue-700 to-blue-500 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center hover:scale-105 transform transition-transform duration-500 w-full md:w-80">
                    <div className="absolute inset-0 bg-black/20 rounded-3xl"></div>

                    {user?.image ? (
                        <img
                            src={user.image}
                            alt={user.name}
                            className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white object-cover mb-4 shadow-xl z-10 animate-bounce-slow"
                        />
                    ) : (
                        <div
                            className="w-32 h-32 md:w-36 md:h-36 rounded-full flex items-center justify-center text-4xl md:text-5xl font-bold text-white border-4 border-white shadow-xl z-10 animate-bounce-slow"
                            style={{
                                backgroundColor: `hsl(${user?.name?.charCodeAt(0) * 15 % 360}, 70%, 50%)`
                            }}
                        >
                            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                    )}

                    <div className="text-center z-10 mt-4">
                        <h1 className="text-3xl md:text-4xl font-bold drop-shadow-lg">{user?.name}</h1>
                        <p className="text-blue-200 text-lg md:text-xl mt-1">{role}</p>
                    </div>
                </div>


                {/* Right Side - Admin/User Info */}
                <div className="flex-1 bg-gray-900/70 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-blue-500/30 animate-fadeIn p-6 flex flex-col">
                    {/* Top Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {role === 'admin' ? (
                            <>
                                {/* Row 1: Username */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                                    <AiOutlineUser className="text-blue-400 text-2xl" />
                                    <div className="break-words">
                                        <p className="text-gray-400 text-sm">Username</p>
                                        <p className="text-white font-medium">{user?.name}</p>
                                    </div>
                                </div>

                                {/* Row 1: Total Team Members */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                                    <FaUsers className="text-blue-400 text-2xl" />
                                    <div className="break-words">
                                        <p className="text-gray-400 text-sm">Total Members</p>
                                        <p className="text-white font-medium">{teamMembers.length}</p>
                                    </div>
                                </div>

                                {/* Row 2: Email */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                                    <AiOutlineMail className="flex-shrink-0 text-blue-400 text-2xl" />
                                    <div className="flex-1 break-words">
                                        <p className="text-gray-400 text-sm">Email</p>
                                        <p className="text-white font-medium break-words">{user?.email}</p>
                                    </div>
                                </div>

                            </>

                        ) : (
                            <>
                                {/* User view: Email */}
                                <div className="flex items-center space-x-4">
                                    <AiOutlineMail className="text-blue-400 text-2xl" />
                                    <div>
                                        <p className="text-gray-400 text-sm">Email</p>
                                        <p className="text-white font-medium">{user?.email}</p>
                                    </div>
                                </div>

                                {/* User view: Username */}
                                <div className="flex items-center space-x-4">
                                    <AiOutlineUser className="text-blue-400 text-2xl" />
                                    <div>
                                        <p className="text-gray-400 text-sm">Username</p>
                                        <p className="text-white font-medium">{user?.name}</p>
                                    </div>
                                </div>

                                {/* Joined & Status */}
                                <div className="flex items-center space-x-4">
                                    <AiOutlineCalendar className="text-blue-400 text-2xl" />
                                    <div>
                                        <p className="text-gray-400 text-sm">Joined</p>
                                        <p className="text-white font-medium">
                                            {user?.teamLeaderJoinedAt
                                                ? new Date(user.teamLeaderJoinedAt).toLocaleString('en-US', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })
                                                : 'Not joined yet'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <AiOutlineCheckCircle
                                        className={`text-2xl ${user?.teamLeader ? 'text-green-500' : 'text-red-500'}`}
                                    />
                                    <div>
                                        <p className="text-gray-400 text-sm">Status</p>
                                        <p className={`font-semibold ${user?.teamLeader ? 'text-green-500' : 'text-red-500'}`}>
                                            {user?.teamLeader ? 'Joined' : 'Not Joined'}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

            </div>

            {/* Team Members Grid (Below Profile Section) */}
            {teamMembers.length > 0 && role === 'admin' && (
                <div className="max-w-5xl w-full mt-10">
                    <h2 className="text-xl font-semibold mb-4 text-center sm:text-left">My Team Members</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teamMembers.map((member) => (
                            <div
                                key={member._id}
                                className="flex items-center bg-gray-800 p-4 rounded-2xl shadow-lg border border-gray-700 hover:scale-105 transform transition-transform duration-300"
                            >
                                <img
                                    src={member.image || profile}
                                    alt={member.name}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-white mr-4"
                                />
                                <div>
                                    <p className="font-semibold text-white">{member.name}</p>
                                    <p className="text-gray-400 text-sm">{member.email}</p>
                                    <p className="text-gray-400 text-xs">
                                        Joined: {member.joinedAt
                                            ? new Date(member.joinedAt).toLocaleDateString('en-US', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })
                                            : 'Not joined yet'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {teamLeader && role === 'user' && (
                <div className="max-w-5xl w-full mt-10 mx-auto px-4">
                    <h2 className="text-xl font-semibold mb-4 text-center sm:text-left">My Team Leader</h2>

                    <div className="flex flex-col sm:flex-row items-center sm:items-start bg-gray-800 p-4 rounded-2xl shadow-lg border border-gray-700 hover:scale-105 transform transition-transform duration-300 mx-auto max-w-md sm:max-w-full">
                        <img
                            src={teamLeader.image || profile}
                            alt={teamLeader.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-white mb-3 sm:mb-0 sm:mr-4"
                        />

                        <div className="text-center sm:text-left break-words">
                            <p className="font-semibold text-white">{teamLeader.name}</p>
                            <p className="text-gray-400 text-sm">{teamLeader.email}</p>
                        </div>
                    </div>
                </div>
            )}



            {/* Custom Animations */}
            <style jsx>{`
    @keyframes bounce-slow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
    .animate-bounce-slow { animation: bounce-slow 2.5s infinite; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
  `}</style>
        </div>
    );
}

export default Profile;
