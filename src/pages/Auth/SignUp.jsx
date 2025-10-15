import React from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building2,
  UserCheck,
  Loader,
  AlertCircle,
  CheckCircle,
  Upload,
} from "lucide-react";
import { useState } from "react";
import {
  validateEmail,
  validatePassword,
  validateAvatar,
} from "../utils/helper";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import uploadImage from "../utils/uploadImage";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const SignUp = () => {
  const { login } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
    avatar: null,
  });

  const [formState, setFormState] = useState({
    loading: false,
    error: null,
    success: null,
    showPassword: false,
    avatarPreview: null,
  });

  //handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formState.error[name]) {
      setFormState((prev) => ({
        ...prev,
        error: { ...prev.error, [name]: "" },
      }));
    }
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({ ...prev, role }));
    if (formState.error?.role) {
      setFormState((prev) => ({
        ...prev,
        error: { ...prev.error, role: "" },
      }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const error = validateAvatar(file);
      if (error) {
        setFormState((prev) => ({
          ...prev,
          error: { ...prev.error, avatar: error },
        }));
        return;
      }
    }
    setFormData((prev) => ({ ...prev, avatar: file }));
    //create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormState((prev) => ({
        ...prev,
        avatarPreview: e.target.result,
        error: { ...prev.error, avatar: "" },
      }));
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const errors = {
      fullName: formData.fullName ? "" : "Họ và tên không được để trống",
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      role: formData.role ? "" : "Vui lòng chọn vai trò",
      avatar: "",
    };

    // remove empty errors
    Object.keys(errors).forEach((key) => {
      if (!errors[key]) delete errors[key];
    });

    setFormState((prev) => ({ ...prev, error: errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setFormState((prev) => ({ ...prev, loading: true, error: {} }));
    try {
      // Simulate API call
      let avatarUrl = "";
      if (formData.avatar) {
        // Upload avatar and get URL
        const imgUploadResponse = await uploadImage(formData.avatar);
        avatarUrl = imgUploadResponse.imageUrl;
      }

      // Call signup API
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        avatar: avatarUrl || "",
      });

      setFormState((prev) => ({
        ...prev,
        loading: false,
        success: true,
        error: {},
      }));

      const { result } = response.data; // Access the result object
      const { token, ...userData } = result; // Extract token and user data

      if (token) {
        login(userData, token); // Pass userData and token to login function

        // Redirect based on user role
        const redirectPath =
          userData.role === "employer" ? "/employer-dashboard" : "/find-jobs";
        setTimeout(() => {
          navigate(redirectPath); // Use navigate for redirection
        }, 1500);
      }
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        loading: false,
        error: {
          ...prev.error,
          submit:
            error.response?.data?.message ||
            "Đã có lỗi xảy ra. Vui lòng thử lại.",
        },
      }));
    }
  };

  if (formState.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Đăng ký thành công!
          </h2>
          <p className="text-gray-600">Bạn đã đăng ký thành công.</p>
          <div className="animate-spin w-6 h-6 border-2 border-t-transparent border-blue-600 rounded-full mx-auto mt-4"></div>
          <p className="text-gray-500 text-sm mt-2">
            Đang chuyển hướng đến trang dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng Ký</h2>
          <p className="text-gray-600">Tạo tài khoản mới</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label
              htmlFor="fullName"
              className="mb-1 font-medium text-gray-700"
            >
              Họ và tên *
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formState.error?.fullName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Nhập họ và tên"
              />
            </div>
            {formState.error?.fullName && (
              <p className="text-sm text-red-600 mt-1">
                <AlertCircle className="w-4 h-4 inline-block mr-1" />
                {formState.error.fullName}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 font-medium text-gray-700">
              Địa chỉ email *
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formState.error?.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nhập địa chỉ email"
              />
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {formState.error?.email && (
              <p className="text-sm text-red-600 mt-1">
                <AlertCircle className="w-4 h-4 inline-block mr-1" />
                {formState.error.email}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="mb-1 font-medium text-gray-700"
            >
              Mật khẩu *
            </label>
            <div className="relative">
              <input
                type={formState.showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formState.error?.password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Nhập mật khẩu"
              />
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    showPassword: !prev.showPassword,
                  }))
                }
              >
                {formState.showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {formState.error?.password && (
              <p className="text-sm text-red-600 mt-1">
                <AlertCircle className="w-4 h-4 inline-block mr-1" />
                {formState.error.password}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ảnh đại diện ( Không bắt buộc )
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                {formState.avatarPreview ? (
                  <img
                    src={formState.avatarPreview}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleAvatarChange}
                  className="hidden"
                  id="avatar" // Add the id attribute
                />

                <label
                  htmlFor="avatar"
                  className="cursor-pointer bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium flex items-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  <span>Chọn Ảnh</span>
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  .jpg, .jpeg, .png (Dưới 5MB)
                </p>
              </div>
            </div>{" "}
            {formState.error?.avatar && (
              <p className="text-sm text-red-600 mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.error.avatar}
              </p>
            )}
          </div>

          {/* Role selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn vai trò *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleRoleChange("jobseeker")}
                className={`p-4 cursor-pointer rounded-lg border-2 transition-all ${
                  formData.role === "jobseeker"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <UserCheck className="w-6 h-6 mb-2 mx-auto" />
                <p className="text-center font-medium">Người tìm việc</p>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange("employer")}
                className={`p-4 cursor-pointer rounded-lg border-2 transition-all ${
                  formData.role === "employer"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Building2 className="w-6 h-6 mb-2 mx-auto" />
                <p className="text-center font-medium">Nhà tuyển dụng</p>
              </button>
            </div>

            {formState.error?.role && (
              <p className="text-sm text-red-600 mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.error.role}
              </p>
            )}
          </div>

          {formState.error?.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600 mt-1">
                <AlertCircle className="w-4 h-4 inline-block mr-1" />
                {formState.error.submit}
              </p>
            </div>
          )}
          <button
            type="submit"
            disabled={formState.loading}
            className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center disabled:opacity-50"
          >
            {formState.loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              "Đăng Ký"
            )}
          </button>

          {/* Login link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Đăng nhập ngay
              </a>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SignUp;
