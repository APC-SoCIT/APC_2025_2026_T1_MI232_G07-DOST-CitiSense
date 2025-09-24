import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function DOSTCitiSenseLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password, rememberMe });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left sidebar */}
      <div className="w-80 bg-blue-900 flex flex-col items-center justify-center text-white p-8">
        <div className="text-center">
          <h1 className="text-lg font-medium leading-tight">
            Department
            <br />
            of
            <br />
            Science
            <br />
            and
            <br />
            Technology
          </h1>
        </div>
      </div>

      {/* Right content area */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-normal text-gray-800">
              DOST-<span className="italic">CitiSense</span>
            </h2>
          </div>

          {/* Login form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                  required
                />
              </div>

              {/* Password field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  id="rememberMe"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>

              {/* Login button */}
              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                Login
              </button>

              {/* Forgot password link */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline bg-transparent border-none cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <span className="px-2 bg-white text-gray-400 text-sm">or</span>
              </div>

              {/* Sign in with Google */}
              <button
                type="button"
                className="flex items-center justify-center w-full border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-50 transition"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#4285F4"
                    d="M24 9.5c3.1 0 5.9 1.1 8.1 3.2l6-6C34.6 3.5 29.6 1.5 24 1.5 14.7 1.5 6.7 7.6 3.3 16l7.1 5.5C11.8 15.6 17.3 9.5 24 9.5z"
                  />
                  <path
                    fill="#34A853"
                    d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.9 7.1l7.5 5.8C43.5 37.5 46.5 31.5 46.5 24.5z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.4 28.1c-.5-1.5-.8-3.1-.8-4.8s.3-3.3.8-4.8l-7.1-5.5C2.5 16 1.5 20 1.5 23.3s1 7.3 2.8 10.3l7.1-5.5z"
                  />
                  <path
                    fill="#EA4335"
                    d="M24 46.5c6.5 0 12-2.1 16-5.7l-7.5-5.8c-2.2 1.5-5 2.3-8.5 2.3-6.7 0-12.3-6.1-13.6-13.5l-7.1 5.5C6.7 40.4 14.7 46.5 24 46.5z"
                  />
                </svg>
                <span className="text-sm text-gray-700">
                  Sign in with Google
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
