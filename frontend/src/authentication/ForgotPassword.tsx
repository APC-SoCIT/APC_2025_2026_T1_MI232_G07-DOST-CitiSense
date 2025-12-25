import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  console.log("Rendering ForgotPassword component");

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <div className="h-screen w-screen flex bg-gray-50">
      {/* LEFT SIDEBAR */}
      <div className="hidden md:flex w-80 bg-blue-900 flex-col items-center justify-center text-white p-8">
        <h1 className="text-3xl font-semibold leading-snug tracking-wide text-center">
          Department of <br /> Science and Technology
        </h1>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 w-full max-w-md">
          {/* HEADER */}
          <h2 className="text-3xl font-bold text-center text-gray-800">
            DOST-<span className="italic text-blue-700">CitiSense</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1 text-center">
            Reset your password
          </p>

          {/* EMAIL + SEND OTP */}
          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Email
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Send OTP
              </button>
            </div>
          </div>

          {/* OTP INPUT */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OTP Code
            </label>
            <input
              type="text"
              placeholder="Enter the OTP"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          {/* VERIFY BUTTON */}
          <button className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Verify OTP
          </button>

          {/* LOGIN LINK */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Remember your password?{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
