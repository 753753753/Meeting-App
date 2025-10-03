import { FaCalendarAlt, FaClock, FaCog, FaHome, FaSignOutAlt, FaTimes, FaUser, FaVideo } from 'react-icons/fa';
import { RiChatSmile3Fill } from "react-icons/ri";
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo (2).png';
import { useUser } from '../../context/UserContext'; // ✅ Import the context hook
import profile from '../../assets/profile.png';

const navItems = [
  { label: 'Home', icon: <FaHome />, path: '/dashboard' },
  { label: 'Upcoming', icon: <FaCalendarAlt />, path: '/upcoming' },
  { label: 'Previous', icon: <FaClock />, path: '/previous' },
  { label: 'Recordings', icon: <FaVideo />, path: '/recordings' },
  { label: 'Personal Room', icon: <FaUser />, path: '/room' },
  { label: 'Chat Us', icon: <RiChatSmile3Fill />, path: '/chat' },
  { label: 'Settings', icon: <FaCog />, path: '/settings' },
];
export default function Sidebar({ isOpen, onClose, onLogout }) {
  const location = useLocation();
  const { logout, role, user } = useUser(); // ✅ Use context
  console.log(user);
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
      <div className={`fixed top-0 left-0 h-screen w-64 bg-[#1C1F2E] text-white p-4 z-40 
        transform transition-transform duration-300 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:block md:transform-none flex flex-col justify-between`}>

        {/* Top Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <img src={logo} alt="LinkUp Logo" className="w-10 h-10 mr-2" />
              <h1 className="text-2xl font-bold">LINK UP</h1>
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
                  className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left hover:bg-gray-800 ${isActive ? 'bg-gray-800 font-semibold' : ''}`}
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
        <div className="mt-15 flex items-center p-3 rounded-2xl border border-gray-700">
          {/* Profile Picture */}
          <img
            src={user?.image ? user?.image : profile}
            alt="User Profile"
            className="w-10 h-10 rounded-full mr-4 object-cover"
          />

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
