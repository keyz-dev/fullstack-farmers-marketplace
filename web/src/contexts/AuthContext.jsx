import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";
import { useGoogleLogin } from "@react-oauth/google";
import { extractErrorMessage } from "../utils/extractError";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("userData");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  const invalidateToken = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUser(null);
    setToken(null);
  };

  const setUserAndToken = (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userData", JSON.stringify(user));
    setUser(user);
    setToken(token);
  };

  const redirectBasedOnRole = (user) => {
    // Default role-based redirection
    switch (user.role) {
      case "admin":
        navigate("/admin");
        break;
      case "farmer":
        navigate("/farmer");
        break;
      case "delivery_agent":
        navigate("/delivery_agent");
        break;
      case "client":
        navigate("/client");
        break;
      default:
        navigate("/");
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          const response = await authApi.verifyToken();
          if (response.valid) {
            const { user } = response.data;
            setUserAndToken(user, storedToken);
          } else {
            invalidateToken();
          }
        } else {
          invalidateToken();
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        invalidateToken();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    setLoading(true);
    try {
      const response = await authApi.login(email, password);
      const { user, token } = response.data;
      setUserAndToken(user, token);
      redirectBasedOnRole(user);
      return { success: true, user };
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setAuthError(errorMessage);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setAuthError(null);
    setLoading(true);
    try {
      const response = await authApi.register(userData);
      const { user, token } = response.data;
      setUserAndToken(user, token);
      redirectBasedOnRole(user);
      return { success: true, user };
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setAuthError(errorMessage);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const verifyAccount = async (email, code, origin) => {
    setLoading(true);
    try {
      const response = await authApi.verifyEmail(email, code, origin);
      const { user, token } = response.data;
      setUserAndToken(user, token);
      return { success: true, user };
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      return {
        success: false,
        error: errorMessage || "Verification failed. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async (email) => {
    setLoading(true);
    try {
      await authApi.resendVerification(email);
      return { success: true };
    } catch (error) {
      console.error("Resend verification failed:", error);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    scope: "profile email openid",
    onSuccess: async (tokenResponse) => {
      const { access_token } = tokenResponse;
      if (access_token) {
        try {
          const response = await authApi.googleOAuth(access_token);
          if (response.data) {
            const { user, token } = response.data;
            setUserAndToken(user, token);
            setAuthError(null);
            redirectBasedOnRole(user);
          }
        } catch (error) {
          setAuthError(
            error.response?.data?.message ||
              "Google login failed. Please try again."
          );
        }
      }
    },
    onError: (error) => {
      setAuthError(error.message || "Google login failed. Please try again.");
    },
  });

  const logout = () => {
    invalidateToken();
    navigate("/");
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("userData", JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    token,
    authError,

    setLoading,
    login,
    register,
    logout,
    setAuthError,
    verifyAccount,
    resendVerification,
    setUserAndToken,
    updateUser,
    handleGoogleLogin,
    redirectBasedOnRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
