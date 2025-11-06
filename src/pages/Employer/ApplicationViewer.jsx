// src/pages/Employer/ApplicationViewer.jsx
// Chỉ thay đổi phần import và chỗ gọi Preview để truyền thêm jobDetails
import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusBadge from "../../components/EmployerComponents/Application/StatusBadge";
import AppllicantProfilePreview from "../../components/EmployerComponents/Application/AppllicantProfilePreview";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Download,
  Eye,
  User,
  Calendar,
} from "lucide-react";

function ApplicationViewer() {
  const location = useLocation();
  const jobId = location.state?.jobId || null;
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const handleDownloadResume = (resume) => {
    // TODO: implement real download using file URL/Blob if có
    if (!resume) return;
    window.open(resume, "_blank");
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.APPLICATION.GET_ALL_APPLICATIONS(jobId),
        {
          params: { pageNo, pageSize },
        }
      );
      setApplications(response.data.result.items || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.JOB.GET_JOB_BY_ID(jobId)
      );
      setJobDetails(response.data.result);
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchApplications();
      fetchJobDetails();
    } else {
      navigate("/manage-jobs");
    }
  }, [jobId, pageNo, pageSize, navigate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout activeMenu="manage-jobs">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="min-h-screen bg-gray-50 p-6">
          {/* header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <button
                  onClick={() => navigate("/manage-jobs")}
                  className="cursor-pointer inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-200" />
                  Quay lại
                </button>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                  Ứng viên đã ứng tuyển
                </h1>
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* job header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {jobDetails?.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-blue-100">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{jobDetails?.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span className="text-sm">{jobDetails?.type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">{jobDetails?.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <span className="text-sm text-white font-medium">
                      {applications.length} ứng viên
                    </span>
                  </div>
                </div>
              </div>

              {/* Applications List */}
              <div className="p-6">
                {applications.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                      Chưa có ứng viên nào ứng tuyển
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div
                        key={application.applicationId}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center gap-4 mb-4 sm:mb-0 flex-1">
                          {application.avatar ? (
                            <img
                              src={application.avatar}
                              alt={application.nameApplicant}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-white" />
                            </div>
                          )}

                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-base">
                              {application.nameApplicant}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {application.email}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Ứng tuyển {formatDate(application.createdAt)}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                          <StatusBadge status={application.status} />
                          <button
                            onClick={() =>
                              handleDownloadResume(application.resume)
                            }
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Resume
                          </button>
                          <button
                            onClick={() => setSelectedApplication(application)}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Xem hồ sơ
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Applicant Profile Preview */}
          {selectedApplication && (
            <AppllicantProfilePreview
              selectedApplication={selectedApplication}
              setSelectedApplication={setSelectedApplication}
              handleDownloadResume={handleDownloadResume}
              handleClose={() => {
                setSelectedApplication(null);
                fetchApplications(); // refresh sau khi cập nhật trạng thái
              }}
              jobDetails={jobDetails}
              handleStatusUpdated={(applicationId, newStatus) => {
                // Cập nhật danh sách ngay lập tức mà không cần refresh
                setApplications((prev) =>
                  prev.map((a) =>
                    a.applicationId === applicationId
                      ? { ...a, status: newStatus }
                      : a
                  )
                );
              }}
            />
          )}
        </div>
      )}
    </DashboardLayout>
  );
}

export default ApplicationViewer;