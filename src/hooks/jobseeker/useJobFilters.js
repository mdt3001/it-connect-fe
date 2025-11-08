import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

export const useJobFilters = (user) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    pageNo: 0,
    pageSize: 10,
    totalPage: 0,
  });

  const [tempFilters, setTempFilters] = useState({
    keyword: "",
    location: "",
    category: "",
    type: "",
    minSalary: "",
    maxSalary: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    keyword: "",
    location: "",
    category: "",
    type: "",
    minSalary: "",
    maxSalary: "",
  });

  const fetchJobs = async (filterParams = {}, page = 0) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append("pageNo", page);
      params.append("pageSize", pagination.pageSize);

      if (filterParams.keyword) params.append("keyword", filterParams.keyword);
      if (filterParams.location)
        params.append("location", filterParams.location);
      if (filterParams.category)
        params.append("category", filterParams.category);
      if (filterParams.type) params.append("type", filterParams.type);
      if (filterParams.minSalary)
        params.append("minSalary", filterParams.minSalary);
      if (filterParams.maxSalary)
        params.append("maxSalary", filterParams.maxSalary);
      if (user) params.append("userId", user?.userId);

      const response = await axiosInstance.get(
        `${API_PATHS.JOB.GET_ALL_JOBS}?${params.toString()}`
      );

      if (response.data.code === 200) {
        const result = response.data.result;
        setJobs(result.items || []);
        setPagination({
          pageNo: result.pageNo,
          pageSize: result.pageSize,
          totalPage: result.totalPage,
        });
      } else {
        throw new Error("Failed to fetch jobs");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError("Failed to fetch jobs");
      toast.error("Không thể tải danh sách việc làm");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(appliedFilters, 0);
  }, [appliedFilters, user]);

  const handleTempFilterChange = (key, value) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setAppliedFilters({ ...tempFilters });
  };

  const handleSidebarFilterChange = (key, value) => {
    const newFilters = { ...appliedFilters, [key]: value };
    setAppliedFilters(newFilters);
    setTempFilters(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters = {
      keyword: "",
      location: "",
      category: "",
      type: "",
      minSalary: "",
      maxSalary: "",
    };
    setTempFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPage) {
      fetchJobs(appliedFilters, newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return {
    jobs,
    loading,
    error,
    pagination,
    tempFilters,
    appliedFilters,
    handleTempFilterChange,
    handleSearch,
    handleSidebarFilterChange,
    clearAllFilters,
    handlePageChange,
    fetchJobs,
  };
};
