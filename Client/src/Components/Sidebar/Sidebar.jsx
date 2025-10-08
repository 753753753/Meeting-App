import { CgProfile } from "react-icons/cg";
import { FaCalendarAlt, FaClock, FaHome, FaSignOutAlt, FaTimes, FaUser, FaVideo } from 'react-icons/fa';
import { GiRamProfile } from "react-icons/gi";
import { RiChatSmile3Fill, RiTeamFill } from "react-icons/ri";
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo (2).png';
import { useUser } from '../../context/UserContext'; // ✅ Import the context hook
export default function Sidebar({ isOpen, onClose, onLogout }) {
  const location = useLocation();
  const { logout, role, user } = useUser(); // ✅ Use context

  let navItems = [];

  // Common for all roles
  const commonItems = [
    { label: 'Home', icon: <FaHome />, path: '/dashboard' },
    { label: 'Profile', icon: <CgProfile />, path: '/proflie' },
  ];

  if (role === 'admin') {
    navItems = [
      ...commonItems,
      { label: 'Upcoming', icon: <FaCalendarAlt />, path: '/upcoming' },
      { label: 'Previous', icon: <FaClock />, path: '/previous' },
      { label: 'Recordings', icon: <FaVideo />, path: '/recordings' },
      { label: 'Personal Room', icon: <FaUser />, path: '/room' },
      { label: 'Chat Us', icon: <RiChatSmile3Fill />, path: '/chat' },
      { label: 'Team Members', icon: <RiTeamFill />, path: '/chats' },
    ];
  } else if (role === 'user') {
    if (!user?.teamLeader) {
      // teamleader is null, show only Home and Profile
      navItems = [...commonItems];
    } else {
      // teamleader exists, show all user items
      navItems = [
        ...commonItems,
        { label: 'Upcoming', icon: <FaCalendarAlt />, path: '/upcoming' },
        { label: 'Previous', icon: <FaClock />, path: '/previous' },
        { label: 'Recordings', icon: <FaVideo />, path: '/recordings' },
        { label: 'Personal Room', icon: <FaUser />, path: '/room' },
        { label: 'Chat Us', icon: <RiChatSmile3Fill />, path: '/chat' },
        { label: 'Team Leader', icon: <GiRamProfile />, path: '/chats' },
      ];
    }
  }


  const handleLogout = () => {
    logout(); // ✅ Use centralized logout function
    navigate('/login');
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-[#1C1F2E] text-white px-4 py-4 md:py-0 z-40 
  transform transition-transform duration-300 
  ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
  md:translate-x-0 md:static md:block md:transform-none flex flex-col`}
      >
        {/* Top Section */}
        <div>
          <div className="flex items-center justify-between mb-8 md:mb-0">
            <div className="hidden md:flex items-center">
              <img src={logo} alt="LinkUp Logo" className="w-20 h-20" />
              <h1 className="text-2xl font-bold relative -translate-x-4">LINK UP</h1>
            </div>
            {/* Close button on mobile */}
            <button className="md:hidden" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          <nav className="space-y-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left hover:bg-gray-800 ${isActive ? 'bg-gray-800 font-semibold' : ''
                    }`}
                  onClick={onClose}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Settings + Logout */}
        <div className="mt-10 left-4 right-4 flex items-center p-3 rounded-2xl border border-gray-700">
          {/* Profile Picture */}
          {user?.image ? (
            <img
              src={user.image}
              alt={user?.name || "User Profile"}
              className="w-10 h-10 rounded-full mr-4 object-cover"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white mr-4"
              style={{
                backgroundColor: user?.name
                  ? `hsl(${user.name.charCodeAt(0) * 15 % 360}, 70%, 50%)`
                  : "#999"
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          )}


          {/* Username */}
          <p className="flex-1 text-white font-semibold text-sm">{user?.name}</p>

          {/* Logout Icon */}
          <button
            onClick={handleLogout}
            title="Logout"
            className="ml-4 text-white hover:text-red-500 transition-colors duration-200 cursor-pointer"
          >
            <FaSignOutAlt className="text-lg" />
          </button>
        </div>
      </div>

    </>
  );
}
