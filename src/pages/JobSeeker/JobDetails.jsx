import React, { useEffect, useState } from "react";
import {
  MapPin,
  Building2,
  Clock,
  Users,
  DollarSign,
  ExternalLink,
} from "lucide-react";
import moment from "moment";
import { useAuth } from "../../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Navbar from "../../components/layout/Navbar";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from "react-hot-toast";
import StatusBadge from "../../components/EmployerComponents/Application/StatusBadge";

function JobDetails() {
  const { user, isAuthenticated } = useAuth();
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

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

  const getJobDetailsById = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.JOB.GET_JOB_BY_ID(jobId),
        {
          params: { userId: user?.userId || null },
        }
      );
      console.log("Job Details:", response.data);
      setJobDetails(response.data.result || response.data);
    } catch (error) {
      console.error("Error fetching job details:", error);
      toast.error("Không thể lấy chi tiết công việc");
    } finally {
      setLoading(false);
    }
  };

  const applyToJob = async () => {
    try {
      setApplying(true);
      await axiosInstance.post(API_PATHS.APPLICATION.APPLY_TO_JOB(jobId));
      toast.success("Đã nộp đơn thành công");
      getJobDetailsById();
    } catch (error) {
      console.error("Error applying to job:", error);
      toast.error("Không thể nộp đơn cho công việc này");
    } finally {
      setApplying(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để xem chi tiết công việc");
      // Redirect to login after 2 seconds
      const timer = setTimeout(() => {
        navigate("/login", { state: { from: `/job/${jobId}` } });
      }, 1500);
      return () => clearTimeout(timer);
    }

    if (jobId) {
      getJobDetailsById();
    }
  }, [jobId, user, navigate]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <LoadingSpinner />
      </div>
    );
  }

  if (!jobDetails) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Không tìm thấy công việc</p>
            <button
              onClick={() => navigate("/jobs")}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatSalary = (min, max) => {
    if (min && max) {
      return `${(min / 1000).toFixed(0)}k - ${(max / 1000).toFixed(0)}k`;
    }
    if (min) return `${(min / 1000).toFixed(0)}k`;
    return "Thỏa thuận";
  };

  const formatDate = (date) => {
    return moment(date).format("DD MMM YYYY");
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white border border-gray-200 rounded-2xl shadow">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
            <div className="flex-1 flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-semibold">
                  {jobDetails.title || "Tiêu đề công việc"}
                </h1>
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} /> {jobDetails.location || "Địa điểm"}
                </div>
              </div>
            </div>
            {jobDetails.closed ? (
              // Nếu công việc đã đóng
              <StatusBadge status="CLOSED" />
            ) : jobDetails.status ? (
              // Nếu có status (APPLIED, IN_REVIEW, ACCEPTED, REJECTED)
              <StatusBadge status={jobDetails.status} />
            ) : (
              // Nếu chưa ứng tuyển
              <button
                onClick={applyToJob}
                disabled={applying}
                className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
              >
                {applying ? "Đang nộp..." : "Ứng tuyển"}
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
              {jobDetails.category || "Software Development"}
            </span>
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-pink-50 text-purple-700 text-sm font-semibold">
              {formatJobType(jobDetails.type) || "Full-Time"}
            </span>
            <span className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-gray-50 text-gray-700 text-sm font-semibold">
              <Clock className="w-4 h-4" />
              {moment(jobDetails.createdAt).format("DD-MM-YYYY")}
            </span>
          </div>

          <div className="mt-6 rounded-xl bg-emerald-50 border border-emerald-100 p-4 md:p-5">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <DollarSign size={24} />
              </div>
              <div className="ml-4">
                <div className="text-sm text-emerald-700">Compensation</div>
                <div className="text-lg font-semibold text-emerald-900">
                  {jobDetails.salaryMin || jobDetails.salaryMax
                    ? `${jobDetails.salaryMin || 0} - ${
                        jobDetails.salaryMax || 0
                      } VND`
                    : "Thỏa thuận"}
                </div>
              </div>
              <div className="ml-auto">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm">
                  <Users size={16} /> Cạnh tranh
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-6 w-1 rounded bg-purple-500"></div>
              <h2 className="text-lg font-semibold">Mô Tả Công Việc</h2>
            </div>
            <div className="rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-800 p-4 md:p-5 whitespace-pre-wrap">
              {jobDetails.description || "Chưa có mô tả"}
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-6 w-1 rounded bg-purple-500"></div>
              <h2 className="text-lg font-semibold">Yêu Cầu Công Việc</h2>
            </div>
            <div className="rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-800 p-4 md:p-5 whitespace-pre-wrap">
              {jobDetails.requirement || "Chưa có yêu cầu"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
