import React from "react";
import { TrendingUp } from "lucide-react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = "blue",
}) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
  };
  return (
    <div
      className={`bg-gradient-to-r ${colorClasses[color]} p-6 rounded-lg shadow-md text-white`}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xl font-bold">{value}</p>
          {trend && (
            <div className="flex items-center space-x-1 text-sm mt-1 gap-1">
              <TrendingUp />
              <span>{trendValue}</span>
            </div>
          )}
        </div>

        <div className="p-3 bg-white/10 rounded-xl">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
