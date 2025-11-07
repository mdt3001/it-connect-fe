import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Building2, Mail, Edit3 } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import uploadImage from "../../utils/uploadImage";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import EditProfileDetails from "./EditProfileDetails";

function EmployerProfilePage() {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    avatar: "",
    companyName: "",
    companyDescription: "",
    companyLogo: "",
    resume: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...profileData });
  const [uploading, setUploading] = useState({
    avatar: false,
    companyLogo: false,
  });
  const [saving, setSaving] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const mapProfile = (raw) => ({
    name: raw?.name || "",
    email: raw?.email || "",
    avatar: raw?.avatar || "",
    companyName: raw?.companyName || "",
    companyDescription: raw?.companyDescription || "",
    companyLogo: raw?.companyLogo || "",
    resume: raw?.resume || "",
  });

  useEffect(() => {
    if (user) {
      const mapped = mapProfile(user);
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
      const uploadResponse = await uploadImage(file);
      const imageUrl =
        uploadResponse?.result?.imageUrl ||
        uploadResponse?.result?.url ||
        uploadResponse?.url ||
        uploadResponse?.imageUrl ||
        "";

      if (!imageUrl) {
        throw new Error("Không nhận được đường dẫn ảnh");
      }

      const field = type === "avatar" ? "avatar" : "companyLogo";
      setFormData((prev) => ({ ...prev, [field]: imageUrl }));
      toast.success(
        type === "avatar" ? "Đã cập nhật ảnh đại diện" : "Đã cập nhật logo"
      );
    } catch (error) {
      console.error("Lỗi tải ảnh:", error);
      toast.error("Không thể tải ảnh. Vui lòng thử lại.");
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
        userId: user?.userId,
        name: formData.name,
        email: formData.email,
        companyName: formData.companyName,
        companyDescription: formData.companyDescription,
        avatar: formData.avatar,
        companyLogo: formData.companyLogo,
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
      toast.success("Đã cập nhật hồ sơ nhà tuyển dụng");
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

  if (pageLoading) {
    return (
      <DashboardLayout activeMenu="company-profile">
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (editMode) {
    return (
      <EditProfileDetails
        formData={formData}
        handleImageChange={handleImageChange}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
        handleCancel={handleCancel}
        uploading={uploading}
        saving={saving}
      />
    );
  }

  return (
    <DashboardLayout activeMenu="company-profile">
      <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg px-6 py-8 rounded-xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-blue-100 mb-1">
                Hồ sơ nhà tuyển dụng
              </p>
              <h1 className="text-2xl sm:text-3xl font-semibold">
                Xin chào, {profileData.name || "Nhà tuyển dụng"}
              </h1>
              <p className="text-blue-100 mt-3 max-w-2xl">
                Hãy giữ hồ sơ của bạn luôn đầy đủ và chuyên nghiệp để thu hút
                những ứng viên tài năng.
              </p>
            </div>
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-white text-blue-600 rounded-full shadow hover:bg-blue-50 transition"
            >
              <Edit3 className="w-4 h-4" />
              Chỉnh sửa hồ sơ
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Thông tin cá nhân
                </h2>
              </div>
              <div className="px-6 py-8">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      profileData.avatar ||
                      "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(profileData.name || "User") +
                        "&background=0D8ABC&color=fff"
                    }
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {profileData.name || "Chưa cập nhật"}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">
                        {profileData.email || "Chưa có email"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Thông tin doanh nghiệp
                </h2>
              </div>
              <div className="px-6 py-8">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    {profileData.companyLogo ? (
                      <img
                        src={profileData.companyLogo}
                        alt="Company Logo"
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <Building2 className="w-10 h-10 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {profileData.companyName || "Chưa cập nhật"}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building2 className="w-4 h-4" />
                      <span className="text-sm">Công ty</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About Company */}
          <div className="bg-white rounded-lg border border-gray-200 mt-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Giới thiệu về công ty
              </h2>
            </div>
            <div className="px-6 py-8">
              <p className="text-gray-700 leading-relaxed">
                {profileData.companyDescription || "Chưa có mô tả về công ty."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default EmployerProfilePage;
