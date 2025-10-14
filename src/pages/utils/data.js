import {
  Search,
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  Shield,
  Clock,
  Award,
  Briefcase,
  Building2,
  LayoutDashboard,
  Plus,
} from "lucide-react";

export const jobSeekerFeatures = [
  {
    icon: Search,
    title: "Kết nối công việc mơ ước",
    description:
      "Khám phá hàng ngàn cơ hội việc làm phù hợp với kỹ năng và sở thích của bạn.",
  },
  {
    icon: FileText,
    title: "Tạo CV chuyên nghiệp",
    description: "Tạo CV chuyên nghiệp chỉ trong vài phút với các mẫu có sẵn.",
  },
  {
    icon: MessageSquare,
    title: "Hệ thống nhắn tin tích hợp",
    description:
      "Liên hệ trực tiếp với nhà tuyển dụng qua hệ thống nhắn tin tích hợp.",
  },
];

export const NAVIGATION_MENU = [
  { id: "employer-dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "post-job", name: "Đăng việc làm", icon: Plus },
  { id: "manage-jobs", name: "Quản lý việc làm", icon: Briefcase },
  { id: "company-profile", name: "Hồ sơ công ty", icon: Building2 },
];

export const CATEGORIES = [
  { value: "Engineering", label: "Kỹ thuật" },
  { value: "Design", label: "Thiết kế" },
  { value: "Marketing", label: "Tiếp thị" },
  { value: "Sales", label: "Bán hàng" },
  { value: "IT & Software", label: "Công nghệ thông tin & Phần mềm" },
  { value: "Customer Service", label: "Dịch vụ khách hàng" },
  { value: "Product", label: "Sản phẩm" },
  { value: "Operations", label: "Vận hành" },
  { value: "Finance", label: "Tài chính" },
  { value: "HR", label: "Nhân sự" },
  { value: "Other", label: "Khác" },
];

export const JOB_TYPES = [
  { value: "Remote", label: "Làm việc từ xa" },
  { value: "Full-time", label: "Toàn thời gian" },
  { value: "Part-time", label: "Bán thời gian" },
  { value: "Internship", label: "Thực tập" },
  { value: "Contract", label: "Hợp đồng" },
];

export const SALARY_RANGES = [
  "Ít hơn 20 triệu",
  "20 - 100 triệu",
  "Nhiều hơn 100 triệu",
];
