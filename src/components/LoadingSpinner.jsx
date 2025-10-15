import React from "react";
import { Briefcase } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to bg-purple-50 flex items-center justify-center ">
      <div className="text-center" />
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mt-6 mx-auto "></div>
        <div className="absolute inset-0 flex items-center justify-center ">
          <Briefcase className="w-6 h-6 text-blue-600" />
        </div>
        <p className="text-gray-600 text-lg">Đang tải...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
