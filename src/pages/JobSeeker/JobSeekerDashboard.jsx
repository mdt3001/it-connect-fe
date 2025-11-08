import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

import Navbar from "../../components/layout/Navbar";
import LoadingSpinner from "../../components/LoadingSpinner";
import SearchHeader from "../../components/JobSeekerComponents/JobSeekerDashboard/SearchHeader";
import FilterContent from "../../components/JobSeekerComponents/JobSeekerDashboard/FilterContent";
import ResultsHeader from "../../components/JobSeekerComponents/JobSeekerDashboard/ResultsHeader";
import JobsGrid from "../../components/JobSeekerComponents/JobSeekerDashboard/JobsGrid";
import PaginationControls from "../../components/JobSeekerComponents/JobSeekerDashboard/PaginationControls";
import MobileFilterOverlay from "../../components/JobSeekerComponents/JobSeekerDashboard/MobileFilterOverlay";

import { useJobFilters } from "../../hooks/jobseeker/useJobFilters";

const JobSeekerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    jobType: true,
    salary: true,
    category: true,
  });

  const {
    jobs,
    loading,
    pagination,
    tempFilters,
    appliedFilters,
    handleTempFilterChange,
    handleSearch,
    handleSidebarFilterChange,
    clearAllFilters,
    handlePageChange,
    fetchJobs,
  } = useJobFilters(user);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleSaveJob = async (jobId, isSaved) => {
    try {
      if (isSaved) {
        await axiosInstance.delete(API_PATHS.JOB.UNSAVE_JOB(jobId));
        toast.success("Đã xóa khỏi việc làm đã lưu");
      } else {
        await axiosInstance.post(API_PATHS.JOB.SAVE_JOB(jobId));
        toast.success("Đã thêm vào việc làm đã lưu");
      }
      fetchJobs(appliedFilters, pagination.pageNo);
    } catch (error) {
      toast.error("Đã xảy ra lỗi");
      console.error("Error toggling saved job:", error);
    }
  };

  const applyToJob = async (jobId) => {
    try {
      await axiosInstance.post(API_PATHS.APPLICATION.APPLY_TO_JOB(jobId));
      toast.success("Ứng tuyển thành công");
      fetchJobs(appliedFilters, pagination.pageNo);
    } catch (error) {
      toast.error("Đã xảy ra lỗi");
      console.error("Error applying to job:", error);
    }
  };

  const formatSalary = (salaryMin, salaryMax) => {
    if (salaryMin && salaryMax) {
      return `${(salaryMin / 1000000).toFixed(0)}-${(
        salaryMax / 1000000
      ).toFixed(0)} triệu`;
    }
    if (salaryMin) return `${(salaryMin / 1000000).toFixed(0)} triệu`;
    return "Thỏa thuận";
  };

  const formatJobType = (type) => {
    const typeMap = {
      FULL_TIME: "Full-Time",
      PART_TIME: "Part-Time",
      CONTRACT: "Contract",
      INTERNSHIP: "Internship",
      REMOTE: "Remote",
    };
    return typeMap[type] || type;
  };

  const formattedJobs = jobs.map((job) => ({
    id: job.jobId,
    title: job.title,
    company: job.companyName,
    location: job.location,
    type: formatJobType(job.type),
    category: job.category,
    salary: formatSalary(job.salaryMin, job.salaryMax),
    description: job.description,
    requirement: job.requirement,
    applicationCount: job.applicationCount,
    isSaved: job.saved || false,
    hasApplied: job.applied || false,
    closed: job.closed,
  }));

  if (loading && jobs.length === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="min-h-screen mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
          <SearchHeader
            filters={tempFilters}
            handleFilterChange={handleTempFilterChange}
            onSearch={handleSearch}
          />

          <div className="flex gap-6 lg:gap-8">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 sticky top-20">
                <h3 className="font-bold text-gray-900 text-xl mb-6">
                  Bộ lọc tìm kiếm
                </h3>
                <FilterContent
                  toggleSection={toggleSection}
                  clearAllFilters={clearAllFilters}
                  expandedSections={expandedSections}
                  filters={appliedFilters}
                  handleFilterChange={handleSidebarFilterChange}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <ResultsHeader
                pagination={pagination}
                jobsCount={jobs.length}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onShowMobileFilters={() => setShowMobileFilters(true)}
              />

              <JobsGrid
                jobs={formattedJobs}
                loading={loading}
                onJobClick={(jobId) => navigate(`/jobs/${jobId}`)}
                onToggleSave={toggleSaveJob}
                onApply={applyToJob}
                onClearFilters={clearAllFilters}
                viewMode={viewMode}
              />

              <PaginationControls
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      <MobileFilterOverlay
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        filters={appliedFilters}
        onFilterChange={handleSidebarFilterChange}
        expandedSections={expandedSections}
        onToggleSection={toggleSection}
        onClearAllFilters={clearAllFilters}
      />
    </div>
  );
};

export default JobSeekerDashboard;
