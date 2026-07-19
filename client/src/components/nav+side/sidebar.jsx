import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaSeedling,
  FaWallet,
  FaStore,
  FaCloudSun,
  FaTractor,
  FaCog
} from "react-icons/fa";
import { FaTimes } from "react-icons/fa";


export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  const sidebarItems = [
    { name: "Dashboard", icon: FaHome, path: "/dashboard" },
    { name: "My Crops", icon: FaSeedling, path: "/crops" },
    { name: "Finance", icon: FaWallet, path: "/finance" },
    { name: "Marketplace", icon: FaStore, path: "/market" },
    { name: "Weather", icon: FaCloudSun, path: "/weather" },
    { name: "Equipment", icon: FaTractor, path: "/equipment" },
    { name: "Settings", icon: FaCog, path: "/settings" },
  ];

  return (
<aside
  className={`
    fixed top-0 left-0 h-screen w-64 z-50
    bg-gradient-to-b from-lime-900 via-lime-800 to-lime-500
    transform transition-transform duration-300
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
  `}
>
 <div className="relative">
  <h1 className="text-2xl font-bold text-white p-4">
    🌾 FarmFriend
  </h1>

  <button
    onClick={() => setIsSidebarOpen(false)}
    className="lg:hidden absolute top-4 right-4 text-white text-2xl"
  >
    <FaTimes />
  </button>
</div>
      
      <nav className="mt-16 space-y-2">
  {sidebarItems.map((item) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive }) =>
          `flex items-center gap-2 px-4 py-3 m-2 rounded-lg transition duration-200 ${
            isActive
              ? "bg-white text-lime-900 font-semibold shadow-md"
              : "text-white hover:bg-lime-600"
          }`
        }
      >
        <Icon className="text-xl" />
        <span>{item.name}</span>
      </NavLink>
    );
  })}
</nav>
    </aside>
  );
}