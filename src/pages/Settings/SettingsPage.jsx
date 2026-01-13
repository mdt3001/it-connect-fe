import React, { useState } from "react";
import { Lock, Eye, EyeOff, Save, Loader2, CheckCircle } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Navbar from "../../components/layout/Navbar";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

// Move PasswordInput outside to prevent re-creation on each render
const PasswordInput = ({
  label,
  field,
  value,
  placeholder,
  onChange,
  error,
  showPassword,
  onToggleVisibility,
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      <button
        type="button"
        onClick={onToggleVisibility}
        className="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        {showPassword ? (
          <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
        ) : (
          <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
        )}
      </button>
    </div>
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);

const SettingsPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 8 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "Mật khẩu mới phải khác mật khẩu hiện tại";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await axiosInstance.put(API_PATHS.AUTH.CHANGE_PASSWORD(user.userId), {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      toast.success("Đổi mật khẩu thành công!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Đổi mật khẩu thất bại. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isJobSeeker = user?.role === "jobseeker";

  const content = (
    <div
      className={`min-h-screen ${
        isJobSeeker
          ? "bg-gradient-to-br from-blue-50 via-white to-purple-50"
          : "bg-gray-50"
      } py-8`}
    >
      <div
        className={`max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 ${
          isJobSeeker ? "pt-16" : ""
        }`}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Cài đặt</h1>
          <p className="mt-2 text-sm text-gray-600">
            Quản lý cài đặt tài khoản và bảo mật của bạn
          </p>
        </div>

        {/* Change Password Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Đổi mật khẩu
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Cập nhật mật khẩu để bảo vệ tài khoản của bạn
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <PasswordInput
              label="Mật khẩu hiện tại"
              field="currentPassword"
              value={formData.currentPassword}
              placeholder="Nhập mật khẩu hiện tại"
              onChange={(e) =>
                handleInputChange("currentPassword", e.target.value)
              }
              error={errors.currentPassword}
              showPassword={showPasswords.currentPassword}
              onToggleVisibility={() =>
                togglePasswordVisibility("currentPassword")
              }
            />
            <PasswordInput
              label="Mật khẩu mới"
              field="newPassword"
              value={formData.newPassword}
              placeholder="Nhập mật khẩu mới"
              onChange={(e) => handleInputChange("newPassword", e.target.value)}
              error={errors.newPassword}
              showPassword={showPasswords.newPassword}
              onToggleVisibility={() => togglePasswordVisibility("newPassword")}
            />
            <PasswordInput
              label="Xác nhận mật khẩu mới"
              field="confirmPassword"
              value={formData.confirmPassword}
              placeholder="Nhập lại mật khẩu mới"
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              error={errors.confirmPassword}
              showPassword={showPasswords.confirmPassword}
              onToggleVisibility={() =>
                togglePasswordVisibility("confirmPassword")
              }
            />

            {/* Password Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                Yêu cầu mật khẩu:
              </h3>
              <ul className="space-y-1">
                <li className="flex items-center text-sm">
                  <CheckCircle
                    className={`w-4 h-4 mr-2 ${
                      formData.newPassword.length >= 8
                        ? "text-green-500"
                        : "text-gray-300"
                    }`}
                  />
                  <span
                    className={
                      formData.newPassword.length >= 8
                        ? "text-green-700"
                        : "text-gray-500"
                    }
                  >
                    Ít nhất 8 ký tự
                  </span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle
                    className={`w-4 h-4 mr-2 ${
                      formData.newPassword === formData.confirmPassword &&
                      formData.confirmPassword !== ""
                        ? "text-green-500"
                        : "text-gray-300"
                    }`}
                  />
                  <span
                    className={
                      formData.newPassword === formData.confirmPassword &&
                      formData.confirmPassword !== ""
                        ? "text-green-700"
                        : "text-gray-500"
                    }
                  >
                    Mật khẩu xác nhận khớp
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Đổi mật khẩu
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  if (isJobSeeker) {
    return (
      <>
        <Navbar />
        {content}
      </>
    );
  }

  return <DashboardLayout>{content}</DashboardLayout>;
};

export default SettingsPage;
