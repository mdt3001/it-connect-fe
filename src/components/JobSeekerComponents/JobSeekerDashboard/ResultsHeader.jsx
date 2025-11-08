import React from "react";
import { Grid, List, Filter } from "lucide-react";

const ResultsHeader = ({
  pagination,
  jobsCount,
  viewMode,
  onViewModeChange,
  onShowMobileFilters,
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-8">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Kết quả tìm kiếm</h2>
        <p className="text-sm text-gray-600 mt-1">
          Trang {pagination.pageNo + 1} / {pagination.totalPage} - Tổng{" "}
          {jobsCount} việc làm
        </p>
      </div>

      <div className="flex items-center gap-2 mt-4 lg:mt-0">
        <button
          onClick={() => onViewModeChange("grid")}
          className={`p-2 rounded-lg transition-colors ${
            viewMode === "grid"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Grid className="w-5 h-5" />
        </button>
        <button
          onClick={() => onViewModeChange("list")}
          className={`p-2 rounded-lg transition-colors ${
            viewMode === "list"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          <List className="w-5 h-5" />
        </button>

        <button
          onClick={onShowMobileFilters}
          className="lg:hidden p-2 bg-white rounded-lg text-gray-600 hover:bg-gray-100 ml-2"
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ResultsHeader;
