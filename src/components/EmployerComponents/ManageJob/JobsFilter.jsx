import React from "react";
import { Search } from "lucide-react";

function JobsFilter({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusChange,
  totalItems,
}) {
  return (
    <div className="bg-white/80 backdrop:blur-sm rounded-2xl shadow-xl shadow-black/5 p-4 mb-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề hoặc địa điểm..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-0 transition-all duration-200"
          />
        </div>

        {/* Status Filter */}
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-0 transition-all duration-200"
          >
            <option value="All">Tất cả trạng thái</option>
            <option value="Active">Đang hoạt động</option>
            <option value="Closed">Đã đóng</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mt-4">
        <p className="text-sm text-gray-600">Hiển thị {totalItems} việc làm</p>
      </div>
    </div>
  );
}

export default JobsFilter;
