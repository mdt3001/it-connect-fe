import React, { use } from "react";
import { useState, useEffect } from "react";
import {
  Plus,
  Briefcase,
  Users,
  Building2,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import Card from "../../components/EmployerComponents/EmployerDashboard/Card";
import StatCard from "../../components/EmployerComponents/EmployerDashboard/StatCard";
import JobDashboardCard from "../../components/EmployerComponents/EmployerDashboard/JobDashboardCard";
import ApplicantDashboardCard from "../../components/EmployerComponents/EmployerDashboard/ApplicantDashboardCard";
const fakeDashboardData = {
  counts: {
    activeJobs: 12,
    totalApplications: 145,
    totalHired: 8,
    trends: {
      activeJobs: 15,
      totalApplications: 23,
      totalHired: 10,
    },
  },
  data: {
    recentJobs: [
      {
        jobId: "1",
        title: "Senior Frontend Developer",
        location: "Hồ Chí Minh",
        salary: "25-35 triệu",
        applications: 24,
        createdAt: "2025-10-15T10:30:00Z",
        status: "active",
      },
      {
        jobId: "2",
        title: "Backend Developer (Node.js)",
        location: "Hà Nội",
        salary: "20-30 triệu",
        applications: 18,
        createdAt: "2025-10-18T14:20:00Z",
        status: "active",
      },
      {
        jobId: "3",
        title: "UI/UX Designer",
        location: "Remote",
        salary: "15-25 triệu",
        applications: 12,
        createdAt: "2025-10-20T09:15:00Z",
        status: "closed",
      },
    ],

    recentApplicants: [
      {
        applicantId: "A1",
        name: "Nguyễn Văn A",
        position: "Senior Frontend Developer",
        time: "2 hours ago",
      },
      {
        applicantId: "A2",
        name: "Trần Thị B",
        position: "Backend Developer (Node.js)",
        time: "5 hours ago",
      },
      {
        applicantId: "A3",
        name: "Lê Văn C",
        position: "UI/UX Designer",
        time: "1 day ago",
      },
    ],
  },
};

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getDashboardOverview = async () => {
    try {
      setLoading(true);
      const response = await axiosInstanddce.get(API_PATHS.DASHBOARD.OVERVIEW);
      if (response.status === 200) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard overview:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardOverview();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="employer-dashboard">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Your dashboard content here */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Vị trí đang tuyển dụng"
              value={dashboardData?.counts?.activeJobs || 0}
              icon={Briefcase}
              trend={true}
              trendValue={`${dashboardData?.counts?.trends?.activeJobs || 0}%`}
              color="blue"
            />

            <StatCard
              title="Tất cả ứng viên"
              value={dashboardData?.counts?.totalApplications || 0}
              icon={Users}
              trend={true}
              trendValue={`${
                dashboardData?.counts?.trends?.totalApplications || 0
              }%`}
              color="green"
            />

            <StatCard
              title="Đã tuyển dụng"
              value={dashboardData?.counts?.totalHired || 0}
              icon={CheckCircle2}
              trend={true}
              trendValue={`${dashboardData?.counts?.trends?.totalHired || 0}%`}
              color="purple"
            />
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card
              title="Bài đăng gần đây"
              subtitle="Các vị trí bạn đã đăng gần đây"
              headerAction={
                <button
                  className="cursor-pointer text-sm text-blue-600 hover:text-blue-700 font-medium"
                  onClick={() => navigate("/manage-jobs")}
                >
                  Xem tất cả
                </button>
              }
            >
              <div className="space-y-3">
                {fakeDashboardData?.data?.recentJobs
                  ?.slice(0, 3)
                  .map((job, index) => (
                    <JobDashboardCard key={index} job={job} />
                  ))}
                {fakeDashboardData?.data?.recentJobs?.length === 0 && (
                  <p className="text-gray-500">
                    Không có vị trí nào được đăng gần đây.
                  </p>
                )}
              </div>
            </Card>

            <Card
              title="Các ứng viên mới"
              subtitle="Ứng viên đã nộp đơn gần đây"
              headerAction={
                <button
                  className="cursor-pointer text-sm text-blue-600 hover:text-blue-700 font-medium"
                  onClick={() => navigate("/manage-jobs")}
                >
                  Xem tất cả
                </button>
              }
            >
              <div className="space-y-3">
                {fakeDashboardData?.data?.recentApplicants
                  ?.slice(0, 3)
                  .map((data, index) => (
                    <ApplicantDashboardCard
                      key={index}
                      applicant={data}
                      position={data?.position}
                      time={data?.time}
                    />
                  ))}
                {fakeDashboardData?.data?.recentApplicants?.length === 0 && (
                  <p className="text-gray-500">
                    Không có ứng viên nào đã nộp đơn gần đây.
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EmployerDashboard;
