import { useEffect, useRef, useState } from 'react';
import { BiChevronDown } from 'react-icons/bi'; // arrow icon
import { CgProfile } from "react-icons/cg";
import { FaBars, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import profile from '../../assets/profile.png';
import { useUser } from '../../context/UserContext'; // ✅ Import the context hook


const Header = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { logout, role, user } = useUser(); // ✅ Use context
  console.log(user?.image)
  const handleLogout = () => {
    logout(); // ✅ Use centralized logout function
    navigate('/login');
  };
  const handleprofile = () => {
    navigate('/proflie');
    setDropdownOpen(false);
  }
  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-14 bg-[#1C1F2E] flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-50 md:left-64 md:px-6">
      <button className="text-white text-xl md:hidden" onClick={toggleSidebar}>
        <FaBars />
      </button>

      <div className="relative ml-auto" ref={dropdownRef}>
        {/* Profile Image with arrow */}
        <div className="relative w-8 h-8">
          <img
            src={user?.image ? user?.image : profile}
            alt="Profile"
            referrerPolicy="no-referrer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-8 h-8 rounded-full object-cover border-2 border-white cursor-pointer"
          />

          {/* Small dropdown arrow with background */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white/60 rounded-full flex items-center justify-center pointer-events-none">
            <BiChevronDown className="text-black w-4 h-4" />
          </div>
        </div>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-[#1C1F2E] text-white rounded-xl shadow-xl z-50 overflow-hidden border border-gray-600 cursor-pointer">
            {/* Profile Section */}
            <div className="flex items-center w-full px-4 py-2 border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200 cursor-pointer" onClick={handleprofile}>
              <CgProfile className="mr-2 text-lg" />
              Profile
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>

            {/* Admin Option */}
            {role === 'admin' && (
              <button
                className="flex items-center w-full px-4 py-2 hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                onClick={() => {
                  navigate('/admindashboard');
                  setDropdownOpen(false);
                }}
              >
                <FaUser className="mr-2" />
                Manage User
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
