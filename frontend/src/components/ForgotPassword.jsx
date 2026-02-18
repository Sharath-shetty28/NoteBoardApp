import { useState } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { Link, MailIcon } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      if (!res.data.success) {
        toast.error("Failed to send reset link");
        setIsLoading(false);
        setError(res.data.message || "Failed to send reset link");
        return;
      }
      toast.success("password link sent to your email");
      setMessage(res.data.message);
      setEmail("");
    } catch (err) {
      toast.error("Failed to send reset link");
      setError(err.response?.data?.message || "Something went wrong");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 ">
      <h1 className="text-3xl font-bold mb-6 text-white">KnowledgeFlow AI</h1>
      <div className=" p-6 rounded-2xl shadow-lg w-96 bg-black/30 border border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-white text-center">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="auth-input-label">Email</label>
            <div className="relative">
              <MailIcon className="auth-input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
              />
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
            {isLoading ? "Processing..." : "Send Reset Link"}
          </button>
          {message && (
            <p className="text-green-500 mt-3 text-center">{message}</p>
          )}
          {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}
