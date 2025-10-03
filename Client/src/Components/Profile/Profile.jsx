import { AiOutlineCalendar, AiOutlineCheckCircle, AiOutlineMail, AiOutlineUser } from "react-icons/ai";
import profile from '../../assets/profile.png';
import { useUser } from '../../context/UserContext'; // ✅ Import the context hook
function Profile() {
    const { logout, role, user } = useUser(); // ✅ Use context

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white flex items-start justify-center relative overflow-hidden p-6 md:p-12">
            {/* Decorative Background Circles */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-700/30 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>

            <div className="flex flex-col md:flex-row max-w-5xl w-full gap-8 md:gap-10 mt-12 md:mt-6">
                {/* Left Side - Profile Info */}
                <div className="relative bg-gradient-to-b from-blue-700 to-blue-500 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center hover:scale-105 transform transition-transform duration-500 w-full md:w-80">
                    <div className="absolute inset-0 bg-black/20 rounded-3xl"></div>

                    <img
                        src={user?.image ? user?.image : profile}
                        alt={user?.name}
                        className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white object-cover mb-4 shadow-xl z-10 animate-bounce-slow"
                    />

                    <div className="text-center z-10">
                        <h1 className="text-3xl md:text-4xl font-bold drop-shadow-lg">{user.name}</h1>
                        <p className="text-blue-200 text-lg md:text-xl mt-1">{role}</p>
                    </div>
                </div>

                {/* Right Side - Details Card */}
                <div className="flex-1 bg-gray-900/70 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-blue-500/30 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-700">
                        {/* Email */}
                        <div className="flex items-center px-6 py-5 space-x-4 hover:bg-gray-800/40 transition-colors cursor-pointer group">
                            <AiOutlineMail className="text-blue-400 text-2xl group-hover:scale-110 transition-transform duration-300" />
                            <div>
                                <p className="text-gray-400 text-sm">Email</p>
                                <p className="text-white font-medium">{user.email}</p>
                            </div>
                        </div>

                        {/* Username */}
                        <div className="flex items-center px-6 py-5 space-x-4 hover:bg-gray-800/40 transition-colors cursor-pointer group">
                            <AiOutlineUser className="text-blue-400 text-2xl group-hover:scale-110 transition-transform duration-300" />
                            <div>
                                <p className="text-gray-400 text-sm">Username</p>
                                <p className="text-white font-medium">{user.name}</p>
                            </div>
                        </div>

                        {/* Joined */}
                        <div className="flex items-center px-6 py-5 space-x-4 hover:bg-gray-800/40 transition-colors cursor-pointer group">
                            <AiOutlineCalendar className="text-blue-400 text-2xl group-hover:scale-110 transition-transform duration-300" />
                            <div>
                                <p className="text-gray-400 text-sm">Joined</p>
                                <p className="text-white font-medium">{user.joined}</p>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center px-6 py-5 space-x-4 hover:bg-gray-800/40 transition-colors cursor-pointer group">
                            <AiOutlineCheckCircle
                                className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${user.teamLeader ? "text-green-500" : "text-red-500"}`}
                            />
                            <div>
                                <p className="text-gray-400 text-sm">Status</p>
                                <p
                                    className={`font-semibold ${user.teamLeader ? "text-green-500" : "text-red-500"
                                        }`}
                                >
                                    {user.teamLeader ? "Joined" : "Not Joined"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Edit Profile Button */}
                    <div className="px-6 py-6 flex justify-center">
                        <button className="bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 transition-colors text-white font-semibold py-3 px-10 rounded-full shadow-lg hover:scale-105 transform duration-300">
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

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
