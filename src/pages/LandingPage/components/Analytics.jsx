import React from "react";
import { motion } from "framer-motion";
import { Users, Building2, TrendingUp, Briefcase } from "lucide-react";

function Analytics() {
  const metrics = [
    { icon: Users, label: "Ứng viên hoạt động", value: "25,000+" },
    { icon: Building2, label: "Doanh nghiệp", value: "1,200+" },
    { icon: Briefcase, label: "Công việc đang tuyển", value: "3,500+" },
    { icon: TrendingUp, label: "Lượt ứng tuyển tháng", value: "18,000+" },
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
            Số liệu nổi bật
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-3 text-gray-600"
          >
            Những con số thể hiện sức mạnh kết nối của ITConnect.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {metrics.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="p-6 rounded-xl border border-gray-100 bg-white text-center shadow-sm"
              >
                <div className="mx-auto w-11 h-11 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="mt-3 text-2xl font-extrabold text-gray-900">
                  {m.value}
                </div>
                <div className="text-sm text-gray-600">{m.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Analytics;
