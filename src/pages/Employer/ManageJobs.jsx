import React from "react";
import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  X,
  Trash2,
  ChevronUp,
  ChevronDown,
  Users,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
function ManageJobs() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 8;

  return (
    <DashboardLayout activeMenu="manage-jobs">
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* header */}
          <div className="mb-8">
            <div className="flex flex-row items-center justify-between">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                  Quản lý việc làm
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Quản lý tin tuyển dụng và theo dõi hồ sơ ứng tuyển
                </p>
              </div>
              <button
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-xl shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
                onClick={() => navigate("/post-job")}
              >
                <Plus className="w-5 h-5 mr-2" /> Thêm việc làm
              </button>
            </div>
          </div>

          {/* filter */}
          <div className="bg-white/80 backdrop:blur-sm rounded-2xl shadow-xl shadow-black/5 p-4 mb-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* search */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400"/>
                </div>
                <input 
                  type="text"
                  placeholder="Tìm kiếm công việc...."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-0 transition-all duration-200"
                />
              </div>

              {/* status filter */}
              <div className="sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-0 transition-all duration-200"
                >
                  <option value="All">Tất cả trạng thái</option>
                  <option value="Active">Đang hoạt động</option>
                  <option value="Closed">Đã đóng</option>
                </select>
              </div>

              {/* Results Summary */}
              <div className="my-4">
                <p className="text-sm text-gray-600">
                  {/* Hiển thị { paginatedJobs.length } của { filteredAndSortedJobs.length } việc làm */}
                </p>
              </div>

              {/* Table  */}
              
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ManageJobs;
