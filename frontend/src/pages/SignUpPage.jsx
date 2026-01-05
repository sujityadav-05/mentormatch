import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";
import SpotlightCard from "../components/SpotlightCard";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "mentee",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <SpotlightCard className="custom-spotlight-card w-full max-w-3xl mt-4 mb-4" spotlightColor="rgba(0, 229, 255, 0.2)">
        <div className="flex flex-col justify-center items-center p-6 sm:p-12">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Get started</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Full Name</span></label>
                <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-base-content/40" />
                </div>
                  <input type="text" className="input input-bordered w-full pl-10" placeholder="Name" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                </div>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Email</span></label>
                <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                  <input type="email" className="input input-bordered w-full pl-10" placeholder="you@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Password</span></label>
                <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                  <input type={showPassword ? "text" : "password"} className="input input-bordered w-full pl-10" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="size-5 text-base-content/40" /> : <Eye className="size-5 text-base-content/40" />}
                  </button>
                </div>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Role</span></label>
                <select className="select select-bordered w-full" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                  <option value="mentee">Mentee</option>
                  <option value="mentor">Mentor</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
                {isSigningUp ? <><Loader2 className="size-5 animate-spin" /> Loading...</> : "Create Account"}
              </button>
            </form>

            <div className="text-center">
              <p className="text-base-content/60">Already have an account? <Link to="/login" className="link link-primary">Sign in</Link></p>
            </div>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
};
export default SignUpPage;