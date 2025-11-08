import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const jobTypes = [
    {
        label: "Remote",
        value: "REMOTE",
    },
    {
        label: "Full-Time",
        value: "FULL_TIME",
    },
    {
        label: "Part-Time",
        value: "PART_TIME",
    },
    {
        label: "Contract",
        value: "CONTRACT",
    },
    {
        label: "Internship",
        value: "INTERNSHIP",
    },
];
const categories = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "IT & Software",
  "Customer-service",
  "Product",
  "Operations",
  "Finance",
  "HR",
  "Other",
];

const FilterContent = ({
  toggleSection,
  clearAllFilters,
  expandedSections,
  filters,
  handleFilterChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Clear All */}
      <button
        onClick={clearAllFilters}
        className="text-blue-600 text-sm font-semibold hover:text-blue-700"
      >
        Xoá tất cả bộ lọc
      </button>

      {/* Job Type */}
      <div className="border-b border-gray-200 pb-6">
        <button
          onClick={() => toggleSection("jobType")}
          className="flex items-center justify-between w-full mb-4"
        >
          <h4 className="font-semibold text-gray-900">Loại công việc</h4>
          {expandedSections.jobType ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSections.jobType && (
          <div className="space-y-3">
            {jobTypes.map((type) => (
              <label
                key={type.value}
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.type === type.value}
                  onChange={(e) =>
                    handleFilterChange("type", e.target.checked ? type.value : "")
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-700 group-hover:text-gray-900">
                  {type.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Salary Range */}
      <div className="border-b border-gray-200 pb-6">
        <button
          onClick={() => toggleSection("salary")}
          className="flex items-center justify-between w-full mb-4"
        >
          <h4 className="font-semibold text-gray-900">Khoảng lương</h4>
          {expandedSections.salary ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSections.salary && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Lương tối thiểu
              </label>
              <input
                type="number"
                placeholder="0 triệu VND"
                value={filters.minSalary}
                onChange={(e) =>
                  handleFilterChange("minSalary", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Lương tối đa
              </label>
              <input
                type="number"
                placeholder="999 triệu VND"
                value={filters.maxSalary}
                onChange={(e) =>
                  handleFilterChange("maxSalary", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Category */}
      <div>
        <button
          onClick={() => toggleSection("category")}
          className="flex items-center justify-between w-full mb-4"
        >
          <h4 className="font-semibold text-gray-900">Danh mục</h4>
          {expandedSections.category ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSections.category && (
          <div className="space-y-3">
            {categories.map((cat) => (
              <label
                key={cat}
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.category === cat}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.checked ? cat : "")
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-700 group-hover:text-gray-900">
                  {cat}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterContent;
