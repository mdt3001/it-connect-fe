import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Building2,
  ExternalLink,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/layout/Navbar";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

function AppliedJobs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/applications/my");
      setApplications(response.data.result || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Không thể tải danh sách đơn ứng tuyển");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchApplications();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleViewJob = (jobId) => {
    navigate(`/job/${jobId}`);
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

  const getStatusInfo = (status) => {
      const statusMap = {
        APPLIED: {
          label: "Đã ứng tuyển",
          color: "bg-gray-100 text-gray-800",
          icon: Clock,
        },
        PENDING: {
          label: "Đang chờ",
          color: "bg-yellow-100 text-yellow-800",
          icon: Clock,
        },
        REVIEWING: {
          label: "Đang xem xét",
          color: "bg-blue-100 text-blue-800",
          icon: AlertCircle,
        },
        ACCEPTED: {
          label: "Đã chấp nhận",
          color: "bg-green-100 text-green-800",
          icon: CheckCircle,
        },
        REJECTED: {
          label: "Đã từ chối",
          color: "bg-red-100 text-red-800",
          icon: XCircle,
        },
      };
    return (
      statusMap[status] || {
        label: status,
        color: "bg-gray-100 text-gray-800",
        icon: Clock,
      }
    );
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Đăng nhập để xem đơn ứng tuyển
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
                  <Briefcase className="w-8 h-8" />
                  Việc làm đã ứng tuyển
                </h1>
                <p className="text-blue-100 mt-2">
                  Bạn đã ứng tuyển {applications.length} việc làm
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

          {/* Filters */}
          {applications.length > 0 && (
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên công việc, địa điểm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-white shadow-sm"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-white shadow-sm"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="PENDING">Đang chờ</option>
                <option value="REVIEWING">Đang xem xét</option>
                <option value="ACCEPTED">Đã chấp nhận</option>
                <option value="REJECTED">Đã từ chối</option>
              </select>
            </div>
          )}

          {/* Applications List */}
          {applications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Chưa có đơn ứng tuyển nào
              </h2>
              <p className="text-gray-500 mb-6">
                Hãy tìm và ứng tuyển những việc làm phù hợp với bạn
              </p>
              <button
                onClick={() => navigate("/find-jobs")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Khám phá việc làm
              </button>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Không tìm thấy kết quả
              </h2>
              <p className="text-gray-500">Thử tìm kiếm với từ khóa khác</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((app) => {
                const statusInfo = getStatusInfo(app.status);
                const StatusIcon = statusInfo.icon;
                return (
                  <div
                    key={app.applicationId}
                    onClick={() => handleViewJob(app.job)}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        {/* Job Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-4">
                            {/* Company Logo */}
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Building2 className="w-7 h-7 text-white" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                                {app.title}
                              </h3>

                              {/* Tags */}
                              <div className="flex flex-wrap items-center gap-2 text-sm mt-2">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700">
                                  <MapPin className="w-3.5 h-3.5 mr-1" />
                                  {app.location}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-green-50 text-green-700">
                                  <Briefcase className="w-3.5 h-3.5 mr-1" />
                                  {formatJobType(app.type)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status & Actions */}
                        <div className="flex flex-col items-end gap-3">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${statusInfo.color}`}
                          >
                            <StatusIcon className="w-4 h-4 mr-1.5" />
                            {statusInfo.label}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewJob(app.job);
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
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppliedJobs;
