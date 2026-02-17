import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

const ResetPassword = () => {
  console.log("🔁 ResetPassword component rendered");

  const { token } = useParams();
  const navigate = useNavigate();

  console.log("🔑 Token from URL (useParams):", token);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  console.log("FINAL TOKEN:", token);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `https://api.clinicalgynecologists.space/api/auth/reset-password?token=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            new_password: password, // ✅ EXACT key backend wants
          }),
        },
      );

      const data = await res.json();
      console.log("RESET RESPONSE:", data);

      if (!res.ok || !data.success) {
        setError(data.message || "Reset failed");
        return;
      }

      setSuccess("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-center">Reset Password</h2>

        <p className="text-gray-500 text-center mb-6">
          Set a new password for your account
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => {
              console.log("✏️ Password changed");
              setPassword(e.target.value);
            }}
            className="w-full border rounded-lg px-4 py-2"
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => {
              console.log("✏️ Confirm password changed");
              setConfirmPassword(e.target.value);
            }}
            className="w-full border rounded-lg px-4 py-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded-lg"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
