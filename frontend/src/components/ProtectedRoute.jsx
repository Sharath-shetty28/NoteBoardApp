import { Navigate, Outlet } from "react-router-dom";
// import Cookies from "js-cookie";
import { useAuth } from "../AuthContext";

const ProtectedRoute = () => {
  const { authUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
