import { GoogleLogin } from "@react-oauth/google";
import api from "../lib/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const GoogleSignInButton = ({ className }) => {
  const { setAuthUser } = useAuth();
  const navigate = useNavigate();
  const handleSuccess = async (credentialResponse) => {
    try {
      const googleToken = credentialResponse.credential;
      // Send to backend
      const res = await api.post("/auth/google-login", {
        token: googleToken,
      });

      if (res.data.success) {
        setAuthUser(res.data.user);
        navigate("/");
        toast.success("Logged in successfully!");
      } else {
        toast.error("Google login failed");
      }
    } catch (err) {
      console.error("Google login failed:", err);
    }
  };

  return (
    <GoogleLogin
      className={className}
      onSuccess={handleSuccess}
      onError={() => console.log("Login Failed")}
    />
  );
};

export default GoogleSignInButton;
