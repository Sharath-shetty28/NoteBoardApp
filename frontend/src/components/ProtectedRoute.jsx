import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { authUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center text-center justify-center h-screen bg-black  ">
        <div className="text-center flex flex-col items-center">
          {/* Spinner */}
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mb-4"></div>
          <p className="text-blue-700 text-lg font-semibold">Loading...</p>
        </div>
      </div>
    );
  }
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
