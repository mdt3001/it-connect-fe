import React, { useState, useEffect, useCallback, memo } from "react";
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

// Memoized NavigationItem để tránh re-render không cần thiết
const NavigationItem = memo(({ item, isActive, onClick, isCollapsed }) => {
  const Icon = item.icon;
  return (
    <button
      onClick={() => onClick(item.id)}
      className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors duration-200 ${
        isActive
          ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-100"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      }`}
      aria-label={item.name} // Thêm accessibility
    >
      <Icon
        className={`mr-3 h-5 w-5 flex-shrink-0 ${
          isActive ? "text-blue-600" : "text-gray-500"
        }`}
        aria-hidden="true"
      />
      {!isCollapsed && <span className="truncate">{item.name}</span>}
    </button>
  );
});

NavigationItem.displayName = "NavigationItem";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Lấy id menu từ URL hiện tại một cách hiệu quả hơn
  const currentNavId = useCallback(() => {
    return location.pathname.split("/")[1] || "employer-dashboard";
  }, [location.pathname]);

  // useEffect cho resize, tối ưu bằng useCallback
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Gọi ngay để set initial state
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close dropdown khi click outside, tối ưu dependency
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownOpen && !event.target.closest(".profile-dropdown")) {
        setProfileDropdownOpen(false);
      }
    };
    if (profileDropdownOpen) {
      // Chỉ add listener khi open
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [profileDropdownOpen]);

  // useCallback cho các handler để tránh re-render con
  const handleNavigation = useCallback(
    (itemId) => {
      if (isMobile) setSidebarOpen(false);
      navigate(`/${itemId}`);
    },
    [isMobile, navigate]
  );

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    setProfileDropdownOpen(false); // Đóng dropdown trước khi logout
    logout();
  }, [logout]);

  const toggleProfileDropdown = useCallback(() => {
    setProfileDropdownOpen((prev) => !prev);
  }, []);

  // Loại bỏ sidebarCollapsed vì luôn false, có thể implement sau nếu cần
  const sidebarWidth = isMobile ? 0 : 64; // Giả sử không collapse, width cố định 64 cho icon-only nếu cần
  const isCollapsed = false; // Placeholder, có thể dùng state sau

  console.log(user)

  return (
    <div className="flex h-screen bg-gray-50" role="main">
      {" "}
      {/* Thêm role cho accessibility */}
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 transform bg-white border-r border-gray-200 shadow-lg ${
          isMobile
            ? sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        } ${isCollapsed ? "w-16" : "w-64"}`}
        aria-label="Main navigation"
      >
        {/* Company Logo */}
        <div className="flex items-center h-16 border-b border-gray-200 pl-6">
          {isCollapsed ? (
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
              <Briefcase className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
          ) : (
            <Link
              to="/"
              className="flex items-center space-x-3"
              aria-label="Home"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <span className="font-semibold text-gray-900">IT Connect</span>
            </Link>
          )}
        </div>

        {/* Navigation Menu */}
        <nav
          className="p-4 space-y-2"
          role="navigation"
          aria-label="Dashboard navigation"
        >
          {NAVIGATION_MENU.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              isActive={currentNavId() === item.id}
              onClick={handleNavigation}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors duration-200 ${
              isCollapsed ? "justify-center" : "justify-start"
            }`}
            aria-label="Log out"
          >
            <LogOut className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
            {!isCollapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      {/* Main content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isMobile ? "ml-0" : isCollapsed ? "ml-16" : "ml-64"
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
                  aria-label={sidebarOpen ? "Close menu" : "Open menu"}
                  aria-expanded={sidebarOpen}
                >
                  {sidebarOpen ? (
                    <X className="w-6 h-6" aria-hidden="true" />
                  ) : (
                    <Menu className="w-6 h-6" aria-hidden="true" />
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
        <main className="flex-1 overflow-auto p-6" role="main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default memo(DashboardLayout); // Memo toàn bộ component để tránh re-render không cần thiết
