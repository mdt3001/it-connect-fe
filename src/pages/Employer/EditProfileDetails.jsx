import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { ArrowLeft, ImagePlus, Loader2, Save } from "lucide-react";

const EditProfileDetails = ({
  formData,
  handleImageChange,
  handleInputChange,
  handleSave,
  handleCancel,
  uploading,
  saving,
}) => {
  const onSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };

  return (
    <DashboardLayout activeMenu="company-profile">
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
              Chỉnh sửa hồ sơ doanh nghiệp
            </h1>
            <p className="text-blue-100">
              Cập nhật thông tin cá nhân và doanh nghiệp để thu hút ứng viên phù hợp.
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="p-6 sm:p-8 space-y-10">
              {/* Thông tin cá nhân */}
              <section>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Thông tin cá nhân
                  </h2>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-transparent rounded-lg transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Hủy
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[240px,1fr] gap-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative">
                      <img
                        src={
                          formData.avatar ||
                          "https://ui-avatars.com/api/?name=" +
                          encodeURIComponent(formData.name || "Nhà tuyển dụng") +
                          "&background=0D8ABC&color=fff"
                        }
                        alt="Ảnh đại diện"
                        className="w-36 h-36 object-cover rounded-full border-4 border-white shadow-md"
                      />
                    </div>
                    <label
                      htmlFor="avatar-upload"
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition"
                    >
                      <ImagePlus className="w-4 h-4" />
                      {uploading.avatar ? "Đang tải..." : "Đổi ảnh đại diện"}
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(e, "avatar")}
                      disabled={uploading.avatar}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email liên hệ
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Thông tin doanh nghiệp */}
              <section>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Thông tin doanh nghiệp
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {uploading.companyLogo && (
                      <span className="inline-flex items-center gap-2 text-blue-600">
                        <Loader2 className="w-4 h-4 animate-spin" /> Đang tải logo...
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[200px,1fr] gap-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-32 flex items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50">
                      {formData.companyLogo ? (
                        <img
                          src={formData.companyLogo}
                          alt="Logo doanh nghiệp"
                          className="max-h-24 object-contain"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">
                          Chưa có logo
                        </span>
                      )}
                    </div>
                    <label
                      htmlFor="company-logo-upload"
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition"
                    >
                      <ImagePlus className="w-4 h-4" />
                      {uploading.companyLogo ? "Đang tải..." : "Tải logo"}
                    </label>
                    <input
                      id="company-logo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(e, "companyLogo")}
                      disabled={uploading.companyLogo}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên doanh nghiệp
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        placeholder="Nhập tên doanh nghiệp"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giới thiệu công ty
                      </label>
                      <textarea
                        value={formData.companyDescription}
                        onChange={(e) => handleInputChange("companyDescription", e.target.value)}
                        rows={5}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        placeholder="Mô tả ngắn gọn về công ty của bạn"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="bg-gray-50 px-6 sm:px-8 py-4 flex flex-col sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditProfileDetails;