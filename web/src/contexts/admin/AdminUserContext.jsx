import React, {
  createContext,
  useReducer,
  useCallback,
  useEffect,
  useContext,
  useMemo,
} from "react";
import { adminUserApi } from "../../api/adminUser";
import { extractErrorMessage } from "../../utils/extractError";

// Initial state
const initialState = {
  users: [],
  loading: true,
  error: null,
  filters: {
    role: "all",
    status: "all",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  },
  stats: {
    total: 0,
    active: 0,
    verified: 0,
    inactive: 0,
    unverified: 0,
    recentRegistrations: 0,
    byRole: {},
  },
};

// Action types
const USER_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_USERS: "SET_USERS",
  SET_FILTERS: "SET_FILTERS",
  SET_PAGINATION: "SET_PAGINATION",
  SET_STATS: "SET_STATS",
  UPDATE_USER: "UPDATE_USER",
  DELETE_USER: "DELETE_USER",
  REFRESH_USERS: "REFRESH_USERS",
};

// Reducer
const userReducer = (state, action) => {
  switch (action.type) {
    case USER_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case USER_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case USER_ACTIONS.SET_USERS:
      return {
        ...state,
        users: action.payload.users || [],
        pagination: {
          ...state.pagination,
          total: action.payload.total || action.payload.users?.length || 0,
          totalPages: action.payload.totalPages || 1,
        },
        loading: false,
        error: null,
      };

    case USER_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, page: 1 },
      };

    case USER_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };

    case USER_ACTIONS.SET_STATS:
      return { ...state, stats: action.payload };

    case USER_ACTIONS.UPDATE_USER:
      return {
        ...state,
        users: state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        ),
      };

    case USER_ACTIONS.DELETE_USER:
      return {
        ...state,
        users: state.users.filter((user) => user._id !== action.payload),
      };

    case USER_ACTIONS.REFRESH_USERS:
      return {
        ...state,
        loading: true,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const AdminUserContext = createContext();

// Provider component
const AdminUserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Fetch all users (only once, not on filter changes) - like products
  const fetchUsers = useCallback(async () => {
    try {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });

      // Fetch all users for client-side filtering (like products)
      const response = await adminUserApi.getAllUsers({
        limit: 100, // Fetch reasonable amount for client-side filtering
      });

      if (response.success) {
        dispatch({
          type: USER_ACTIONS.SET_USERS,
          payload: {
            users: response.users || [],
            total: response.users?.length || 0,
            totalPages: 1,
          },
        });
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      const errorMessage =
        extractErrorMessage(err) || "Failed to load users. Please try again.";
      dispatch({ type: USER_ACTIONS.SET_ERROR, payload: errorMessage });
    }
  }, []); // No dependencies - fetch only once

  // Filter and sort users based on current filters (client-side) - memoized
  const getFilteredUsers = useMemo(() => {
    let filtered = state.users.filter((user) => {
      // Role filter
      if (state.filters.role !== "all" && user.role !== state.filters.role) {
        return false;
      }

      // Status filter
      if (state.filters.status !== "all") {
        switch (state.filters.status) {
          case "active":
            if (!user.isActive) return false;
            break;
          case "inactive":
            if (user.isActive) return false;
            break;
          case "verified":
            if (!user.isVerified) return false;
            break;
          case "unverified":
            if (user.isVerified) return false;
            break;
        }
      }

      // Search filter
      if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase();
        const name = user.name?.toLowerCase() || "";
        const email = user.email?.toLowerCase() || "";
        const phone = user.phone?.toLowerCase() || "";

        if (
          !name.includes(searchTerm) &&
          !email.includes(searchTerm) &&
          !phone.includes(searchTerm)
        ) {
          return false;
        }
      }

      return true;
    });

    // Sort users
    if (state.filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue, bValue;

        switch (state.filters.sortBy) {
          case "name":
            aValue = a.name || "";
            bValue = b.name || "";
            return state.filters.sortOrder === "desc"
              ? bValue.localeCompare(aValue)
              : aValue.localeCompare(bValue);
          case "email":
            aValue = a.email || "";
            bValue = b.email || "";
            return state.filters.sortOrder === "desc"
              ? bValue.localeCompare(aValue)
              : aValue.localeCompare(bValue);
          case "createdAt":
            aValue = new Date(a.createdAt);
            bValue = new Date(b.createdAt);
            return state.filters.sortOrder === "desc"
              ? bValue - aValue
              : aValue - bValue;
          case "lastLogin":
            aValue = a.lastLogin ? new Date(a.lastLogin) : new Date(0);
            bValue = b.lastLogin ? new Date(b.lastLogin) : new Date(0);
            return state.filters.sortOrder === "desc"
              ? bValue - aValue
              : aValue - bValue;
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [state.users, state.filters]);

  // Get paginated users from filtered results - memoized
  const getPaginatedUsers = useMemo(() => {
    const startIndex = (state.pagination.page - 1) * state.pagination.limit;
    const endIndex = startIndex + state.pagination.limit;
    return getFilteredUsers.slice(startIndex, endIndex);
  }, [getFilteredUsers, state.pagination.page, state.pagination.limit]);

  // Calculate pagination info from filtered results - memoized
  const getPaginationInfo = useMemo(() => {
    const total = getFilteredUsers.length;
    const totalPages = Math.ceil(total / state.pagination.limit);

    return {
      total,
      totalPages,
      currentPage: state.pagination.page,
    };
  }, [getFilteredUsers, state.pagination.limit, state.pagination.page]);

  // Fetch user statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await adminUserApi.getUserStats();
      if (response.success) {
        dispatch({ type: USER_ACTIONS.SET_STATS, payload: response.stats });
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, []);

  // Get single user
  const getUserById = useCallback(async (userId) => {
    try {
      const response = await adminUserApi.getUserById(userId);
      if (response.success) {
        return response.user;
      }
    } catch (err) {
      const errorMessage = extractErrorMessage(err) || "Failed to fetch user";
      throw new Error(errorMessage);
    }
  }, []);

  // Update user
  const updateUser = useCallback(async (userId, userData) => {
    try {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });

      const response = await adminUserApi.updateUser(userId, userData);

      if (response.success) {
        dispatch({
          type: USER_ACTIONS.UPDATE_USER,
          payload: response.user,
        });
        return response;
      } else {
        throw new Error(response.message || "Failed to update user");
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      dispatch({ type: USER_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Delete user
  const deleteUser = useCallback(async (userId) => {
    try {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });

      const response = await adminUserApi.deleteUser(userId);

      if (response.success) {
        dispatch({ type: USER_ACTIONS.DELETE_USER, payload: userId });
        return response;
      } else {
        throw new Error(response.message || "Failed to delete user");
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      dispatch({ type: USER_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Toggle user status
  const toggleUserStatus = useCallback(async (userId) => {
    try {
      const response = await adminUserApi.toggleUserStatus(userId);
      if (response.success) {
        dispatch({
          type: USER_ACTIONS.UPDATE_USER,
          payload: response.user,
        });
        return response;
      } else {
        throw new Error(response.message || "Failed to toggle user status");
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  }, []);

  // Verify user
  const verifyUser = useCallback(async (userId) => {
    try {
      const response = await adminUserApi.verifyUser(userId);
      if (response.success) {
        dispatch({
          type: USER_ACTIONS.UPDATE_USER,
          payload: response.user,
        });
        return response;
      } else {
        throw new Error(response.message || "Failed to verify user");
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  }, []);

  // Actions
  const actions = useMemo(
    () => ({
      // Filter management
      setFilter: (filterType, value) => {
        dispatch({
          type: USER_ACTIONS.SET_FILTERS,
          payload: { [filterType]: value },
        });
      },

      setSearch: (searchTerm) => {
        dispatch({
          type: USER_ACTIONS.SET_FILTERS,
          payload: { search: searchTerm },
        });
      },

      // Pagination
      setPage: (page) => {
        dispatch({ type: USER_ACTIONS.SET_PAGINATION, payload: { page } });
      },

      setLimit: (limit) => {
        dispatch({
          type: USER_ACTIONS.SET_PAGINATION,
          payload: { limit, page: 1 },
        });
      },

      // Clear all filters
      clearAllFilters: () => {
        dispatch({
          type: USER_ACTIONS.SET_FILTERS,
          payload: initialState.filters,
        });
        dispatch({
          type: USER_ACTIONS.SET_PAGINATION,
          payload: { page: 1 },
        });
      },

      // Refresh users
      refreshUsers: () => {
        dispatch({ type: USER_ACTIONS.REFRESH_USERS });
      },
    }),
    []
  );

  // Context value - memoized to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      ...state,
      filteredUsers: getPaginatedUsers,
      stats: state.stats,
      pagination: {
        ...state.pagination,
        ...getPaginationInfo,
      },
      actions,
      fetchUsers,
      fetchStats,
      getUserById,
      updateUser,
      deleteUser,
      toggleUserStatus,
      verifyUser,
    }),
    [
      state,
      getPaginatedUsers,
      getPaginationInfo,
      actions,
      fetchUsers,
      fetchStats,
      getUserById,
      updateUser,
      deleteUser,
      toggleUserStatus,
      verifyUser,
    ]
  );

  // Fetch users on mount only (like products)
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Fetch stats on mount only
  useEffect(() => {
    fetchStats();
  }, []); // Empty dependency array

  return (
    <AdminUserContext.Provider value={value}>
      {children}
    </AdminUserContext.Provider>
  );
};

export { AdminUserContext, AdminUserProvider };

export const useAdminUser = () => {
  const context = useContext(AdminUserContext);
  if (!context) {
    throw new Error("useAdminUser must be used within an AdminUserProvider");
  }
  return context;
};
