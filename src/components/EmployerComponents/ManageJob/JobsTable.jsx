import React from "react";
import { ChevronUp, ChevronDown, Edit, X, Trash2, Users } from "lucide-react";

function JobsTable({
  jobs,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onToggleClose,
  onDelete,
  onViewApplicants,
}) {
  const formatSalary = (min, max) => {
    if (!min && !max) return "Thỏa thuận";
    return `${(min / 1000000).toFixed(0)} - ${(max / 1000000).toFixed(
      0
    )} triệu`;
  };

  const SortableHeader = ({ field, children }) => (
    <th
      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field &&
          (sortDirection === "asc" ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          ))}
      </div>
    </th>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader field="title">Tiêu đề</SortableHeader>
              <SortableHeader field="location">Địa điểm</SortableHeader>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mức lương
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ứng viên
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map((job) => (
              <tr
                key={job.jobId}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {job.title}
                    </div>
                    <div className="text-xs text-gray-500">{job.category}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {job.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onViewApplicants(job.jobId)}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    <Users className="w-4 h-4 mr-1" />
                    {job.applicationCount}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      job.closed
                        ? "bg-gray-100 text-gray-600"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {job.closed ? "Đã đóng" : "Đang tuyển"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit(job.jobId)}
                      className="inline-flex items-center px-3 py-1 rounded-lg text-blue-600 hover:text-blue-900 hover:bg-blue-50 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onToggleClose(job.jobId, job.closed)}
                      className="inline-flex items-center px-3 py-1 rounded-lg text-orange-600 hover:text-orange-900 hover:bg-orange-50 transition-colors"
                      title={job.closed ? "Mở lại" : "Đóng"}
                    >
                      {job.closed ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => onDelete(job.jobId)}
                      className="inline-flex items-center px-3 py-1 rounded-lg text-red-600 hover:text-red-900 hover:bg-red-50 transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default JobsTable;
