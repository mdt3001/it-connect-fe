import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  User,
  Mail,
  Edit3,
  FileText,
  Upload,
  Loader2,
  Save,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import uploadImage, { uploadCV } from "../../utils/uploadImage";
import { API_PATHS } from "../../utils/apiPaths";
import Navbar from "../../components/layout/Navbar";
import LoadingSpinner from "../../components/LoadingSpinner";

function UserProfile() {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    avatar: "",
    resume: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...profileData });
  const [uploading, setUploading] = useState({
    avatar: false,
    resume: false,
  });
  const [saving, setSaving] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const resumeInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      const mapped = {
        name: user?.name || "",
        email: user?.email || "",
        avatar: user?.avatar || "",
        resume: user?.resume || "",
      };
      setProfileData(mapped);
      setFormData(mapped);
    }
    setPageLoading(false);
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (file, type) => {
    if (!file) return;
    setUploading((prev) => ({ ...prev, [type]: true }));
    try {
      let fileUrl = "";
      
      if (type === "resume") {
        // Use uploadCV for CV files
        const uploadResponse = await uploadCV(file);
        fileUrl =
          uploadResponse?.result?.cvUrl ||
          uploadResponse?.cvUrl ||
          "";
      } else {
        // Use uploadImage for avatar
        const uploadResponse = await uploadImage(file);
        fileUrl =
          uploadResponse?.result?.imageUrl ||
          uploadResponse?.result?.url ||
          uploadResponse?.url ||
          uploadResponse?.imageUrl ||
          "";
      }

      if (!fileUrl) {
        throw new Error("Không nhận được đường dẫn file");
      }

      setFormData((prev) => ({ ...prev, [type]: fileUrl }));
      toast.success(
        type === "avatar" ? "Đã cập nhật ảnh đại diện" : "Đã tải lên CV"
      );
    } catch (error) {
      console.error("Lỗi tải file:", error);
      toast.error("Không thể tải file. Vui lòng thử lại.");
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleImageUpload(file, type);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        name: formData.name,
        avatar: formData.avatar,
        resume: formData.resume,
      };

      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE(user?.userId),
        payload
      );
      const updated = response.data?.result || payload;

      setProfileData((prev) => ({ ...prev, ...updated }));
      setFormData((prev) => ({ ...prev, ...updated }));
      updateUser({ ...user, ...updated });
      toast.success("Đã cập nhật hồ sơ thành công");
      setEditMode(false);
    } catch (error) {
      console.error("Lỗi lưu hồ sơ:", error);
      toast.error(
        error?.response?.data?.message ||
          "Không thể lưu hồ sơ. Vui lòng thử lại."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...profileData });
    setEditMode(false);
  };

  const handleEdit = () => {
    setFormData({ ...profileData });
    setEditMode(true);
  };

  const handleRemoveResume = () => {
    setFormData((prev) => ({ ...prev, resume: "" }));
  };

  const isValidUrl = (url) => {
    if (!url || url === "" || url === "url") return false;
    return url.startsWith("http://") || url.startsWith("https://");
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg px-6 py-8 rounded-xl mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {profileData.avatar ? (
                    <img
                      src={profileData.avatar}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full object-cover border-4 border-white/30"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30">
                      <User className="w-10 h-10 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-semibold">
                    {profileData.name || "Người tìm việc"}
                  </h1>
                  <p className="text-blue-100 flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4" />
                    {profileData.email}
                  </p>
                </div>
              </div>
              {!editMode && (
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-white text-blue-600 rounded-full shadow hover:bg-blue-50 transition"
                >
                  <Edit3 className="w-4 h-4" />
                  Chỉnh sửa hồ sơ
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          {editMode ? (
            /* Edit Mode */
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Chỉnh sửa thông tin
                  </h2>
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Hủy
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        {formData.avatar ? (
                          <img
                            src={formData.avatar}
                            alt="Avatar"
                            className="w-28 h-28 rounded-full object-cover border-4 border-gray-100"
                          />
                        ) : (
                          <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center border-4 border-gray-100">
                            <User className="w-12 h-12 text-white" />
                          </div>
                        )}
                      </div>
                      <label className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition">
                        {uploading.avatar ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        {uploading.avatar ? "Đang tải..." : "Đổi ảnh"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageChange(e, "avatar")}
                          disabled={uploading.avatar}
                        />
                      </label>
                    </div>

                    <div className="flex-1 w-full space-y-4">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Họ và tên
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                          placeholder="Nhập họ và tên"
                        />
                      </div>

                      {/* Email (readonly) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          readOnly
                          className="w-full rounded-lg border border-gray-200 px-4 py-3 bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Email không thể thay đổi
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Resume Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CV / Resume
                    </label>
                    {isValidUrl(formData.resume) ? (
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              CV đã tải lên
                            </p>
                            <a
                              href={formData.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline"
                            >
                              Xem CV
                            </a>
                          </div>
                        </div>
                        <button
                          onClick={handleRemoveResume}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => resumeInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-gray-50 transition"
                      >
                        <input
                          ref={resumeInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) => handleImageChange(e, "resume")}
                          disabled={uploading.resume}
                        />
                        {uploading.resume ? (
                          <Loader2 className="w-10 h-10 text-blue-500 mx-auto animate-spin" />
                        ) : (
                          <Upload className="w-10 h-10 text-gray-400 mx-auto" />
                        )}
                        <p className="mt-2 text-sm text-gray-600">
                          {uploading.resume
                            ? "Đang tải lên..."
                            : "Nhấn để tải lên CV (PDF, DOC, DOCX)"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Save Button */}
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {saving ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* View Mode */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Thông tin cá nhân
                  </h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    {profileData.avatar ? (
                      <img
                        src={profileData.avatar}
                        alt="Avatar"
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {profileData.name || "Chưa cập nhật"}
                      </h3>
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {profileData.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resume */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    CV / Resume
                  </h2>
                </div>
                <div className="p-6">
                  {isValidUrl(profileData.resume) ? (
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <FileText className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            CV đã được tải lên
                          </p>
                          <p className="text-xs text-gray-500">
                            Sẵn sàng ứng tuyển
                          </p>
                        </div>
                      </div>
                      <a
                        href={profileData.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition"
                      >
                        Xem CV
                      </a>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 mb-4">Bạn chưa tải lên CV</p>
                      <button
                        onClick={handleEdit}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                      >
                        Tải lên CV ngay
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
