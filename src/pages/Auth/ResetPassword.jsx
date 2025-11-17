import React from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  Loader,
  CheckCircle,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useNavigate, useLocation, Link } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [formData, setFormData] = React.useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [formState, setFormState] = React.useState({
    loading: false,
    error: {},
    showPassword: false,
    showConfirmPassword: false,
    success: false,
  });

  const validatePassword = (password) => {
    if (!password.trim()) return "Mật khẩu không được để trống";
    if (password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
    if (!/[A-Z]/.test(password)) return "Mật khẩu phải chứa ít nhất 1 chữ hoa";
    if (!/[a-z]/.test(password))
      return "Mật khẩu phải chứa ít nhất 1 chữ thường";
    if (!/[0-9]/.test(password)) return "Mật khẩu phải chứa ít nhất 1 chữ số";
    return "";
  };

  const validateForm = () => {
    const errors = {
      newPassword: validatePassword(formData.newPassword),
      confirmPassword: !formData.confirmPassword
        ? "Vui lòng xác nhận mật khẩu"
        : formData.newPassword !== formData.confirmPassword
        ? "Mật khẩu không khớp"
        : "",
    };

    Object.keys(errors).forEach((key) => {
      if (!errors[key]) delete errors[key];
    });

    setFormState((prev) => ({ ...prev, error: errors }));
    return Object.keys(errors).length === 0;
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormState((prev) => ({ ...prev, loading: true, error: {} }));
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD, {
        email,
        newPassword: formData.newPassword,
      });

      if (response.data.code === 200) {
        setFormState((prev) => ({
          ...prev,
          loading: false,
          success: true,
        }));

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        loading: false,
        error: {
          submit:
            error.response?.data?.message ||
            "Đặt lại mật khẩu thất bại. Vui lòng thử lại.",
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
            Đặt lại mật khẩu thành công
          </h2>
          <p className="text-gray-600 mb-4">
            Mật khẩu của bạn đã được cập nhật. Vui lòng đăng nhập lại.
          </p>
          <p className="text-gray-500 text-sm">
            Chuyển hướng về trang đăng nhập trong 3 giây...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <Link
          to="/forgot-password"
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Link>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Đặt lại mật khẩu
          </h2>
          <p className="text-gray-600">Nhập mật khẩu mới của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu mới *
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={formState.showPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className={`pl-10 pr-10 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formState.error.newPassword
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Nhập mật khẩu mới"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    showPassword: !prev.showPassword,
                  }))
                }
              >
                {formState.showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            {formState.error.newPassword && (
              <p className="text-sm text-red-600 mt-2">
                <AlertCircle className="w-4 h-4 inline-block mr-1" />
                {formState.error.newPassword}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Ít nhất 8 ký tự, chứa chữ hoa, chữ thường, chữ số, và ký tự đặc
              biệt
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Xác nhận mật khẩu *
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={formState.showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`pl-10 pr-10 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formState.error.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Xác nhận mật khẩu"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    showConfirmPassword: !prev.showConfirmPassword,
                  }))
                }
              >
                {formState.showConfirmPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            {formState.error.confirmPassword && (
              <p className="text-sm text-red-600 mt-2">
                <AlertCircle className="w-4 h-4 inline-block mr-1" />
                {formState.error.confirmPassword}
              </p>
            )}
          </div>

          {formState.error.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">
                <AlertCircle className="w-4 h-4 inline-block mr-1" />
                {formState.error.submit}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={formState.loading}
            className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {formState.loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin mr-2" />
                Đang cập nhật...
              </>
            ) : (
              "Đặt lại mật khẩu"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default ResetPassword;
