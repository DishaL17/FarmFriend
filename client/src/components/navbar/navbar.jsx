import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="bg-emerald-800 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2 hover:opacity-95 transition">
          <span>🌾</span>
          <span>FarmFriend</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
          <Link to="/" className="hover:text-emerald-200 transition">
            Home
          </Link>
          <Link to="/crops" className="hover:text-emerald-200 transition">
            My Crops
          </Link>
          <Link to="/finance" className="hover:text-emerald-200 transition">
            Finance
          </Link>
          <Link
            to="/login"
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl transition shadow-sm"
          >
            Login / Demo
          </Link>
          <Link
            to="/register"
            className="border border-emerald-400 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition"
          >
            Register
          </Link>
        </div>

        <button
          onClick={() => navigate("/login")}
          className="md:hidden bg-emerald-600 text-xs font-bold px-3 py-1.5 rounded-lg text-white"
        >
          Login
        </button>
      </div>
    </nav>
  );
}
