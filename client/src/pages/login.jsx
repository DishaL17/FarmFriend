import { useState } from "react";
import Navbar from "../components/navbar/navbar";
import { useNavigate, Link } from "react-router-dom";
import { FaUserCheck, FaSignInAlt, FaLeaf } from "react-icons/fa";
import { API_BASE_URL } from "../config/api";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    if (phone.length !== 10) {
      alert("Enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoLogin() {
    try {
      setDemoLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/auth/demo-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/crops");
      } else {
        alert(data.message || "Demo login failed");
      }
    } catch (error) {
      console.error("Demo login error:", error);
      alert("Unable to login to demo account");
    } finally {
      setDemoLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 via-lime-50 to-green-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl mb-3 shadow-inner">
              <FaLeaf className="text-2xl" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
              Welcome Back
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Sign in to manage your crops, finances & smart AI advisory
            </p>
          </div>

          {/* Quick Demo Account Access Box */}
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-100 flex items-center gap-1.5">
                  <FaUserCheck className="text-sm" />
                  View-Only Demo Mode
                </p>
                <p className="text-xs text-white/90 mt-1 leading-relaxed">
                  Explore pre-configured crops (Wheat, Chana, Soybean), real growth state transitions, and AI advisors.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={demoLoading}
              className="mt-3 w-full bg-white text-emerald-800 hover:bg-emerald-50 font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-2 shadow transition-all cursor-pointer disabled:opacity-50"
            >
              {demoLoading ? (
                <span className="animate-pulse">Loading Demo Data...</span>
              ) : (
                <>
                  <FaSignInAlt className="text-xs" />
                  <span>Explore Demo Account (1-Click)</span>
                </>
              )}
            </button>
          </div>

          <div className="relative flex py-2 items-center mb-4">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Or Login with Phone
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter 10-digit phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                maxLength={10}
                required
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-5">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-emerald-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}