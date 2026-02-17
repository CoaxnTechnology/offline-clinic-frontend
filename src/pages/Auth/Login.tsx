import React, { useState, FormEvent } from "react";
import { User, Lock, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginService } from "@/services/auth.service";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    console.log("Submitting Login...");
    console.log("Base URL:", import.meta.env.VITE_API_BASE_URL);
    console.log("Payload:", { username, password });

    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    try {
      setLoading(true);

      const response = await loginService({
        username,
        password,
      });

      console.log("Login Success Response:", response);

      if (response.success) {
        const user = response.data;

        // ✅ Save Access Token
        localStorage.setItem("access_token", response.access_token);

        // ✅ Save Refresh Token
        localStorage.setItem("refresh_token", response.refresh_token);
        // Save role separately (optional)
        localStorage.setItem("role", user.role);
       // localStorage.setItem("clinic_id", response.data.clinic_id.toString());
        console.log("User Role:", user.role);

        navigate("/home");
      } else {
        setError("Invalid username or password");
      }
    } catch (err: any) {
      console.log("Login Error Full Object:", err);
      console.log("Error Response:", err.response);
      console.log("Error Data:", err.response?.data);
      console.log("Error Status:", err.response?.status);
      console.log("Error Message:", err.message);

      setError(err.response?.data?.message || err.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06b6c9] flex items-center justify-center px-4 py-6">
      <div className="relative w-full max-w-6xl min-h-[620px]">
        {/* Background Left (Desktop) */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-br from-[#06b6c9] to-[#0891b2] rounded-[32px]" />

        {/* White Panel */}
        <div className="relative bg-white rounded-[24px] shadow-xl lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-[48%] w-full" />

        <div className="relative z-10 grid lg:grid-cols-2 grid-cols-1 min-h-[620px]">
          {/* LEFT SIDE */}
          <div className="hidden lg:flex flex-col justify-center px-14 text-white">
            <div className="mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                EE
              </div>
              <h1 className="text-2xl font-bold">Expert Echo</h1>
            </div>

            <h3 className="mt-6 text-lg font-semibold">
              Manage hospital operations
            </h3>
            <p className="text-sm opacity-90 mt-2 w-[80%]">
              Securely manage patients and medical workflows with a centralized
              system.
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-10">
            <div className="lg:hidden mb-6 text-center">
              <h1 className="text-2xl font-bold text-[#06b6c9]">Expert Echo</h1>
              <p className="text-sm text-gray-500">Medical Management System</p>
            </div>

            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">
              Sign In
            </h2>
            <p className="text-gray-500 mb-8">
              Enter your credentials to access admin panel
            </p>

            {error && (
              <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#06b6c9] outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Password
                </label>
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#06b6c9] hover:bg-[#0891b2] text-white px-10 py-3 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading && <Loader2 className="animate-spin" size={18} />}
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
