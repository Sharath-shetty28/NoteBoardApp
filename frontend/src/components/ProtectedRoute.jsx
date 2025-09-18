import { Navigate, Outlet } from "react-router-dom";
// import Cookies from "js-cookie";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { authUser } = useAuth();

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
