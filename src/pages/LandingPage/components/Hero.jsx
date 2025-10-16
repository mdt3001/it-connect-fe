import React from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight, Users, Building2, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
function Hero() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const stats = [
    { icon: Users, label: "Người dùng", value: "1,200+" },
    { icon: Building2, label: "Công ty", value: "500+" },
    { icon: TrendingUp, label: "Công việc đã đăng", value: "3,000+" },
  ];

  return (
    <section className="pt-24 pb-16 bg-white min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* main heading     */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight pt-10"
          >
            Kết nối cơ hội IT nhanh chóng và hiệu quả
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Tìm việc làm mơ ước hoặc tuyển dụng nhân tài công nghệ chỉ với vài
            cú click.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/find-jobs")}
              className="group cursor-pointer flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium"
            >
              <Search className="w-5 h-5 mr-2" />
              <span>Tìm việc ngay</span>
              <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                navigate(
                  isAuthenticated && user?.role === "employer"
                    ? "/employer-dashboard"
                    : "/login"
                )
              }
              className="bg-white border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center cursor-pointer"
            >
              Tuyển dụng ngay
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 + idx * 0.1 }}
                className="flex flex-col items-center space-y-2 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-2">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* subtle background elements*/}
      {/* <div className="absolute inset-0 overflow-hidden pointer-events-none ">
        <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-blue-100 rounded-full opacity-20 filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-1/4 right-1/2 w-96 h-96 bg-purple-100 rounded-full opacity-20 filter blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 opacity-50"></div>
      </div> */}
    </section>
  );
}

export default Hero;
