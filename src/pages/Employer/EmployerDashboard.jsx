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

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getDashboardOverview = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.OVERVIEW);
      console.log("Dashboard overview response:", response);
      if (response.data.code === 200) {
        setDashboardData(response.data.result);
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
              value={dashboardData?.counts?.totalActiveJobs || 0}
              icon={Briefcase}
              trend={true}
              trendValue={`${dashboardData?.trends?.activeJobs || 0}%`}
              color="blue"
            />

            <StatCard
              title="Tất cả ứng viên"
              value={dashboardData?.counts?.totalApplications || 0}
              icon={Users}
              trend={true}
              trendValue={`${dashboardData?.trends?.applications || 0}%`}
              color="green"
            />

            <StatCard
              title="Đã tuyển dụng"
              value={dashboardData?.counts?.totalHired || 0}
              icon={CheckCircle2}
              trend={true}
              trendValue={`${dashboardData?.trends?.hired || 0}%`}
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
                {dashboardData?.data?.recentJobs
                  ?.slice(0, 5)
                  .map((job, index) => (
                    <JobDashboardCard key={index} job={job} />
                  ))}
                {dashboardData?.data?.recentJobs?.length === 0 && (
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
                {dashboardData?.data?.recentApplications
                  ?.slice(0, 5)
                  .map((data, index) => (
                    <ApplicantDashboardCard
                      key={index}
                      applicant={data}
                      jobTitle={data?.jobTitle}
                      createdAt={data?.createdAt}
                    />
                  ))}
                {dashboardData?.data?.recentApplications?.length === 0 && (
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
