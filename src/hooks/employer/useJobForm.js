// src/hooks/employer/useJobForm.js
import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function useJobForm(jobId) {
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(!!jobId);

  useEffect(() => {
    if (!jobId) return;
    (async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(API_PATHS.JOB.GET_JOB_BY_ID(jobId));
        const { data } = res;
        const job = data.result || data; 
        setFormData({
          jobTitle: job.title || "",
          location: job.location || "",
          category: job.category || "",
          jobType: job.type?.replace(/_/g, "-").toLowerCase() || "",
          description: job.description || "",
          requirements: job.requirements || job.requirement || "",
          salaryMin: job.salaryMin?.toString() || "",
          salaryMax: job.salaryMax?.toString() || "",
        });
      } catch (error) {
        toast.error("Không thể tải thông tin công việc");
        navigate("/employer/manage-jobs");
      } finally {
        setLoading(false);
      }
    })();
  }, [jobId, navigate]);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));
  }, []);

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

    const min = Number(data.salaryMin);
    const max = Number(data.salaryMax);
    if (data.salaryMin !== "" && Number.isNaN(min)) newErrors.salaryMin = "Lương tối thiểu phải là số";
    if (data.salaryMax !== "" && Number.isNaN(max)) newErrors.salaryMax = "Lương tối đa phải là số";
    if (!newErrors.salaryMin && !newErrors.salaryMax && !Number.isNaN(min) && !Number.isNaN(max) && min > max) {
      newErrors.salaryMax = "Lương tối đa phải lớn hơn hoặc bằng lương tối thiểu";
    }
    return newErrors;
  }, []);

  const handleSubmit = useCallback(async () => {
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
        requirement: formData.requirements.trim(),
        salaryMin: Number(formData.salaryMin) || 0,
        salaryMax: Number(formData.salaryMax) || 0,
      };
      await (jobId
        ? axiosInstance.put(API_PATHS.JOB.UPDATE_JOB(jobId), payload)
        : axiosInstance.post(API_PATHS.JOB.POST_JOB, payload)
      );
      toast.success(jobId ? "Cập nhật tin tuyển dụng thành công" : "Đăng tin tuyển dụng thành công");
      setFormData({
        jobTitle: "", location: "", category: "", jobType: "",
        description: "", requirements: "", salaryMin: "", salaryMax: "",
      });
      navigate("/employer-dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi lưu tin tuyển dụng");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, jobId, navigate, validateForm]);

  const handlePreview = useCallback(() => {
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) setIsPreview(true);
    else toast.error("Vui lòng hoàn thiện thông tin trước khi xem trước");
  }, [formData, validateForm]);

  return {
    formData, errors, isSubmitting, isPreview, loading,
    setIsPreview, handleInputChange, handleSubmit, handlePreview,
  };
}