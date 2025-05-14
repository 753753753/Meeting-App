import React, { useState, useRef, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import profile from '../../assets/avatar.png';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext'; // ✅ Import the context hook

const Header = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { logout, role } = useUser(); // ✅ Use context

  const handleLogout = () => {
    logout(); // ✅ Use centralized logout function
    navigate('/login');
  };

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
        <img
          src={profile}
          alt="Profile"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-8 h-8 rounded-full object-cover border-2 border-white cursor-pointer"
        />

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-[#1C1F2E] text-white rounded-lg shadow-lg py-2 z-50">
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-800 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </button>
            {role === 'admin' && (
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-800 cursor-pointer"
                onClick={() => navigate('/admindashboard')}
              >
                ManageUser
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
