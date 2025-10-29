import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { CATEGORIES, JOB_TYPES } from "../../utils/data";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import JobPostingPreview from "../../components/EmployerComponents/JobPosting/JobPostingPreview";
import {
  MapPin,
  DollarSign,
  ArrowLeft,
  Building2,
  Clock,
  Users,
  AlertCircle,
  Eye,
  Tag,
  FileText,
  ListChecks,
  Send
} from "lucide-react";

function JobPostingForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const jobId = location.state?.jobId || null;

  const [formData, setFormData] = useState({
    jobTitle: "",
    location: "",
    category: "",
    jobType: "",
    description: "",
    requirements: "",
    salaryMin: "",
    salaryMax: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      toast.error("Vui lòng kiểm tra lại các trường bắt buộc.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        title: formData.jobTitle.trim(),
        location: formData.location.trim(),
        category: formData.category,
        jobType: formData.jobType,
        description: formData.description.trim(),
        requirements: formData.requirements.trim(),
        salaryMin: Number(formData.salaryMin) || 0,
        salaryMax: Number(formData.salaryMax) || 0,
      };

      if (jobId) {
        await axiosInstance.put(API_PATHS.JOB.UPDATE_JOB(jobId), payload);
        toast.success("Cập nhật tin tuyển dụng thành công");
      } else {
        await axiosInstance.post(API_PATHS.JOB.POST_JOB, payload);
        toast.success("Đăng tin tuyển dụng thành công");
      }

      navigate("/employer/manage-jobs");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Có lỗi xảy ra khi lưu tin tuyển dụng";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = (formData) => {
    const newErrors = {};
    if (!formData.jobTitle.trim()) newErrors.jobTitle = "Tiêu đề là bắt buộc";
    if (!formData.location.trim()) newErrors.location = "Địa điểm là bắt buộc";
    if (!formData.category) newErrors.category = "Ngành nghề là bắt buộc";
    if (!formData.jobType) newErrors.jobType = "Hình thức làm việc là bắt buộc";
    if (!formData.description.trim())
      newErrors.description = "Mô tả là bắt buộc";
    if (!formData.requirements.trim())
      newErrors.requirements = "Yêu cầu là bắt buộc";

    const min = Number(formData.salaryMin);
    const max = Number(formData.salaryMax);
    if (formData.salaryMin !== "" && isNaN(min))
      newErrors.salaryMin = "Lương tối thiểu phải là số";
    if (formData.salaryMax !== "" && isNaN(max))
      newErrors.salaryMax = "Lương tối đa phải là số";
    if (
      !newErrors.salaryMin &&
      !newErrors.salaryMax &&
      !isNaN(min) &&
      !isNaN(max) &&
      min > max
    ) {
      newErrors.salaryMax =
        "Lương tối đa phải lớn hơn hoặc bằng lương tối thiểu";
    }

    return newErrors;
  };

  const isFormValid = () => {
    const validationErrors = validateForm(formData);
    return Object.keys(validationErrors).length === 0;
  };

  if (isPreview) {
    return (
      <DashboardLayout activeMenu="post-job">
        <JobPostingPreview
          formData={formData}
          setIsPreview={setIsPreview}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="post-job">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow">
        <h2 className="text-xl font-semibold mb-4">
          {jobId ? "Cập nhật tin tuyển dụng" : "Đăng tin tuyển dụng"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1">Tiêu đề</label>
            <div className="relative">
              <Building2
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                className="w-full border rounded pl-10 pr-3 py-2"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                placeholder="VD: Frontend Developer"
              />
            </div>
            {errors.jobTitle && (
              <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Địa điểm</label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  className="w-full border rounded pl-10 pr-3 py-2"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  placeholder="Hà Nội, TP.HCM..."
                />
              </div>
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>
            <div>
              <label className="block text-sm mb-1">Ngành nghề</label>
              <div className="relative">
                <Tag
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <select
                  className="w-full border rounded pl-10 pr-8 py-2 bg-white"
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                >
                  <option value="">Chọn ngành nghề</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Hình thức làm việc</label>
              <div className="relative">
                <Clock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <select
                  className="w-full border rounded pl-10 pr-8 py-2 bg-white"
                  value={formData.jobType}
                  onChange={(e) => handleInputChange("jobType", e.target.value)}
                >
                  <option value="">Chọn hình thức</option>
                  {JOB_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.jobType && (
                <p className="text-red-500 text-sm mt-1">{errors.jobType}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Lương tối thiểu</label>
                <div className="relative">
                  <DollarSign
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="number"
                    className="w-full border rounded pl-10 pr-3 py-2"
                    value={formData.salaryMin}
                    onChange={(e) =>
                      handleInputChange("salaryMin", e.target.value)
                    }
                    placeholder="0"
                    min="0"
                  />
                </div>
                {errors.salaryMin && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.salaryMin}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm mb-1">Lương tối đa</label>
                <div className="relative">
                  <DollarSign
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="number"
                    className="w-full border rounded pl-10 pr-3 py-2"
                    value={formData.salaryMax}
                    onChange={(e) =>
                      handleInputChange("salaryMax", e.target.value)
                    }
                    placeholder="0"
                    min="0"
                  />
                </div>
                {errors.salaryMax && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.salaryMax}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Mô tả công việc</label>
            <div className="relative">
              <FileText
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <textarea
                className="w-full border rounded pl-10 pr-3 py-2 h-28"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Mô tả chi tiết về công việc..."
              />
            </div>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Yêu cầu</label>
            <div className="relative">
              <ListChecks
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <textarea
                className="w-full border rounded pl-10 pr-3 py-2 h-28"
                value={formData.requirements}
                onChange={(e) =>
                  handleInputChange("requirements", e.target.value)
                }
                placeholder="Kỹ năng, kinh nghiệm, học vấn..."
              />
            </div>
            {errors.requirements && (
              <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded border inline-flex items-center gap-2"
              onClick={() => {
                const validationErrors = validateForm(formData);
                setErrors(validationErrors);
                if (Object.keys(validationErrors).length === 0) {
                  setIsPreview(true);
                } else {
                  toast.error(
                    "Vui lòng hoàn thiện thông tin trước khi xem trước"
                  );
                }
              }}
              disabled={isSubmitting}
            >
              <Eye size={18} /> Xem trước
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60 inline-flex items-center gap-2"
              disabled={isSubmitting}
            >
              <Send size={18} />{" "}
              {isSubmitting ? "Đang lưu..." : jobId ? "Cập nhật" : "Đăng tin"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default JobPostingForm;
