import React, { useRef } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

export function OTPInput({ value = "", onChange, error, disabled = false }) {
  const inputRefs = useRef([]);

  // Handle input change
  const handleChange = (index, val) => {
    if (!/^\d*$/.test(val)) return;

    const newValue = (value || "").split("");
    newValue[index] = val;
    const result = newValue.join("").slice(0, 6);
    onChange(result);

    // Auto-focus next input
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!(value || "")[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const digits = paste.replace(/\D/g, "").slice(0, 6);

    if (digits) {
      onChange(digits);
      // Focus last input or next empty input
      const nextIndex = Math.min(digits.length, 5);
      setTimeout(() => inputRefs.current[nextIndex]?.focus(), 0);
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-2 sm:gap-3 justify-center">
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <input
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={(value || "")[index] || ""}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={disabled}
              className={`
                w-12 sm:w-14 h-12 sm:h-14
                text-center text-xl sm:text-2xl font-semibold font-mono
                border-2 rounded-lg
                transition-all duration-200
                focus:outline-none
                disabled:opacity-50 disabled:cursor-not-allowed
                ${
                  error
                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }
                ${(value || "")[index] ? "bg-blue-50" : "bg-white"}
              `}
              aria-label={`Digit ${index + 1}`}
            />
          </motion.div>
        ))}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mt-3 text-sm text-red-600"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  );
}

export default OTPInput;
