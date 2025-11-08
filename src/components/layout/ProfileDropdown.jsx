import React from "react";
import { Link } from "react-router-dom";
import { User, FileText, LogOut, ChevronDown } from "lucide-react";
import { a } from "framer-motion/client";

const ProfileDropdown = ({
  isOpen,
  onToggle,
  avatar,
  companyName,
  email,
  role,
  onLogout,
}) => {
  return (
    <div className="relative profile-dropdown">
      {/* Profile Button */}
      <button
        onClick={onToggle}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      >
        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
          {avatar ? (
            <img
              src={avatar}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-white" />
          )}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900">
            {companyName || "User"}
          </p>
          <p className="text-xs text-gray-500">{email || "user@example.com"}</p>
        </div>
        <ChevronDown
          className={`hidden md:block w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <Link
            to={role === "employer" ? "/company-profile" : "/profile"}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            onClick={() => onToggle()}
          >
            <User className="w-4 h-4 mr-3" />
            Hồ sơ cá nhân
          </Link>
          <Link
            to={role === "employer" ? "/employer-settings" : "/settings"}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            onClick={() => onToggle()}
          >
            <FileText className="w-4 h-4 mr-3" />
            Cài đặt
          </Link>
          <hr className="my-1" />
          <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors duration-200"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
