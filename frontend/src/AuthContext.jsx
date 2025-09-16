// import { createContext, useContext, useEffect, useState } from "react";
// import { api } from "../lib/axios";
// import toast from "react-hot-toast";

// const AuthContext = createContext(null);
// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [authUser, setAuthUser] = useState(null);
//   const [isCheckingAuth, setIsCheckingAuth] = useState(true);
//   const [isSigningUp, setIsSigningUp] = useState(false);
//   const [isLoggingIn, setIsLoggingIn] = useState(false);

//   // 🔹 Check auth on mount
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await api.get("/auth/check");
//         setAuthUser(res.data);
//       } catch (error) {
//         console.log("Error in authCheck:", error);
//         setAuthUser(null);
//       } finally {
//         setIsCheckingAuth(false);
//       }
//     };
//     checkAuth();
//   }, []);

//   // 🔹 Signup
//   const signup = async (data) => {
//     setIsSigningUp(true);
//     try {
//       const res = await api.post("/auth/signup", data);
//       setAuthUser(res.data);
//       toast.success("Account created successfully!");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Signup failed");
//     } finally {
//       setIsSigningUp(false);
//     }
//   };

//   // 🔹 Login
//   const login = async (data) => {
//     setIsLoggingIn(true);
//     try {
//       const res = await api.post("/auth/login", data);
//       setAuthUser(res.data);
//       toast.success("Logged in successfully");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Login failed");
//     } finally {
//       setIsLoggingIn(false);
//     }
//   };

//   // 🔹 Logout
//   const logout = async () => {
//     try {
//       await api.post("/auth/logout");
//       setAuthUser(null);
//       toast.success("Logged out successfully");
//     } catch (error) {
//       toast.error("Error logging out");
//       console.log("Logout error:", error);
//     }
//   };

//   // 🔹 Update Profile
//   const updateProfile = async (data) => {
//     try {
//       const res = await api.put("/auth/update-profile", data);
//       setAuthUser(res.data);
//       toast.success("Profile updated successfully");
//     } catch (error) {
//       console.log("Error in update profile:", error);
//       toast.error(error.response?.data?.message || "Update failed");
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         authUser,
//         isCheckingAuth,
//         isSigningUp,
//         isLoggingIn,
//         signup,
//         login,
//         logout,
//         updateProfile,
//         setAuthUser,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "./lib/axios"; // <-- your axios setup
import toast from "react-hot-toast";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // check if user already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/check");
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
    try {
      const res = await api.post("/auth/signup", data);
      setAuthUser(res.data);
      toast.success("Account created successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  const login = async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      setAuthUser(res.data);
      toast.success("Logged in successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setAuthUser(null);
      toast.success("Logged out successfully!");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider value={{ authUser, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
