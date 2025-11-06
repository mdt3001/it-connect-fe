import React from "react";
const StatusBadge = ({ status }) => {
  const statusConfig = {
    APPLIED: {
      label: "Đã ứng tuyển",
      className: "bg-blue-100 text-blue-700",
    },
    ACCEPTED: {
      label: "Đã chấp nhận",
      className: "bg-green-100 text-green-700",
    },
    REJECTED: { label: "Đã từ chối", className: "bg-red-100 text-red-700" },
    IN_REVIEW: {
      label: "Đang xem xét",
      className: "bg-yellow-100 text-yellow-700",
    },
  };
  const config = statusConfig[status] || statusConfig.APPLIED;
  return (
    <span
      className={`px-4 py-2 rounded-md text-sm font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
