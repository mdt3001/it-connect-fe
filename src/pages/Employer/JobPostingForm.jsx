// src/pages/Employer/JobPostingForm.jsx
import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import JobForm from "../../components/EmployerComponents/JobPosting/JobForm";
import JobPostingPreview from "../../components/EmployerComponents/JobPosting/JobPostingPreview";
import { useLocation } from "react-router-dom";
import useJobForm from "../../hooks/employer/useJobForm";

function JobPostingForm() {
  const location = useLocation();
  const jobId = location.state?.jobId || null;

  const {
    formData, errors, isSubmitting, isPreview, loading,
    setIsPreview, handleInputChange, handleSubmit, handlePreview
  } = useJobForm(jobId);

  if (isPreview) {
    return (
      <DashboardLayout activeMenu="post-job">
        <JobPostingPreview
          formData={formData}
          setIsPreview={setIsPreview}
          onSubmit={(e) => { e?.preventDefault?.(); handleSubmit(); }}
          isSubmitting={isSubmitting}
        />
      </DashboardLayout>
    );
  }

  const title = jobId ? "Cập nhật tin tuyển dụng" : "Đăng tin tuyển dụng";
  const submitText = isSubmitting ? "Đang lưu..." : jobId ? "Cập nhật" : "Đăng tin";

  return (
    <DashboardLayout activeMenu="post-job">
      {loading ? (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow">
          <div className="flex justify-center items-center h-32">Đang tải...</div>
        </div>
      ) : (
        <JobForm
          formData={formData}
          errors={errors}
          onChange={handleInputChange}
          onPreview={handlePreview}
          onSubmit={handleSubmit}
          submitting={isSubmitting}
          loading={loading}
          title={title}
          submitText={submitText}
        />
      )}
    </DashboardLayout>
  );
}

export default JobPostingForm;