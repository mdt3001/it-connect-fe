import React from "react";
import JobCard from "./JobCard";
import LoadingSpinner from "../../LoadingSpinner";
import JobListView from "./JobListView";

const JobsGrid = ({
  jobs,
  loading,
  onJobClick,
  onToggleSave,
  onApply,
  onClearFilters,
  viewMode,
}) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl">
        <p className="text-gray-500 text-lg">Không tìm thấy việc làm phù hợp</p>
        <button
          onClick={onClearFilters}
          className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
        >
          Xóa bộ lọc
        </button>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onClick={() => onJobClick(job.id)}
            onToggleSave={() => onToggleSave(job.id, job.saved)}
            onApply={() => onApply(job.id)}
          />
        ))}
      </div>
    );
  }

  // List view (1 column)
  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobListView
          key={job.id}
          job={job}
          onClick={() => onJobClick(job.id)}
          onToggleSave={() => onToggleSave(job.id, job.saved)}
          onApply={() => onApply(job.id)}
        />
      ))}
    </div>
  );
};

export default JobsGrid;
