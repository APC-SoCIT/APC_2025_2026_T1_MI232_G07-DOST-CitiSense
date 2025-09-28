import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function DOSTCitiSenseLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Hardcoded user (no API yet)
    const validEmail = "user@example.com";
    const validPassword = "password123";

    if (email === validEmail && password === validPassword) {
      toast.success("Login successful!");
      navigate("/dashboard");
    } else {
      toast.error("Invalid email or password.");
    }
  }

  return (
    <div className="h-screen w-screen flex">
      <div className="hidden md:flex w-80 bg-blue-900 flex-col items-center justify-center text-white p-8">
        <h1 className="text-xs font-semibold leading-snug tracking-wide text-center">
          Department of <br /> Science and Technology
        </h1>
      </div>
      <div className="flex-1 flex items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-md">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              DOST-<span className="italic text-blue-700">CitiSense</span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Please login to continue
            </p>
          </div>

          {/* Login form */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                  placeholder="you@example.com"
                />
              </div>

              {/*Password*/}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12 transition"
                    required
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-center text-sm">
                <p className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">
                  Forgot Password?
                </p>
              </div>

              {/* Login button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-400 active:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
              >
                Login
              </button>

              {/* Divider */}
              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-300" />
                <span className="mx-2 text-gray-400 text-sm">or</span>
                <div className="flex-grow border-t border-gray-300" />
              </div>

              {/* Sign in with Google */}
              <button
                type="button"
                className="flex items-center justify-center w-full border border-gray-300 rounded-lg py-2 px-4 bg-white hover:bg-gray-50 transition duration-150 ease-in-out shadow-sm"
              >
                <span className="text-sm font-medium text-white">
                  Sign in with Google
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}
