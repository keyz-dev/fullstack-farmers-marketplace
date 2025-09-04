import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../api/auth";
import { useGoogleLogin } from "@react-oauth/google";
import { extractErrorMessage } from "../utils/extractError";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("userData");
      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        return JSON.parse(storedUser);
      }
      return null;
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      localStorage.removeItem("userData");
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken && storedToken !== "undefined" && storedToken !== "null" ? storedToken : null;
  });
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
          const response = await authAPI.verifyToken();
          if (response.valid) {
            const user = response.data;
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
      const response = await authAPI.login(email, password);
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
      const response = await authAPI.register(userData);
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
      const response = await authAPI.verifyEmail(email, code, origin);
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
      await authAPI.resendVerification(email);
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
          const response = await authAPI.googleOAuth(access_token);
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

  // State to store the role for Google sign up
  const [googleSignUpRole, setGoogleSignUpRole] = useState(null);

  // Google sign up hook - called at component level
  const handleGoogleSignUpHook = useGoogleLogin({
    scope: "profile email openid",
    onSuccess: async (tokenResponse) => {
      const { access_token } = tokenResponse;
      if (access_token && googleSignUpRole) {
        try {
         const response = await authAPI.googleSignUp({
            access_token,
            role: googleSignUpRole,
          });
          if (response.data) {
            const { user, token } = response.data;
            setUserAndToken(user, token || "");
            setAuthError(null);
            redirectBasedOnRole(user);
          }
        } catch (error) {
          // Use extractErrorMessage for consistency
          const errorMessage = extractErrorMessage(error);
          setAuthError(
            error?.response?.data?.message ||
              errorMessage ||
              "Google sign up failed. Please try again."
          );
        } finally {
          setLoading(false);
          setGoogleSignUpRole(null);
        }
      }
    },
    onError: (error) => {
      // Use extractErrorMessage for consistency
      const errorMessage = extractErrorMessage(error);
      setAuthError(
        error?.message ||
          errorMessage ||
          "Google sign up failed. Please try again."
      );
      setLoading(false);
      setGoogleSignUpRole(null);
    },
  });

  /**
   * Google sign up handler that accepts a role parameter
   * Usage: handleGoogleSignUp("farmer");
   */
  const handleGoogleSignUp = (role) => {
    setAuthError(null);
    setLoading(true);
    setGoogleSignUpRole(role);
    handleGoogleSignUpHook();
  };

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
    handleGoogleSignUp,
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
