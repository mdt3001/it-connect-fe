import React from "react";
import { Clock } from "lucide-react";

const ApplicantDashboardCard = ({ applicant, position, time }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md">
      <div className="flex items-center space-x-4">
        <div className="h-11 w-11 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-xl flex items-center justify-center text-white">
          <span className="font-medium text-sm">
            {applicant.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        </div>

        <div>
          <h4 className="font-medium text-gray-900">{applicant.name}</h4>
          <p className="text-sm text-gray-500">{position}</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex items-center">
          <Clock className="h-4 w-4 text-gray-400 mr-1" />
          <span className="text-xs text-gray-500">{time}</span>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDashboardCard;
