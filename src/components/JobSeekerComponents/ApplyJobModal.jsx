import React, { useState, useRef } from "react";
import {
  X,
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  Trash2,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

const ApplyJobModal = ({ isOpen, onClose, jobId, jobTitle, onSuccess }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Chỉ chấp nhận file PDF, DOC hoặc DOCX");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Kích thước file tối đa là 10MB");
      return;
    }

    setResumeFile(file);
    await uploadCV(file);
  };

  const uploadCV = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setUploadProgress(0);

      const response = await axiosInstance.post(
        "/api/auth/upload-cv",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );

      setResumeUrl(response.data.result.cvUrl);
      toast.success("Tải CV lên thành công");
    } catch (error) {
      console.error("Error uploading CV:", error);
      toast.error("Không thể tải CV lên. Vui lòng thử lại.");
      setResumeFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    setResumeUrl("");
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleApply = async () => {
    if (!resumeUrl) {
      toast.error("Vui lòng tải lên CV của bạn");
      return;
    }

    try {
      setApplying(true);
      await axiosInstance.post(API_PATHS.APPLICATION.APPLY_TO_JOB(jobId), {
        resumeUrl: resumeUrl,
      });
      toast.success("Ứng tuyển thành công!");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error applying:", error);
      const errorMessage =
        error.response?.data?.message || "Không thể ứng tuyển. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setApplying(false);
    }
  };

  const handleClose = () => {
    if (!applying && !uploading) {
      setResumeFile(null);
      setResumeUrl("");
      setUploadProgress(0);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Ứng tuyển công việc
              </h2>
              <p className="text-blue-100 text-sm mt-1 truncate max-w-[300px]">
                {jobTitle}
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={applying || uploading}
              className="text-white/80 hover:text-white transition disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Upload Area */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CV/Resume của bạn <span className="text-red-500">*</span>
            </label>

            {!resumeFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200"
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">
                  Nhấn để tải lên hoặc kéo thả file
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  PDF, DOC, DOCX (Tối đa 10MB)
                </p>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {resumeFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  {uploading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                      <span className="text-sm text-blue-600">
                        {uploadProgress}%
                      </span>
                    </div>
                  ) : resumeUrl ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <button
                        onClick={handleRemoveFile}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>

                {/* Progress bar */}
                {uploading && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              💡 Lời khuyên
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Đảm bảo CV cập nhật thông tin mới nhất</li>
              <li>• Nêu rõ kinh nghiệm liên quan đến vị trí</li>
              <li>• Kiểm tra lỗi chính tả trước khi gửi</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={applying || uploading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleApply}
            disabled={applying || uploading || !resumeUrl}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {applying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang gửi...
              </>
            ) : (
              "Ứng tuyển ngay"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyJobModal;
