import React from "react";
import { X } from "lucide-react";
import FilterContent from "./FilterContent";

const MobileFilterOverlay = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  expandedSections,
  onToggleSection,
  onClearAllFilters,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="font-bold text-gray-900 text-lg">Bộ lọc</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto h-full pb-20">
          <FilterContent
            toggleSection={onToggleSection}
            clearAllFilters={onClearAllFilters}
            expandedSections={expandedSections}
            filters={filters}
            handleFilterChange={onFilterChange}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileFilterOverlay;
