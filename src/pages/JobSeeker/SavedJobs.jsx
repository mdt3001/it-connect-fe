import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bookmark,
  MapPin,
  Briefcase,
  Building2,
  Trash2,
  ExternalLink,
  Search,
  Filter,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Navbar from "../../components/layout/Navbar";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

function SavedJobs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.JOB.GET_SAVED_JOBS, {
        params: { pageNo: 0, pageSize: 100 },
      });
      setSavedJobs(response.data.result?.items || []);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      if (error.response?.status !== 400) {
        toast.error("Không thể tải danh sách việc làm đã lưu");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSavedJobs();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleUnsaveJob = async (jobId, e) => {
    e.stopPropagation();
    try {
      await axiosInstance.delete(API_PATHS.JOB.UNSAVE_JOB(jobId));
      setSavedJobs((prev) => prev.filter((job) => job.jobId !== jobId));
      toast.success("Đã xóa khỏi danh sách đã lưu");
    } catch (error) {
      console.error("Error unsaving job:", error);
      toast.error("Không thể xóa việc làm");
    }
  };

  const handleViewJob = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  const formatSalary = (min, max) => {
    if (min && max) {
      return `${(min / 1000000).toFixed(0)} - ${(max / 1000000).toFixed(
        0
      )} triệu`;
    }
    if (min) return `${(min / 1000000).toFixed(0)} triệu`;
    return "Thỏa thuận";
  };

  const formatJobType = (type) => {
    const typeMap = {
      FULL_TIME: "Full-time",
      PART_TIME: "Part-time",
      CONTRACT: "Hợp đồng",
      INTERNSHIP: "Thực tập",
      REMOTE: "Remote",
    };
    return typeMap[type] || type;
  };

  const filteredJobs = savedJobs.filter(
    (job) =>
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Đăng nhập để xem việc làm đã lưu
            </h2>
            <p className="text-gray-500 mb-6">
              Bạn cần đăng nhập để sử dụng tính năng này
            </p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Đăng nhập ngay
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg px-6 py-8 rounded-xl mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold flex items-center gap-3">
                  <Bookmark className="w-8 h-8" />
                  Việc làm đã lưu
                </h1>
                <p className="text-blue-100 mt-2">
                  Bạn đã lưu {savedJobs.length} việc làm
                </p>
              </div>
              <button
                onClick={() => navigate("/find-jobs")}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-white text-blue-600 rounded-full shadow hover:bg-blue-50 transition"
              >
                <Search className="w-4 h-4" />
                Tìm việc mới
              </button>
            </div>
          </div>

          {/* Search */}
          {savedJobs.length > 0 && (
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm trong danh sách đã lưu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-white shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Jobs List */}
          {savedJobs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
              <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Chưa có việc làm nào được lưu
              </h2>
              <p className="text-gray-500 mb-6">
                Hãy lưu những việc làm bạn quan tâm để xem lại sau
              </p>
              <button
                onClick={() => navigate("/find-jobs")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Khám phá việc làm
              </button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Không tìm thấy kết quả
              </h2>
              <p className="text-gray-500">Thử tìm kiếm với từ khóa khác</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div
                  key={job.jobId}
                  onClick={() => handleViewJob(job.jobId)}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      {/* Job Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-4">
                          {/* Company Logo */}
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            {job.companyLogo ? (
                              <img
                                src={job.companyLogo}
                                alt={job.companyName}
                                className="w-14 h-14 rounded-xl object-cover"
                              />
                            ) : (
                              <Building2 className="w-7 h-7 text-white" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                              {job.title}
                            </h3>
                            <p className="text-gray-600 font-medium mb-2">
                              {job.companyName}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap items-center gap-2 text-sm">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700">
                                <MapPin className="w-3.5 h-3.5 mr-1" />
                                {job.location}
                              </span>
                              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-green-50 text-green-700">
                                <Briefcase className="w-3.5 h-3.5 mr-1" />
                                {formatJobType(job.type)}
                              </span>
                              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700">
                                {formatSalary(job.salaryMin, job.salaryMax)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleUnsaveJob(job.jobId, e)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Bỏ lưu"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewJob(job.jobId);
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2"
                        >
                          Xem chi tiết
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SavedJobs;
