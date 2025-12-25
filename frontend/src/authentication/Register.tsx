import { useState } from "react";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ChevronRight,
  Github,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Account created successfully!");
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F4F7FA] font-sans antialiased">
      {/* LEFT PANEL - Official Branding */}
      <div className="hidden lg:flex w-2/5 bg-[#003366] relative overflow-hidden flex-col justify-between p-16 text-white">
        {/* Subtle Tech Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%">
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center">
              <Globe className="text-[#003366]" size={28} />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight block leading-none">
                DOST
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-blue-300">
                Philippines
              </span>
            </div>
          </div>

          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Building a <br />
            <span className="text-blue-400 font-black italic">
              Smarter Nation.
            </span>
          </h1>
          <p className="text-blue-100/80 text-lg leading-relaxed max-w-md">
            The CitiSense Portal provides citizens with real-time data insights
            driven by cutting-edge science and technology.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-sm text-blue-200/60 font-medium">
          <span className="w-8 h-[1px] bg-blue-400/50"></span>
          OFFICIAL GOVERNMENT PORTAL
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,51,102,0.08)] border border-blue-50 overflow-hidden">
          <div className="p-8 sm:p-12">
            {/* HEADER */}
            <div className="mb-8">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#003366] text-[10px] font-bold uppercase tracking-wider mb-4">
                Citizen Registration
              </div>
              <h2 className="text-3xl font-bold text-[#1A1C1E] tracking-tight">
                Create Account
              </h2>
              <p className="text-gray-500 mt-2 text-sm">
                Join{" "}
                <span className="text-[#003366] font-bold">DOST-CitiSense</span>{" "}
                to access smart services.
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[#003366] text-xs font-bold uppercase tracking-wide">
                    First Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300"
                      size={16}
                    />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Juan"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-blue-100 bg-blue-50/30 focus:bg-white focus:border-[#003366] focus:ring-4 focus:ring-blue-100/50 outline-none text-sm transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#003366] text-xs font-bold uppercase tracking-wide">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Dela Cruz"
                    className="w-full px-4 py-2.5 rounded-lg border border-blue-100 bg-blue-50/30 focus:bg-white focus:border-[#003366] focus:ring-4 focus:ring-blue-100/50 outline-none text-sm transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#003366] text-xs font-bold uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300"
                    size={16}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="juan.delacruz@email.gov.ph"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-blue-100 bg-blue-50/30 focus:bg-white focus:border-[#003366] focus:ring-4 focus:ring-blue-100/50 outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#003366] text-xs font-bold uppercase tracking-wide">
                  Password
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300"
                    size={16}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-blue-100 bg-blue-50/30 focus:bg-white focus:border-[#003366] focus:ring-4 focus:ring-blue-100/50 outline-none text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-[#003366] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#003366] text-xs font-bold uppercase tracking-wide">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300"
                    size={16}
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-blue-100 bg-blue-50/30 focus:bg-white focus:border-[#003366] focus:ring-4 focus:ring-blue-100/50 outline-none text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-[#003366] transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="group w-full py-3 px-4 rounded-lg bg-[#003366] text-white font-bold hover:bg-[#002855] transition-all flex items-center justify-center gap-2 active:scale-[0.99] shadow-md hover:shadow-blue-900/20"
              >
                Create My Account
                <ChevronRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              <div className="flex items-center py-2">
                <div className="flex-grow border-t border-blue-50"></div>
                <span className="mx-4 text-blue-200 text-[10px] font-bold uppercase tracking-[0.2em]">
                  or
                </span>
                <div className="flex-grow border-t border-blue-50"></div>
              </div>

              <button
                type="button"
                className="w-full py-2.5 rounded-lg border border-blue-100 bg-white hover:bg-blue-50 text-[#003366] font-bold transition-all flex items-center justify-center gap-3 text-sm"
              >
                <Github size={18} />
                Register via GitHub
              </button>

              <p className="text-center text-sm text-gray-500 mt-6">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-[#003366] font-black border-b-2 border-blue-100 hover:border-[#003366] transition-all pb-0.5"
                >
                  Sign In
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
