import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  MessageCircleIcon,
  LockIcon,
  MailIcon,
  UserIcon,
  LoaderIcon,
} from "lucide-react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { NotebookIcon, Eye, EyeOff } from "lucide-react";
import GoogleSignInButton from "../components/GoogleSignInButton";

function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { signup, isSigningUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name cannot be empty ");
      return;
    }
    if (!formData.name.match(/^[a-zA-Z\s]+$/)) {
      toast.error("Name can only contain letters and spaces ");
      return;
    }
    if (!formData.name || formData.name.length < 3) {
      toast.error("Name must be at least 3 characters long ");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email cannot be empty ");
      return;
    }

    if (!formData.password.trim()) {
      toast.error("Password cannot be empty ");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long ");
      return;
    }

    const result = await signup(formData);
    if (result && result.success) {
      navigate("/login");
      toast.success("Account created successfully!");
    } else {
      toast.error(result.message || "Please try again");
    }

    setFormData({ name: "", email: "", password: "" });
  };

  return (
    <div className="w-full flex items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
        <div className="w-full flex flex-col md:flex-row">
          {/* FORM CLOUMN - LEFT SIDE */}
          <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30">
            <div className="w-full max-w-md">
              {/* HEADING TEXT */}
              <div className="text-center mb-8">
                <NotebookIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                <h2 className="text-2xl font-bold text-slate-200 mb-2">
                  Create Account
                </h2>
                <p className="text-slate-400">Sign up for a new account</p>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* FULL NAME */}
                <div>
                  <label className="auth-input-label">Full Name</label>
                  <div className="relative">
                    <UserIcon className="auth-input-icon" />

                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="input"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {/* EMAIL INPUT */}
                <div>
                  <label className="auth-input-label">Email</label>
                  <div className="relative">
                    <MailIcon className="auth-input-icon" />

                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input"
                      placeholder="johndoe@gmail.com"
                    />
                  </div>
                </div>

                {/* PASSWORD INPUT */}
                <div>
                  <label className="auth-input-label">Password</label>
                  <div className="relative">
                    <LockIcon className="auth-input-icon" />

                    <input
                      name="password"
                      aria-label="Password"
                      autoComplete="current-password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className="input"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                      aria-pressed={showPassword}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {/* Eye icon when hidden; eye-off when visible */}
                      {showPassword ? (
                        // eye-off / closed eye
                        <EyeOff />
                      ) : (
                        // eye / open eye
                        <Eye />
                      )}
                    </button>
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  className="auth-btn"
                  type="submit"
                  disabled={isSigningUp}
                >
                  {isSigningUp ? (
                    <LoaderIcon className="w-full h-5 animate-spin text-center" />
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="auth-link">
                  Already have an account? Login
                </Link>
                <p className="m-2">OR</p>
                <GoogleSignInButton className="w-full rounded" />
              </div>
            </div>
          </div>

          {/* FORM ILLUSTRATION - RIGHT SIDE */}
          <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
            <div>
              <img
                // src="/signup.webp"
                // alt="People using mobile devices"
                src={`${import.meta.env.BASE_URL}signup.webp`}
                alt="People using mobile devices"
                className="w-full h-auto object-contain"
              />
              <div className="mt-6 text-center">
                <h3 className="text-xl font-medium text-cyan-400">
                  Make a Note Today
                </h3>

                <div className="mt-4 flex justify-center gap-4">
                  <span className="auth-badge">Free</span>
                  <span className="auth-badge">Easy Setup</span>
                  <span className="auth-badge">Private</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SignUpPage;
