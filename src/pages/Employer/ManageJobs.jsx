import React, { use } from "react";
import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  X,
  Trash2,
  ChevronUp,
  ChevronDown,
  Users,
  Briefcase,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import { i } from "framer-motion/client";

function ManageJobs() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const itemsPerPage = 8;

  const getPostedJobs = async (disableLoader) => {
    setIsLoading(!disableLoader);
    try {
      const response = await axiosInstance.get(API_PATHS.JOB.GET_JOB_EMPLOYER);
      console.log("Posted Jobs Response:", response);
      // Fix: Use response.data instead of response
      if (response.data.code === 200 && response.data.result.items) {
        const formattedJobs = response.data.result.items.map((job) => ({
          jobId: job.jobId,
          title: job.title,
          location: job.location,
          category: job.category,
          type: job.type,
          description: job.description,
          requirement: job.requirement,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          applicationCount: job.applicationCount,
          closed: job.closed,
          companyName: job.companyName,
        }));
        setJobs(formattedJobs);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error("Error fetching posted jobs:", error);
      toast.error("Không thể tải danh sách việc làm");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tin tuyển dụng này?")) {
      return;
    }

    try {
      await axiosInstance.delete(API_PATHS.JOB.DELETE_JOB(jobId));
      toast.success("Xóa tin tuyển dụng thành công");
      getPostedJobs(true);
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
      getPostedJobs(true);
    } catch (error) {
      console.error("Error toggling job status:", error);
      toast.error("Không thể thay đổi trạng thái tin tuyển dụng");
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    getPostedJobs();
    return () => {};
  }, []);

  // Filter and sort jobs
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs.filter((job) => {
      const matchesSearch =
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && !job.closed) ||
        (statusFilter === "Closed" && job.closed);

      return matchesSearch && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [jobs, searchTerm, statusFilter, sortField, sortDirection]);

  // Paginate
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedJobs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedJobs, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedJobs.length / itemsPerPage);

  const formatSalary = (min, max) => {
    if (!min && !max) return "Thỏa thuận";
    return `${(min / 1000000).toFixed(0)} - ${(max / 1000000).toFixed(
      0
    )} triệu`;
  };

  const SortableHeader = ({ field, children }) => (
    <th
      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field &&
          (sortDirection === "asc" ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          ))}
      </div>
    </th>
  );

  return (
    <DashboardLayout activeMenu="manage-jobs">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* header */}
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

            {/* filter */}
            <div className="bg-white/80 backdrop:blur-sm rounded-2xl shadow-xl shadow-black/5 p-4 mb-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* search */}
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Tìm kiếm công việc...."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-0 transition-all duration-200"
                  />
                </div>

                {/* status filter */}
                <div className="sm:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-0 transition-all duration-200"
                  >
                    <option value="All">Tất cả trạng thái</option>
                    <option value="Active">Đang hoạt động</option>
                    <option value="Closed">Đã đóng</option>
                  </select>
                </div>
              </div>

              {/* Results Summary */}
              <div className="my-4">
                <p className="text-sm text-gray-600">
                  Hiển thị {paginatedJobs.length} của{" "}
                  {filteredAndSortedJobs.length} việc làm
                </p>
              </div>
            </div>

            {/* Table */}
            {paginatedJobs.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <SortableHeader field="title">Tiêu đề</SortableHeader>
                        <SortableHeader field="location">
                          Địa điểm
                        </SortableHeader>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mức lương
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ứng viên
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedJobs.map((job) => (
                        <tr
                          key={job.jobId}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {job.title}
                              </div>
                              <div className="text-xs text-gray-500">
                                {job.category}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {job.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatSalary(job.salaryMin, job.salaryMax)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() =>
                                navigate(`/employer/applications/${job.jobId}`)
                              }
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                            >
                              <Users className="w-4 h-4 mr-1" />
                              {job.applicationCount}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                job.closed
                                  ? "bg-gray-100 text-gray-600"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {job.closed ? "Đã đóng" : "Đang tuyển"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() =>
                                  navigate("/post-job", {
                                    state: { jobId: job.jobId },
                                  })
                                }
                                className="inline-flex items-center px-3 py-1 rounded-lg text-blue-600 hover:text-blue-900 hover:bg-blue-50 transition-colors"
                                title="Chỉnh sửa"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleToggleClose(job.jobId, job.closed)
                                }
                                className="inline-flex items-center px-3 py-1 rounded-lg text-orange-600 hover:text-orange-900 hover:bg-orange-50 transition-colors"
                                title={job.closed ? "Mở lại" : "Đóng"}
                              >
                                {job.closed ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <X className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => handleDeleteJob(job.jobId)}
                                className="inline-flex items-center px-3 py-1 rounded-lg text-red-600 hover:text-red-900 hover:bg-red-50 transition-colors"
                                title="Xóa"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Trang {currentPage} / {totalPages}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            setCurrentPage(Math.max(1, currentPage - 1))
                          }
                          disabled={currentPage === 1}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Trước
                        </button>
                        <button
                          onClick={() =>
                            setCurrentPage(
                              Math.min(totalPages, currentPage + 1)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Sau
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-200">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chưa có việc làm
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Bạn chưa đăng tin tuyển dụng nào
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
