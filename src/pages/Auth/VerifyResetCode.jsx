import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader, CheckCircle, RotateCcw } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { OTPInput } from "./components/OTPInput";

function VerifyResetCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = React.useState("");
  const [formState, setFormState] = React.useState({
    loading: false,
    error: null,
    success: false,
    resendLoading: false,
    resendSuccess: false,
    resendCooldown: 0,
  });

  // Resend cooldown timer
  React.useEffect(() => {
    if (formState.resendCooldown > 0) {
      const timer = setTimeout(() => {
        setFormState((prev) => ({
          ...prev,
          resendCooldown: prev.resendCooldown - 1,
        }));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formState.resendCooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setFormState((prev) => ({
        ...prev,
        error: "Vui lòng nhập đầy đủ 6 chữ số",
      }));
      return;
    }

    setFormState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.VERIFY_CODE, {
        email,
        code: otp,
      });

      if (response.data.code === 200) {
        setFormState((prev) => ({
          ...prev,
          loading: false,
          success: true,
        }));

        // Navigate to reset password page after 2 seconds
        setTimeout(() => {
          navigate("/reset-password", { state: { email } });
        }, 2000);
      }
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || "Xác thực mã thất bại",
      }));
    }
  };

  const handleResendCode = async () => {
    setFormState((prev) => ({ ...prev, resendLoading: true, error: null }));
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.RESEND_CODE, {
        email,
      });

      if (response.data.code === 200) {
        setFormState((prev) => ({
          ...prev,
          resendLoading: false,
          resendSuccess: true,
          resendCooldown: 60,
        }));

        // Reset resend success message after 3 seconds
        setTimeout(() => {
          setFormState((prev) => ({ ...prev, resendSuccess: false }));
        }, 3000);
      }
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        resendLoading: false,
        error: error.response?.data?.message || "Gửi lại mã thất bại",
      }));
    }
  };

  if (formState.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-6xl"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          </motion.div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">
              Xác thực thành công!
            </h2>
            <p className="text-gray-600">
              Mã xác thực{" "}
              <span className="font-mono font-bold text-blue-600">{otp}</span>{" "}
              hợp lệ
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-gray-500">
              Chuyển hướng đến trang đặt lại mật khẩu...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md space-y-8"
      >
        {/* Header */}
        <div>
          <Link
            to="/forgot-password"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Quay lại
          </Link>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Xác thực mã</h1>
            <p className="text-gray-600">
              Nhập mã xác thực 6 chữ số đã được gửi đến{" "}
              <span className="font-semibold text-gray-900 break-all">
                {email}
              </span>
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Input */}
          <div className="space-y-4">
            <OTPInput
              value={otp}
              onChange={(value) => {
                setOtp(value);
                if (formState.error)
                  setFormState((prev) => ({ ...prev, error: null }));
              }}
              error={formState.error}
              disabled={formState.loading}
            />
          </div>

          {/* Success Message */}
          {formState.resendSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-700 font-medium">
                Mã xác thực đã được gửi lại
              </p>
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formState.loading || otp.length !== 6}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:from-blue-700 hover:to-blue-800 active:scale-95"
          >
            {formState.loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="w-5 h-5 animate-spin" />
                Đang xác thực...
              </span>
            ) : (
              "Xác thực"
            )}
          </button>
        </form>

        {/* Resend Code Section */}
        <div className="space-y-3 border-t border-gray-200 pt-6">
          <p className="text-center text-sm text-gray-600">
            Không nhận được mã xác thực?
          </p>

          <button
            type="button"
            onClick={handleResendCode}
            disabled={formState.resendCooldown > 0 || formState.resendLoading}
            className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {formState.resendLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Đang gửi...
              </>
            ) : formState.resendCooldown > 0 ? (
              <>
                <RotateCcw className="w-4 h-4" />
                Gửi lại sau {formState.resendCooldown}s
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4" />
                Gửi lại mã
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>Mã xác thực sẽ hết hạn sau 15 phút</p>
          <p>Kiểm tra thư mục spam nếu không tìm thấy email</p>
        </div>
      </motion.div>
    </div>
  );
}

export default VerifyResetCode;
