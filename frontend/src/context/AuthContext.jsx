import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // check if user already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/is-auth");
        setAuthUser(res.data);
      } catch (err) {
        setAuthUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const signup = async (data) => {
    setIsSigningUp(true);
    try {
      const res = await api.post("/auth/signup", data, {
        withCredentials: true,
      });
      setAuthUser(res.data);
      toast.success("Account created successfully!");
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
      return { success: false };
    } finally {
      setIsSigningUp(false);
    }
  };

  const login = async (data) => {
    setIsLoggingIn(true);
    try {
      const res = await api.post("/auth/login", data, {
        withCredentials: true,
      });
      setAuthUser(res.data.user);
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      return { success: false };
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setAuthUser(null);
      toast.success("Logged out successfully!");
      return { success: true };
    } catch (err) {
      toast.error("Logout failed");
      return { success: false };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        loading,
        signup,
        login,
        logout,
        isSigningUp,
        isLoggingIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
