import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Rocket, Users, Search, Bell, LineChart } from "lucide-react";

function Features() {
  const features = [
    {
      icon: Search,
      title: "Tìm kiếm thông minh",
      desc: "Lọc nhanh theo kỹ năng, vị trí, mức lương và loại hình làm việc.",
    },
    {
      icon: Rocket,
      title: "Ứng tuyển nhanh",
      desc: "Nộp hồ sơ chỉ với vài cú click, theo dõi trạng thái dễ dàng.",
    },
    {
      icon: Users,
      title: "Hồ sơ nổi bật",
      desc: "Tối ưu hồ sơ để tăng cơ hội tiếp cận nhà tuyển dụng.",
    },
    {
      icon: ShieldCheck,
      title: "Xác thực tin tuyển dụng",
      desc: "Tin đăng được kiểm duyệt giúp bạn yên tâm tìm việc.",
    },
    {
      icon: Bell,
      title: "Thông báo cơ hội",
      desc: "Nhận thông báo ngay khi có việc phù hợp với bạn.",
    },
    {
      icon: LineChart,
      title: "Phân tích thị trường",
      desc: "Nắm bắt xu hướng mức lương và nhu cầu tuyển dụng.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-semibold text-gray-900"
          >
            Tính năng nổi bật
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-3 text-gray-600"
          >
            Công cụ mạnh mẽ giúp ứng viên và nhà tuyển dụng kết nối hiệu quả.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-gray-600">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;