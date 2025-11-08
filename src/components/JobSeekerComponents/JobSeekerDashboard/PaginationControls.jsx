import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PaginationControls = ({ pagination, onPageChange }) => {
  if (pagination.totalPage <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(pagination.pageNo - 1)}
        disabled={pagination.pageNo === 0}
        className={`p-2 rounded-lg transition-colors ${
          pagination.pageNo === 0
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {Array.from({ length: pagination.totalPage }, (_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            pagination.pageNo === i
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(pagination.pageNo + 1)}
        disabled={pagination.pageNo === pagination.totalPage - 1}
        className={`p-2 rounded-lg transition-colors ${
          pagination.pageNo === pagination.totalPage - 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default PaginationControls;
