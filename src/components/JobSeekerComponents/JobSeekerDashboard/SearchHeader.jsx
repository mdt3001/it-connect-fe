import React from "react";
import { Search, MapPin } from "lucide-react";

const SearchHeader = ({ filters, handleFilterChange, onSearch }) => {
  // Handler để submit khi nhấn Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Tìm kiếm việc làm phù hợp
      </h1>
      <p className="text-gray-600 mb-6 ml-2">
        Khám phá cơ hội phù hợp với đam mê của bạn
      </p>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Việc làm, từ khoá..."
            value={filters.keyword}
            onChange={(e) => handleFilterChange("keyword", e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="lg:w-80 relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Địa điểm"
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={onSearch}
          className="bg-blue-600 text-white cursor-pointer flex items-center px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          <Search className="w-5 h-5 mr-2" />
          Tìm kiếm
        </button>
      </div>
    </div>
  );
};

export default SearchHeader;
