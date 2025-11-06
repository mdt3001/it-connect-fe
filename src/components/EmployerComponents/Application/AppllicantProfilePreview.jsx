// src/components/EmployerComponents/Application/AppllicantProfilePreview.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import toast from "react-hot-toast";
import { X, Download, CheckCircle2, User } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "APPLIED", label: "Đã ứng tuyển" },
  { value: "ACCEPTED", label: "Đã chấp nhận" },
  { value: "REJECTED", label: "Đã từ chối" },
  { value: "IN_REVIEW", label: "Đang xem xét" },
];

// Bản đồ hiển thị tiếng Việt cho trạng thái hiện tại
const STATUS_LABELS = {
  APPLIED: "Đã ứng tuyển",
  ACCEPTED: "Đã chấp nhận",
  REJECTED: "Đã từ chối",
  IN_REVIEW: "Đang xem xét",
  PENDING: "Đang chờ",
};

const AppllicantProfilePreview = ({
  selectedApplication,
  setSelectedApplication,
  handleDownloadResume,
  handleClose,
  jobDetails,
  handleStatusUpdated,
}) => {
  if (!selectedApplication) return null;

  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState(selectedApplication.status || "PENDING");

  // Đồng bộ status khi selectedApplication thay đổi
  useEffect(() => {
    setStatus(selectedApplication.status || "PENDING");
  }, [selectedApplication]);

  const onUpdateStatus = async () => {
    try {
      setUpdating(true);
      const res = await axiosInstance.put(
        API_PATHS.APPLICATION.UPDATE_STATUS(selectedApplication.applicationId),
        { status }
      );
      console.log("Update status response:", res);
      const { message, result: newStatus } = res.data || {};
      // cập nhật UI tại chỗ
      setStatus(newStatus);
      setSelectedApplication((prev) =>
        prev ? { ...prev, status: newStatus } : prev
      );
      // thông báo thành công
      toast.success(message || "Application status updated successfully");
      // báo cho parent cập nhật danh sách (nếu có truyền vào)
      if (typeof handleStatusUpdated === "function") {
        handleStatusUpdated(selectedApplication.applicationId, newStatus);
      } else if (typeof handleClose === "function") {
        // Nếu không có handleStatusUpdated, refresh danh sách qua handleClose
        handleClose();
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Cập nhật trạng thái thất bại");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setSelectedApplication(null)}
      />
      {/* modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md sm:max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* header */}
          <div className="relative bg-white">
            <button
              onClick={() => setSelectedApplication(null)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="pt-8 pb-4 flex flex-col items-center">
              {selectedApplication.avatar ? (
                <img
                  src={selectedApplication.avatar}
                  alt={selectedApplication.nameApplicant}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 border-4 border-white shadow">
                  <User className="w-12 h-12 text-white mx-auto mt-5" />
                </div>
              )}
              <h3 className="mt-3 text-xl font-semibold text-gray-900">
                {selectedApplication.nameApplicant || "Ứng viên"}
              </h3>
              <p className="text-gray-500">{selectedApplication.email || ""}</p>
            </div>
          </div>

          {/* body */}
          <div className="px-6 pb-6 space-y-6">
            {/* Applied Position */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-900 mb-2">
                Vị trí ứng tuyển
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                <div>
                  <p className="text-gray-500 font-medium text-sm">
                    {jobDetails?.category || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {jobDetails?.location || "—"} - {jobDetails?.type || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Application Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Thông tin ứng tuyển
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Trạng thái:</span>
                  <span className="text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-700">
                    {STATUS_LABELS[
                      status || selectedApplication.status || "PENDING"
                    ] || "Đang chờ"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Ngày ứng tuyển:</span>
                  <span className="text-sm text-gray-700">
                    {new Date(selectedApplication.createdAt).toLocaleDateString(
                      "vi-VN",
                      { day: "2-digit", month: "2-digit", year: "numeric" }
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() =>
                  handleDownloadResume?.(selectedApplication.resume)
                }
                className="cursor-pointer inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Download className="w-4 h-4 mr-2" />
                Resume
              </button>

              <div className="flex flex-col items-start gap-3 w-full relative">
                <label className="text-sm text-gray-600">
                  Thay đổi trạng thái
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="text-sm w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 z-10 bg-white"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={onUpdateStatus}
                  disabled={updating || status === selectedApplication.status}
                  className="mt-2 inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {updating ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppllicantProfilePreview;
