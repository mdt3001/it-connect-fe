import React from "react";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Bookmark,
  ExternalLink,
  Building2,
} from "lucide-react";
import JobStatusBadge from "../../EmployerComponents/Application/StatusBadge";

const JobCard = ({ job, onClick, onToggleSave, onApply }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group"
      onClick={() => onClick(job.id)}
    >
      <div className="p-6">
        {/* Company logo */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="mb-2 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-md font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {job.title}
              </h1>

              <p className="text-gray-600 font-medium text-sm mb-4">
                {job.company}
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(job.id, job.isSaved);
            }}
            className={`p-2 rounded-lg transition-colors ${
              job.isSaved
                ? "bg-blue-50 text-blue-600"
                : "bg-gray-50 text-gray-400 hover:bg-gray-100"
            }`}
          >
            <Bookmark
              className="w-5 h-5"
              fill={job.isSaved ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* Tags */}
        <div className="space-y-2 mb-4">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-700">
              <MapPin className="w-4 h-4 mr-1" />
              {job.location}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-green-50 text-green-700">
              <Briefcase className="w-4 h-4 mr-1" />
              {job.type}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-purple-50 text-purple-700">
              {job.salary}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {job.applicationCount} ứng tuyển
          </p>

          {/* Use JobStatusBadge for consistent styling */}
          {!job.hasApplied && !job.closed ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApply(job.id);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              Ứng tuyển
              <ExternalLink className="w-4 h-4" />
            </button>
          ) : (
            <JobStatusBadge hasApplied={job.hasApplied} closed={job.closed} />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
