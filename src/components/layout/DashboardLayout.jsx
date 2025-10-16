import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Building2,
  LogOut,
  Menu,
  X,
  User,
  ChevronDown,
  Search,
  Heart,
  FileText,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { NAVIGATION_MENU } from "../../utils/data";
import ProfileDropdown from "../../components/layout/ProfileDropdown";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Lấy id menu từ URL hiện tại
  const currentNavId = location.pathname.split("/")[1] || "employer-dashboard";

  const NavigationItem = ({ item, isActive, onClick, isCollapsed }) => {
    const Icon = item.icon;
    return (
      <button
        onClick={() => onClick(item.id)}
        className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors duration-200 ${
          isActive
            ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-100"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        }`}
      >
        <Icon
          className={`mr-3 h-5 w-5 flex-shrink-0 ${
            isActive ? "text-blue-600" : "text-gray-500"
          }`}
        />
        {!isCollapsed && <span className="truncate">{item.name}</span>}
      </button>
    );
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownOpen && !event.target.closest(".profile-dropdown")) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [profileDropdownOpen]);

  const handleNavigation = (itemId) => {
    if (isMobile) setSidebarOpen(false);
    navigate(`/${itemId}`);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const sidebarCollapsed = !isMobile && false;
  console.log(user);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 transform ${
          isMobile
            ? sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        } ${
          sidebarCollapsed ? "w-16" : "w-64"
        } bg-white border-r border-gray-200 shadow-lg`}
      >
        {/* Company Logo */}
        <div className="flex items-center h-16 border-b border-gray-200 pl-6">
          {!sidebarCollapsed ? (
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">IT Connect</span>
            </Link>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {NAVIGATION_MENU.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              isActive={currentNavId === item.id}
              onClick={handleNavigation}
              isCollapsed={sidebarCollapsed}
            />
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors duration-200 ${
              sidebarCollapsed ? "justify-center" : "justify-start"
            }`}
          >
            <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isMobile ? "ml-0" : sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              {isMobile && (
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                >
                  {sidebarOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              )}

              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back{user?.name ? `, ${user.name}` : ""}!
                </h1>
                <p className="text-gray-600">Here's your dashboard overview.</p>
              </div>
            </div>

            <ProfileDropdown
              isOpen={profileDropdownOpen}
              onToggle={toggleProfileDropdown}
              avatar={user?.avatar}
              companyName={user?.name}
              email={user?.email}
              onLogout={handleLogout}
            />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
