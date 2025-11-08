import React from "react";
import { Briefcase, Bookmark } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import { useState, useEffect } from "react";
import { u } from "framer-motion/client";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Toggle profile dropdown
  useEffect(() => {
    const handleClickOutside = () => {
      if (profileDropdownOpen) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [profileDropdownOpen]);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-20">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center justify-between space-x-8">
            {/* logo */}
            <Link to="/" className="flex items-center space-x-3 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to bg-purple-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ITConnect</span>
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-600 font-semibold hover:text-blue-600"
              >
                Việc làm
              </Link>
              <Link
                to="/saved-jobs"
                className="text-gray-600 font-semibold hover:text-blue-600"
              >
                Tạo CV
              </Link>
              <Link
                to="/"
                className="text-gray-600 font-semibold hover:text-blue-600"
              >
                Cẩm nang nghề nghiệp
              </Link>
              <Link
                to="/saved-jobs"
                className="text-gray-600 font-semibold hover:text-blue-600"
              >
                Luyện phỏng vấn với AI
              </Link>
            </div>
          </div>

          {/* auth btn */}
          <div className="flex items-center space-x-3">
            {user && (
              <button
                className="cursor-pointer p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 relative"
                onClick={() => navigate("/saved-jobs")}
              >
                <Bookmark className="w-5 h-5 text-gray-500" />
              </button>
            )}
            {isAuthenticated ? (
              <ProfileDropdown
                isOpen={profileDropdownOpen}
                onToggle={(e) => {
                  e.stopPropagation();
                  setProfileDropdownOpen(!profileDropdownOpen);
                }}
                avatar={user?.avatar}
                companyName={user?.name}
                email={user?.email}
                userRole={user?.role}
                onLogout={logout}
              />
            ) : (
              <div>
                <a
                  onClick={() => navigate("/login")}
                  className="text-gray-600 hover:text-gray-900 transition-colors font-medium cursor-pointer px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Đăng nhập
                </a>
                <a
                  onClick={() => navigate("/signup")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium cursor-pointer"
                >
                  Đăng ký
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
