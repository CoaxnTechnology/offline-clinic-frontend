import React, { useState, FormEvent } from "react";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // 👉 Direct redirect to home/dashboard
    navigate("/home");
    // agar tumhara dashboard route kuch aur hai to
    // navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#06b6c9] flex items-center justify-center px-4 py-6 relative overflow-hidden">
      {/* MAIN WRAPPER */}
      <div className="relative w-full max-w-6xl min-h-[620px]">

        {/* LEFT BACKGROUND (Desktop only) */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-br from-[#06b6c9] to-[#0891b2] rounded-[32px]" />

        {/* RIGHT WHITE PANEL */}
        <div
          className="
            relative
            bg-white
            rounded-[24px]
            shadow-xl
            lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-[48%]
            w-full
          "
        />

        {/* CONTENT GRID */}
        <div className="relative z-10 grid lg:grid-cols-2 grid-cols-1 min-h-[620px]">

          {/* LEFT CONTENT (Desktop only) */}
          <div className="hidden lg:flex flex-col justify-center px-14 text-white">
            <div className="mb-8 flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                X
              </div>
              <h1 className="text-2xl font-bold">Expert Echo</h1>
            </div>

            <div className="bg-white rounded-2xl p-6 w-[85%]">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4320/4320337.png"
                alt="medical"
                className="w-full"
              />
            </div>

            <h3 className="mt-6 text-lg font-semibold">
              Manage hospital operations
            </h3>
            <p className="text-sm opacity-90 mt-2 w-[80%]">
              Securely manage patients, diagnostics, and medical workflows
              with a centralized hospital management system.
            </p>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-10">

            {/* Mobile logo */}
            <div className="lg:hidden mb-6 text-center">
              <h1 className="text-2xl font-bold text-[#06b6c9]">
                Expert Echo
              </h1>
              <p className="text-sm text-gray-500">
                Medical Management System
              </p>
            </div>

            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">
              Sign In
            </h2>
            <p className="text-gray-500 mb-8">
              Enter your credentials to access admin panel
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Email */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#06b6c9] outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center">
                  <label className="text-sm text-gray-600 mb-1 block">
                    Password
                  </label>
                  <span className="text-sm text-[#06b6c9] cursor-pointer">
                    Forgot Password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#06b6c9] outline-none"
                  />
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <input type="checkbox" className="accent-[#06b6c9]" />
                Remember Me
              </div>

              {/* Button */}
              <button
                type="submit"
                className="
                  w-full sm:w-auto
                  bg-[#06b6c9]
                  hover:bg-[#0891b2]
                  text-white
                  px-10 py-3
                  rounded-lg
                  text-sm
                  font-semibold
                  transition
                "
              >
                Sign In
              </button>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
