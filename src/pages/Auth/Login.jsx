import React from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { form, tr } from "framer-motion/client";

function Login() {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [formState, setFormState] = React.useState({
    loading: false,
    error: {},
    showPassword: false,
    success: true,
  });

  const validateEmail = (email) => {
    if (!email.trim()) return "Email không được để trống";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Email không hợp lệ";
    return "";
  };

  const validatePassword = (password) => {
    if (!password.trim()) return "Mật khẩu không được để trống";
    if (password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
    return "";
  };

  const validateForm = () => {
    const errors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };

    // remove empty errors
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
      // Simulate API call
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        loading: false,
        error: {
          submit: error.response?.data?.message || "Đăng nhập thất bại",
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thành công!</h2>
          <p className="text-gray-600">Bạn đã đăng nhập thành công.</p>
          <div className="animate-spin w-6 h-6 border-2 border-t-transparent border-blue-600 rounded-full mx-auto mt-4"></div>
          <p className="text-gray-500 text-sm mt-2">
            Đang chuyển hướng đến trang dashboard...
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
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
          <p className="text-gray-600">Chào mừng bạn quay trở lại</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ email
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                placeholder="Nhập địa chỉ email"
              />
            </div>

            {formState.error.email && (
              <p className="text-sm text-red-600 mt-2">
                <AlertCircle className="w-4 h-4 inline-block mr-1" />
                {formState.error.email}
              </p>
            )}
          </div>
          {/* password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={formState.showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                placeholder="Nhập mật khẩu"
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

            {formState.error.password && (
              <p className="text-sm text-red-600 mt-2">
                <AlertCircle className="w-4 h-4 inline-block mr-1" />
                {formState.error.password}
              </p>
            )}
          </div>

          {/* submit error */}

          {formState.error.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600 mt-2">
                <AlertCircle className="w-4 h-4 inline-block mr-1" />
                {formState.error.submit}
              </p>
            </div>
          )}

          {/* submit btn */}

          <button
            type="submit"
            disabled={formState.loading}
            className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
          >
            {formState.loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : formState.success ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              "Đăng nhập"
            )}
          </button>

          {/* Sign up link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <a
                href="/register"
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Đăng ký ngay
              </a>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;
