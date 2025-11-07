import React, { useState, useEffect } from "react";
import { Plus, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import JobsFilter from "../../components/EmployerComponents/ManageJob/JobsFilter";
import JobsTable from "../../components/EmployerComponents/ManageJob/JobsTable";
import JobsPagination from "../../components/EmployerComponents/ManageJob/JobsPagination";

function ManageJobs() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    sortField: "title",
    sortDirection: "asc",
    pageNo: 0,
    pageSize: 8,
  });

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("pageNo", filters.pageNo);
      params.append("pageSize", filters.pageSize);

      if (filters.search) {
        params.append("search", filters.search);
      }

      if (filters.status !== "All") {
        params.append("status", filters.status);
      }

      params.append("sortField", filters.sortField);
      params.append("sortDirection", filters.sortDirection);

      const response = await axiosInstance.get(
        `${API_PATHS.JOB.GET_JOB_EMPLOYER}?${params.toString()}`
      );

      if (response.data.code === 200 && response.data.result) {
        const { items, totalPage, pageSize } = response.data.result;
        setJobs(items || []);
        setTotalPages(totalPage || 0);
        setTotalItems(items?.length || 0);
      } else {
        setJobs([]);
        setTotalPages(0);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Không thể tải danh sách việc làm");
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      pageNo: key !== "pageNo" ? 0 : value, // Reset to first page when filter changes
    }));
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tin tuyển dụng này?")) {
      return;
    }

    try {
      await axiosInstance.delete(API_PATHS.JOB.DELETE_JOB(jobId));
      toast.success("Xóa tin tuyển dụng thành công");
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Không thể xóa tin tuyển dụng");
    }
  };

  const handleToggleClose = async (jobId, currentStatus) => {
    try {
      await axiosInstance.patch(API_PATHS.JOB.TOGGLE_CLOSE(jobId));
      toast.success(
        currentStatus
          ? "Mở lại tin tuyển dụng thành công"
          : "Đóng tin tuyển dụng thành công"
      );
      fetchJobs();
    } catch (error) {
      console.error("Error toggling job status:", error);
      toast.error("Không thể thay đổi trạng thái tin tuyển dụng");
    }
  };

  const handleSort = (field) => {
    setFilters((prev) => ({
      ...prev,
      sortField: field,
      sortDirection:
        prev.sortField === field && prev.sortDirection === "asc"
          ? "desc"
          : "asc",
      pageNo: 0,
    }));
  };

  return (
    <DashboardLayout activeMenu="manage-jobs">
      {isLoading && !jobs.length ? (
        <LoadingSpinner />
      ) : (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-row items-center justify-between">
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                    Quản lý việc làm
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Quản lý tin tuyển dụng và theo dõi hồ sơ ứng tuyển
                  </p>
                </div>
                <button
                  className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-xl shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
                  onClick={() => navigate("/post-job")}
                >
                  <Plus className="w-5 h-5 mr-2" /> Thêm việc làm
                </button>
              </div>
            </div>

            {/* Filter */}
            <JobsFilter
              searchTerm={filters.search}
              statusFilter={filters.status}
              onSearchChange={(value) => handleFilterChange("search", value)}
              onStatusChange={(value) => handleFilterChange("status", value)}
              totalItems={totalItems}
            />

            {/* Table or Empty State */}
            {jobs.length > 0 ? (
              <>
                <JobsTable
                  jobs={jobs}
                  sortField={filters.sortField}
                  sortDirection={filters.sortDirection}
                  onSort={handleSort}
                  onEdit={(jobId) =>
                    navigate("/post-job", { state: { jobId } })
                  }
                  onToggleClose={handleToggleClose}
                  onDelete={handleDeleteJob}
                  onViewApplicants={(jobId) =>
                    navigate("/applicants", { state: { jobId } })
                  }
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <JobsPagination
                    currentPage={filters.pageNo + 1}
                    totalPages={totalPages}
                    onPageChange={(page) =>
                      handleFilterChange("pageNo", page - 1)
                    }
                  />
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-200">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chưa có việc làm
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  {filters.search || filters.status !== "All"
                    ? "Không tìm thấy việc làm phù hợp"
                    : "Bạn chưa đăng tin tuyển dụng nào"}
                </p>
                <button
                  onClick={() => navigate("/post-job")}
                  className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-xl shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Plus className="w-5 h-5 mr-2" /> Đăng tin tuyển dụng đầu tiên
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default ManageJobs;
