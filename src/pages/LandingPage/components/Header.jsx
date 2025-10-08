import React from "react";
import { Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Header() {
  const isAuthenticated = true; // Replace with actual authentication logic
  const user = { fullName: "mdt", role: "employer" }; // Replace with actual user data
  const navigate = useNavigate();
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 bg-white backdrop:blur-sm border-b border-gray-100"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* logo */}
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to bg-purple-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ITConnect</span>
          </div>

          {/* nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              onClick={() => navigate("/find-jobs")}
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium cursor-pointer"
            >
              Tìm việc ngay 
            </a>

            <a
              onClick={() =>
                navigate(
                  isAuthenticated && user?.role === "employer"
                    ? "/employer-dashboard"
                    : "/login"
                )
              }
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium cursor-pointer"
            >
              Dành cho Nhà tuyển dụng
            </a>
          </nav>

          {/* Auth button */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-gray-700">Xin chào, {user?.fullName}</span>
                <a
                  href={
                    user?.role === "employer"
                      ? "/employer-dashboard"
                      : "/find-jobs"
                  }
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Dashboard
                </a>
              </div>
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
    </motion.header>
  );
}

export default Header;
