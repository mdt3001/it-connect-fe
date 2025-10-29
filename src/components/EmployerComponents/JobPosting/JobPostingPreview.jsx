import {
  MapPin,
  DollarSign,
  ArrowLeft,
  Building2,
  Clock,
  Users,
  Send,
  Tag,
} from "lucide-react";
import { CATEGORIES, JOB_TYPES } from "../../../utils/data";
import { useAuth } from "../../../context/AuthContext";

const JobPostingPreview = ({
  formData,
  setIsPreview,
  onSubmit,
  isSubmitting,
}) => {
  const { user } = useAuth();

  const categoryLabel =
    CATEGORIES.find((c) => c.value === formData.category)?.label ||
    formData.category;
  const jobTypeLabel =
    JOB_TYPES.find((t) => t.value === formData.jobType)?.label ||
    formData.jobType;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-lg font-semibold">Job Preview</div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-semibold">
            {formData.jobTitle || "Tiêu đề công việc"}
          </h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} /> {formData.location || "Địa điểm"}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm">
              <Tag size={16} /> {categoryLabel || "Category"}
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm">
              <Clock size={16} /> {jobTypeLabel || "Job type"}
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm">
              <Clock size={16} /> Đã đăng hôm nay
            </span>
          </div>
        </div>

        <div>
          <div className="h-16 w-16 rounded-2xl border flex items-center justify-center text-gray-500">
            <Building2 size={28} />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-emerald-50 border border-emerald-100 p-4 md:p-5">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
            <DollarSign size={24} />
          </div>
          <div className="ml-4">
            <div className="text-sm text-emerald-700">Compensation</div>
            <div className="text-lg font-semibold text-emerald-900">
              {formData.salaryMin || formData.salaryMax
                ? `${formData.salaryMin || 0} - ${formData.salaryMax || 0} VND`
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
        <div className="rounded-xl bg-gray-50 border text-sm text-gray-800 p-4 md:p-5 whitespace-pre-wrap">
          {formData.description || "Chưa có mô tả"}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-6 w-1 rounded bg-purple-500"></div>
          <h2 className="text-lg font-semibold">Yêu Cầu Công Việc</h2>
        </div>
        <div className="rounded-xl bg-gray-50 border text-sm text-gray-800 p-4 md:p-5 whitespace-pre-wrap">
          {formData.requirements || "Chưa có yêu cầu"}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg bg-white"
          onClick={() => setIsPreview(false)}
        >
          <ArrowLeft size={18} /> Quay lại
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60 inline-flex items-center gap-2"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          <Send size={18} />
          {isSubmitting ? "Đang đăng..." : "Xác nhận đăng"}
        </button>
      </div>
    </div>
  );
};
export default JobPostingPreview;
