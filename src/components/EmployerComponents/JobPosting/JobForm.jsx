// src/components/employer/jobs/JobForm.jsx
import React from "react";
import {
  MapPin,
  Clock,
  Tag,
  FileText,
  ListChecks,
  Eye,
  Send,
  Building2,
} from "lucide-react";
import FormField from "../../common/FormField";
import IconInput from "../../common/IconInput";
import IconSelect from "../../common/IconSelect";
import IconTextarea from "../../common/IconTextarea";
import { CATEGORIES, JOB_TYPES } from "../../../utils/data";

// Custom VND Icon component
const VNDIcon = ({ className }) => (
  <span className={`text-gray-500 ${className || "w-4 h-4"}`}>₫</span>
);

export default function JobForm({
  formData,
  errors,
  onChange,
  onPreview,
  onSubmit,
  submitting,
  loading,
  title,
  submitText,
}) {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-5"
      >
        <FormField label="Tiêu đề" error={errors.jobTitle}>
          <IconInput icon={Building2}>
            <input
              type="text"
              className="w-full border border-gray-300 rounded pl-10 pr-3 py-2"
              value={formData.jobTitle}
              onChange={(e) => onChange("jobTitle", e.target.value)}
              placeholder="VD: Frontend Developer"
            />
          </IconInput>
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Địa điểm" error={errors.location}>
            <IconInput icon={MapPin}>
              <input
                type="text"
                className="w-full border border-gray-300 rounded pl-10 pr-3 py-2"
                value={formData.location}
                onChange={(e) => onChange("location", e.target.value)}
                placeholder="Hà Nội, TP.HCM..."
              />
            </IconInput>
          </FormField>

          <FormField label="Ngành nghề" error={errors.category}>
            <IconSelect
              icon={Tag}
              value={formData.category}
              onChange={(e) => onChange("category", e.target.value)}
            >
              <option className="text-black" value="">
                Chọn ngành nghề
              </option>
              {CATEGORIES.map((c) => (
                <option className="text-black" key={c.value} value={c.value}>
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
              onChange={(e) => onChange("jobType", e.target.value)}
            >
              <option className="text-black" value="">Chọn hình thức</option>
              {JOB_TYPES.map((t) => (
                <option className="text-black" key={t.value} value={t.value}>
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
              <IconInput icon={VNDIcon}>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded pl-10 pr-3 py-2"
                  value={formData.salaryMin}
                  onChange={(e) => onChange("salaryMin", e.target.value)}
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
              <IconInput icon={VNDIcon}>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded pl-10 pr-3 py-2"
                  value={formData.salaryMax}
                  onChange={(e) => onChange("salaryMax", e.target.value)}
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
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Mô tả chi tiết về công việc..."
          />
        </FormField>

        <FormField label="Yêu cầu" error={errors.requirements}>
          <IconTextarea
            icon={ListChecks}
            value={formData.requirements}
            onChange={(e) => onChange("requirements", e.target.value)}
            placeholder="Kỹ năng, kinh nghiệm, học vấn..."
          />
        </FormField>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="px-4 py-2 rounded border border-gray-300 inline-flex items-center gap-2"
            onClick={onPreview}
            disabled={submitting || loading}
          >
            <Eye size={18} /> Xem trước
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60 inline-flex items-center gap-2"
            disabled={submitting || loading}
          >
            <Send size={18} /> {submitText}
          </button>
        </div>
      </form>
    </div>
  );
}
