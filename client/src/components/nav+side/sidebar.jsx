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


export default function Sidebar() {
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
<aside className="hidden lg:flex lg:flex-col w-64 h-screen bg-gradient-to-b from-lime-900 via-lime-800 to-lime-500 ">
      <h1 className="text-2xl sm:text-2xl font-bold text-white flex justify-center mt-4">
        🌾 FarmFriend
      </h1>

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