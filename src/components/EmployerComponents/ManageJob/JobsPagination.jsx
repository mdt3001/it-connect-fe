import React from "react";

function JobsPagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="bg-white px-6 py-4 border border-gray-200 rounded-2xl shadow-xl shadow-black/5 mt-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Trang {currentPage} / {totalPages}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Trước
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobsPagination;
