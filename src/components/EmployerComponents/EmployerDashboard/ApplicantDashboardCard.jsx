import React from "react";
import { Clock } from "lucide-react";
import moment from "moment";

const ApplicantDashboardCard = ({ applicant, jobTitle, createdAt }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md">
      <div className="flex items-center space-x-4">
        <div className="h-11 w-11 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-xl flex items-center justify-center text-white">
          <span className="font-medium text-sm">
            {applicant?.applicantName
              ? applicant.applicantName.split(" ").pop() ||
                applicant.applicantName
              : "N/A"}
          </span>
        </div>

        <div>
          <h4 className="font-medium text-gray-900">
            {applicant.applicantName}
          </h4>
          <p className="text-sm text-gray-500">{applicant.jobTitle}</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-gray-400 mr-1" />
          <span className="text-xs text-gray-500">
            {moment(applicant.createdAt)
              .fromNow()
              .replace("days ago", "ngày trước")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDashboardCard;
