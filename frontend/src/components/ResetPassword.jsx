import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { LockIcon } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      if (!res.data.success) {
        setError(res.data.message || "Failed to reset password");
        setIsLoading(false);
        return;
      }
      toast.success("Password reset successful");
      setMessage(res.data.message);
      setPassword("");
      setConfirm("");
      setTimeout(() => navigate("/login"), 2500); // redirect after success
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 ">
      <h1 className="text-3xl font-bold mb-6 text-white">KnowledgeFlow AI</h1>
      <div className="bg-black/30 p-6 rounded-2xl shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-center text-white">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="auth-input-label">Password</label>
            <div className="relative">
              <LockIcon className="auth-input-icon" />
              <input
                placeholder="New password"
                aria-label="new Password"
                autoComplete="new-password"
                type={showPassword1 ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input"
              />
              <button
                type="button"
                onClick={() => setShowPassword1((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                aria-pressed={showPassword1}
                aria-label={showPassword1 ? "Hide password" : "Show password"}
              >
                {/* Eye icon when hidden; eye-off when visible */}
                {showPassword1 ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <div className="mt-4">
            <label className="auth-input-label">Confirm Password</label>
            <div className="relative">
              <LockIcon className="auth-input-icon" />
              <input
                aria-label="confirm new password"
                autoComplete="confirm new password"
                name="confirm password"
                type={showPassword2 ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="input"
              />
              <button
                type="button"
                onClick={() => setShowPassword2((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                aria-pressed={showPassword2}
                aria-label={showPassword2 ? "Hide password" : "Show password"}
              >
                {/* Eye icon when hidden; eye-off when visible */}
                {showPassword2 ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 font-semibold text-xl bg-green-600 text-white py-2 rounded-lg
             active:bg-green-700 active:scale-95 
             transition transform duration-150 
             disabled:bg-green-500"
          >
            {isLoading ? "Processing..." : "Reset Password"}
          </button>
        </form>
        {message && (
          <p className="text-green-600 mt-3 text-center">{message}</p>
        )}
        {error && <p className="text-red-600 mt-3 text-center">{error}</p>}
      </div>
    </div>
  );
}
