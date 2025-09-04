import { useState, useEffect, useCallback, useMemo } from "react";
import { adminAPI } from "../api/admin";
import { toast } from "react-toastify";

export const useAdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });
  const [filters, setFilters] = useState({
    status: "",
    applicationType: "",
    search: "",
  });

  // Fetch all applications once
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminAPI.getApplications({
        page: 1,
        limit: 1000,
      });
      setApplications(response.applications || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch applications";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await adminAPI.getApplicationStats();
      const apiStats = response.stats || {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      };

      setStats(apiStats);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch stats";
      setError(errorMessage);
      toast.error(errorMessage);
      setStats({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      });
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Initial load only
  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, []); // Only run on mount

  // Client-side filtering (like the reference)
  const filteredApplications = useMemo(() => {
    const filtered = applications.filter((application) => {
      // Status filter
      if (filters.status && application.status !== filters.status) {
        return false;
      }

      // Application type filter
      if (
        filters.applicationType &&
        application.applicationType !== filters.applicationType
      ) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const businessName = getBusinessName(application).toLowerCase();
        const applicantName = application.user?.name?.toLowerCase() || "";
        const location = getLocation(application).toLowerCase();

        if (
          !businessName.includes(searchTerm) &&
          !applicantName.includes(searchTerm) &&
          !location.includes(searchTerm)
        ) {
          return false;
        }
      }

      return true;
    });

    return filtered;
  }, [applications, filters]);

  // Client-side pagination (like the reference)
  const paginatedApplications = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const paginated = filteredApplications.slice(startIndex, endIndex);

    return paginated;
  }, [filteredApplications, pagination.currentPage, pagination.limit]);

  // Calculate pagination info from filtered results
  const paginationInfo = useMemo(() => {
    const total = filteredApplications.length;
    const totalPages = Math.ceil(total / pagination.limit);

    return {
      total,
      totalPages,
      currentPage: pagination.currentPage,
    };
  }, [filteredApplications.length, pagination.currentPage, pagination.limit]);

  const setPage = useCallback((page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  }, []);

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, []);

  const setSearch = useCallback((searchTerm) => {
    setFilters((prev) => ({ ...prev, search: searchTerm }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      status: "",
      applicationType: "",
      search: "",
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, []);

  const refreshApplications = useCallback(() => {
    fetchApplications();
    fetchStats();
  }, [fetchApplications, fetchStats]);

  // Helper functions
  const getBusinessName = (application) => {
    if (application.applicationType === "farmer") {
      return application.farmName || "Farmer Application";
    } else {
      return application.businessName || "Delivery Agent Application";
    }
  };

  const getLocation = (application) => {
    if (application.applicationType === "farmer") {
      return (
        application.farmAddress?.city || "Location not specified"
      );
    } else {
      return application.businessAddress?.city || "Location not specified";
    }
  };

  return {
    applications: paginatedApplications,
    loading,
    error,
    stats,
    statsLoading,
    pagination: {
      ...pagination,
      ...paginationInfo,
    },
    filters,
    setPage,
    setFilter,
    setSearch,
    clearFilters,
    refreshApplications,
  };
};
