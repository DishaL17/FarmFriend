import { useEffect, useState } from "react";
import { FaBell, FaSearch, FaUserCircle, FaBars } from "react-icons/fa";

export default function Nav({ setIsSidebarOpen }) {
  const [search, setSearch] = useState("");
   const [user, setUser] = useState(null);

   useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm px-4 sm:px-6 lg:px-8 py-3 ">
      
      <div className="flex items-center justify-between gap-4">
        <button
    onClick={() => setIsSidebarOpen(true)}
    className="lg:hidden bg-gray-100 p-2 rounded-lg hover:bg-gray-200"
  >
    <FaBars className="text-xl text-gray-700" />
  </button>
  
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-gray-100 py-2.5 sm:py-3 pl-11 pr-4 border border-transparent focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>

    
        <div className="flex items-center gap-3 sm:gap-5">
          
          <button className="relative rounded-xl bg-gray-100 p-2.5 sm:p-3 hover:bg-emerald-100 transition">
            <FaBell className="text-gray-600 text-lg" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer">
            <FaUserCircle className="text-3xl sm:text-4xl text-emerald-700" />

           
            <div className="hidden sm:block">
             <p className="font-semibold text-gray-800">
            {user?.name}
          </p>
              <p className="text-sm text-gray-500">Farmer</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}