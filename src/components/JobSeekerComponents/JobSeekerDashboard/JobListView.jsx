import React from "react";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Bookmark,
  ExternalLink,
  Building2,
} from "lucide-react";
import StatusBadge from "../../EmployerComponents/Application/StatusBadge";

const JobListView = ({ job, onClick, onToggleSave, onApply }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={() => onClick(job.id)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          {/* Left section - Job info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-4 mb-4">
              {/* Company logo placeholder */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-8 h-8 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-gray-900 mb-1 truncate">
                  {job.title}
                </h3>
                <p className="text-gray-600 font-medium mb-2">{job.company}</p>

                {/* Tags */}
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
            </div>

            {/* Application count */}
            <p className="text-xs text-gray-500">
              {job.applicationCount} người đã ứng tuyển
            </p>
          </div>

          {/* Right section - Actions */}
          <div className="flex flex-col gap-2 items-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(job.id, job.isSaved);
              }}
              className={`p-2 rounded-lg transition-colors ${
                job.saved
                  ? "bg-blue-50 text-blue-600"
                  : "bg-gray-50 text-gray-400 hover:bg-gray-100"
              }`}
            >
              <Bookmark
                className="w-5 h-5"
                fill={job.saved ? "currentColor" : "none"}
              />
            </button>

            {!job.applied && !job.closed ? (
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
              <StatusBadge status={job.closed ? "CLOSED" : job.status} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListView;
