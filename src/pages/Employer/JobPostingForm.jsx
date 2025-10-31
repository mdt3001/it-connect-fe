import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { CATEGORIES, JOB_TYPES } from "../../utils/data";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import JobPostingPreview from "../../components/EmployerComponents/JobPosting/JobPostingPreview";
import {
  MapPin,
  DollarSign,
  Building2,
  Clock,
  Users,
  AlertCircle,
  Eye,
  Tag,
  FileText,
  ListChecks,
  Send,
} from "lucide-react";

// Reusable FormField component for better maintainability
const FormField = ({ label, error, children, className = "" }) => (
  <div className={className}>
    <label className="block text-sm mb-1">{label}</label>
    {children}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Icon wrappers for consistency
const IconInput = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <Icon
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      size={18}
    />
    {props.children}
  </div>
);

const IconSelect = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <Icon
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      size={18}
    />
    <select
      className="w-full border rounded pl-10 pr-8 py-2 bg-white"
      {...props}
    />
  </div>
);

const IconTextarea = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <Icon className="absolute left-3 top-3 text-gray-400" size={18} />
    <textarea
      className="w-full border rounded pl-10 pr-3 py-2 h-28"
      {...props}
    />
  </div>
);

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
  const [loading, setLoading] = useState(!!jobId); // Load data on mount if editing

  // Fetch job data for edit mode
  useEffect(() => {
    if (jobId) {
      const fetchJob = async () => {
        try {
          setLoading(true);
          const response = await axiosInstance.get(
            API_PATHS.JOB.GET_JOB(jobId)
          );
          const { data } = response;
          setFormData({
            jobTitle: data.title || "",
            location: data.location || "",
            category: data.category || "",
            jobType: data.type?.replace(/_/g, "-").toLowerCase() || "", // e.g., "FULL_TIME" → "full-time"
            description: data.description || "",
            requirements: data.requirements || "",
            salaryMin: data.salaryMin?.toString() || "",
            salaryMax: data.salaryMax?.toString() || "",
          });
        } catch (error) {
          toast.error("Không thể tải thông tin công việc");
          navigate("/employer/manage-jobs");
        } finally {
          setLoading(false);
        }
      };
      fetchJob();
    }
  }, [jobId, navigate]);

  const handleInputChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error on change
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  const validateForm = useCallback((data) => {
    const newErrors = {};
    const requiredFields = [
      { key: "jobTitle", msg: "Tiêu đề là bắt buộc" },
      { key: "location", msg: "Địa điểm là bắt buộc" },
      { key: "description", msg: "Mô tả là bắt buộc" },
      { key: "requirements", msg: "Yêu cầu là bắt buộc" },
    ];

    requiredFields.forEach(({ key, msg }) => {
      if (!data[key]?.trim()) newErrors[key] = msg;
    });

    if (!data.category) newErrors.category = "Ngành nghề là bắt buộc";
    if (!data.jobType) newErrors.jobType = "Hình thức làm việc là bắt buộc";

    // Salary validation
    const min = Number(data.salaryMin);
    const max = Number(data.salaryMax);
    if (data.salaryMin !== "" && isNaN(min))
      newErrors.salaryMin = "Lương tối thiểu phải là số";
    if (data.salaryMax !== "" && isNaN(max))
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
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
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
          type: formData.jobType.toUpperCase().replace("-", "_"),
          description: formData.description.trim(),
          requirements: formData.requirements.trim(),
          salaryMin: Number(formData.salaryMin) || 0,
          salaryMax: Number(formData.salaryMax) || 0,
        };

        const response = await (jobId
          ? axiosInstance.put(API_PATHS.JOB.UPDATE_JOB(jobId), payload)
          : axiosInstance.post(API_PATHS.JOB.POST_JOB, payload));

        console.log("response.data:", response.data);
        toast.success(
          jobId
            ? "Cập nhật tin tuyển dụng thành công"
            : "Đăng tin tuyển dụng thành công"
        );
        setFormData({
          jobTitle: "",
          location: "",
          category: "",
          jobType: "",
          description: "",
          requirements: "",
          salaryMin: "",
          salaryMax: "",
        })
        navigate("/employer-dashboard");
      } catch (error) {
        console.log("error:", error);
        toast.error(
          error?.response?.data?.message ||
            "Có lỗi xảy ra khi lưu tin tuyển dụng"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, jobId, navigate, validateForm]
  );

  const handlePreview = useCallback(() => {
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setIsPreview(true);
    } else {
      toast.error("Vui lòng hoàn thiện thông tin trước khi xem trước");
    }
  }, [formData, validateForm]);

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

  if (loading) {
    return (
      <DashboardLayout activeMenu="post-job">
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow">
          <div className="flex justify-center items-center h-32">
            Đang tải...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const title = jobId ? "Cập nhật tin tuyển dụng" : "Đăng tin tuyển dụng";
  const submitText = isSubmitting
    ? "Đang lưu..."
    : jobId
    ? "Cập nhật"
    : "Đăng tin";

  return (
    <DashboardLayout activeMenu="post-job">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField label="Tiêu đề" error={errors.jobTitle}>
            <IconInput icon={Building2}>
              <input
                type="text"
                className="w-full border rounded pl-10 pr-3 py-2"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                placeholder="VD: Frontend Developer"
              />
            </IconInput>
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Địa điểm" error={errors.location}>
              <IconInput icon={MapPin}>
                <input
                  type="text"
                  className="w-full border rounded pl-10 pr-3 py-2"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  placeholder="Hà Nội, TP.HCM..."
                />
              </IconInput>
            </FormField>

            <FormField label="Ngành nghề" error={errors.category}>
              <IconSelect
                icon={Tag}
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
              >
                <option value="">Chọn ngành nghề</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </IconSelect>
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Hình thức làm việc" error={errors.jobType}>
              <IconSelect
                icon={Clock}
                value={formData.jobType}
                onChange={(e) => handleInputChange("jobType", e.target.value)}
              >
                <option value="">Chọn hình thức</option>
                {JOB_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </IconSelect>
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                label="Lương tối thiểu"
                error={errors.salaryMin}
                className="col-span-1"
              >
                <IconInput icon={DollarSign}>
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
                </IconInput>
              </FormField>
              <FormField
                label="Lương tối đa"
                error={errors.salaryMax}
                className="col-span-1"
              >
                <IconInput icon={DollarSign}>
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
                </IconInput>
              </FormField>
            </div>
          </div>

          <FormField label="Mô tả công việc" error={errors.description}>
            <IconTextarea
              icon={FileText}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Mô tả chi tiết về công việc..."
            />
          </FormField>

          <FormField label="Yêu cầu" error={errors.requirements}>
            <IconTextarea
              icon={ListChecks}
              value={formData.requirements}
              onChange={(e) =>
                handleInputChange("requirements", e.target.value)
              }
              placeholder="Kỹ năng, kinh nghiệm, học vấn..."
            />
          </FormField>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded border inline-flex items-center gap-2"
              onClick={handlePreview}
              disabled={isSubmitting || loading}
            >
              <Eye size={18} /> Xem trước
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60 inline-flex items-center gap-2"
              disabled={isSubmitting || loading}
            >
              <Send size={18} /> {submitText}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default JobPostingForm;
