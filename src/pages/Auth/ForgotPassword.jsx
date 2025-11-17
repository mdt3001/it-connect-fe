import React from "react";
import { motion } from "framer-motion";
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [formState, setFormState] = React.useState({
    loading: false,
    error: null,
    success: false,
  });

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (formState.error) {
      setFormState((prev) => ({ ...prev, error: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    if (emailError) {
      setFormState((prev) => ({ ...prev, error: emailError }));
      return;
    }

    setFormState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      // Call send code API
      const response = await axiosInstance.post(
        API_PATHS.AUTH.FORGOT_PASSWORD,
        { email }
      );

      if (response.data.code === 200) {
        setFormState((prev) => ({
          ...prev,
          loading: false,
          success: true,
        }));

        // Navigate to verify code page after 2 seconds
        setTimeout(() => {
          navigate("/verify-reset-code", { state: { email } });
        }, 2000);
      }
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || "Gửi mã xác thực thất bại",
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
            Mã xác thực đã được gửi
          </h2>
          <p className="text-gray-600 mb-4">
            Vui lòng kiểm tra email của bạn để lấy mã xác thực.
          </p>
          <p className="text-gray-500 text-sm">
            Chuyển hướng đến trang xác thực trong 2 giây...
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
          to="/login"
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Link>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Quên mật khẩu?
          </h2>
          <p className="text-gray-600">
            Nhập email của bạn để nhận mã xác thực
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ email
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={handleInputChange}
                className={`pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formState.error ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nhập địa chỉ email"
              />
            </div>
            {formState.error && (
              <p className="text-sm text-red-600 mt-2">
                <AlertCircle className="w-4 h-4 inline-block mr-1" />
                {formState.error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={formState.loading}
            className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {formState.loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin mr-2" />
                Đang gửi...
              </>
            ) : (
              "Gửi mã xác thực"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;
