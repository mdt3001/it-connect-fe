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
      {!loading ? (
          <LoadingSpinner />
      ) : (
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Your dashboard content here */}
        </div>
      )}
    </DashboardLayout>
  );
};

export default EmployerDashboard;
