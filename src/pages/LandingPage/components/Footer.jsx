import React from "react";
import { Briefcase, Facebook, Github, Linkedin, Mail } from "lucide-react";

function Footer() {
  const year = new Date().getFullYear();

  const links = [
    { title: "Về ITConnect", items: ["Giới thiệu", "Tuyển dụng", "Blog", "Liên hệ"] },
    { title: "Dành cho Ứng viên", items: ["Tìm việc", "Tạo hồ sơ", "Hướng dẫn", "Bảo mật"] },
    { title: "Dành cho Doanh nghiệp", items: ["Đăng tin", "Quản lý ứng tuyển", "Bảng giá", "Hỗ trợ"] },
  ];

  const socials = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Mail, href: "mailto:support@itconnect.vn", label: "Email" },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ITConnect</span>
            </div>
            <p className="mt-3 text-gray-600">
              Nền tảng kết nối cơ hội việc làm IT giữa ứng viên và nhà tuyển dụng.
            </p>
            <div className="mt-4 flex items-center gap-3">
              {socials.map((s, i) => {
                const Icon = s.icon;
                return (
                  <a
                    key={i}
                    href={s.href}
                    aria-label={s.label}
                    className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-200 transition"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {links.map((col, idx) => (
            <div key={idx}>
              <h4 className="text-gray-900 font-semibold mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.items.map((item, i) => (
                  <li key={i}>
                    <a className="text-gray-600 hover:text-gray-900 cursor-pointer transition">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            © {year} ITConnect. All rights reserved.
          </p>
          <div className="text-sm text-gray-600">
            <a className="hover:text-gray-900 cursor-pointer">Điều khoản</a>
            <span className="mx-2">•</span>
            <a className="hover:text-gray-900 cursor-pointer">Chính sách bảo mật</a>
            <span className="mx-2">•</span>
            <a className="hover:text-gray-900 cursor-pointer">Cookie</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;