// components/Navbar.tsx
'use client';

import React, { useState } from "react";
import { useRouter } from 'next/navigation';

interface NavbarProps {
  toggleSidebar?: () => void;
  title?: string;
  username?: string;
}

const Navbar: React.FC<NavbarProps> = ({ 
  toggleSidebar = () => {}, 
  title = "SmecLabs", 
  username = "User" 
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (res.ok) {
        // Redirect to login page after successful logout
        router.push('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm w-full">
      <div className="flex justify-between items-center px-4 md:px-6 py-4">
        <div className="flex items-center">
          {toggleSidebar && (
            <button
              onClick={toggleSidebar}
              className="text-[#606060] hover:text-[#2E3192]"
            >
              <span className="material-icons text-2xl">menu</span>
            </button>
          )}
          <h1 className="text-xl font-semibold text-[#606060] ml-4">
            {title}
          </h1>
        </div>
        <div className="flex items-center">
          <div className="relative">
            <button 
              onClick={toggleDropdown}
              className="flex items-center space-x-2 text-[#606060] hover:text-[#2E3192]"
            >
              <span className="material-icons">account_circle</span>
              <span className="hidden md:inline">{username}</span>
              <span className="material-icons">expand_more</span>
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg py-2 z-10">
                <a href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                  Profile
                </a>
                <a href="/settings" className="block px-4 py-2 hover:bg-gray-100">
                  Settings
                </a>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;