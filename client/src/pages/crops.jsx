import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/nav+side/nav";
import Sidebar from "../components/nav+side/sidebar";
import { getCrops } from "../api/crop";
import Cropcard from "../components/crops/Cropcard";
import { 
  FaPlus, 
  FaSeedling, 
  FaFilter, 
  FaChartPie, 
  FaInfoCircle, 
  FaCalendarCheck 
} from "react-icons/fa";

export default function Crops() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const navigate = useNavigate();

  const filterOptions = ["All", "Active", "Ready", "Harvested"];

  useEffect(() => {
    async function loadCrops() {
      try {
        setLoading(true);
        const res = await getCrops();
        if (res.success) {
          setCrops(res.crops || []);
        }
      } catch (err) {
        console.error("Failed to load crops:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCrops();
  }, []);

  // Helper to determine the status of a crop for filtering
  const getCropStatus = (c) => {
    if (!c.date) return "Active";

    const sowedDate = new Date(c.date);
    const currentDate = new Date();
    sowedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    const diffTime = currentDate.getTime() - sowedDate.getTime();
    const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

    const harvest = c.harvest_day ?? 100;
    const flowering = c.flowering_day ?? 60;

    if (diffDays >= harvest) {
      return "Harvested";
    } else if (diffDays >= flowering) {
      return "Ready";
    } else {
      return "Active";
    }
  };

  // Filter the crops list based on selected filter
  const filteredCrops = crops.filter((c) => {
    if (selectedFilter === "All") return true;
    return getCropStatus(c) === selectedFilter;
  });

  // Calculate stats for the 30% side panel
  const activeCount = crops.filter((c) => getCropStatus(c) === "Active").length;
  const readyCount = crops.filter((c) => getCropStatus(c) === "Ready").length;
  const harvestedCount = crops.filter((c) => getCropStatus(c) === "Harvested").length;

  return (
    <div className="flex min-h-screen bg-lime-50">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col lg:ml-64 bg-lime-50 min-w-0">
        <Nav setIsSidebarOpen={setIsSidebarOpen} />

        <div className="flex-1 p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-stretch">
            
            {/* Left 70% Column: Sowed Crops Grid */}
            <div className="lg:col-span-7 flex flex-col gap-6 order-1 lg:order-none">
              {/* Header */}
              <div className="flex   justify-between sm:items-center gap-4">
                <div><h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="bg-emerald-100 p-2 rounded-lg text-emerald-700">
                    <FaSeedling className="text-lg" />
                  </span>
                  My Crops
                  
                </h1>
                <span>{crops.length} crops across fields</span></div>

                <button
                  onClick={() => navigate("/add-crop")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer w-fit"
                >
                  <FaPlus className="text-xs" />
                  Add Crop
                </button>
              </div>

              {/* Filter Bar */}
              {crops.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                  <span className="text-slate-400 text-xs font-bold px-3 py-1 flex items-center gap-1.5 uppercase tracking-wider">
                    <FaFilter className="text-[10px] text-slate-400" />
                    Filter:
                  </span>
                  {filterOptions.map((filter) => {
                    const isActive = selectedFilter === filter;
                    return (
                      <button
                        key={filter}
                        onClick={() => setSelectedFilter(filter)}
                        className={`
                          px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer
                          ${isActive 
                            ? "bg-emerald-600 text-white shadow-sm" 
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}
                        `}
                      >
                        {filter}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Crops Grid */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <p className="text-sm font-medium animate-pulse">Loading crops...</p>
                </div>
              ) : crops.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center max-w-md mx-auto mt-12">
                  <div className="bg-emerald-50 text-emerald-600 p-4 rounded-full mb-4">
                    <FaSeedling className="text-3xl animate-bounce" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">No crops added yet</h3>
                  <p className="text-slate-400 text-sm mb-6 max-w-xs">
                    Track your sowing schedule, active fields, and harvests by adding your first crop.
                  </p>
                  <button
                    onClick={() => navigate("/add-crop")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    Add Your First Crop
                  </button>
                </div>
              ) : filteredCrops.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center max-w-md mx-auto mt-12">
                  <h3 className="text-lg font-bold text-slate-800 mb-1">No matches found</h3>
                  <p className="text-slate-400 text-sm mb-4 max-w-xs">
                    There are no sowed crops in the <span className="font-bold text-slate-600">"{selectedFilter}"</span> stage.
                  </p>
                  <button
                    onClick={() => setSelectedFilter("All")}
                    className="text-emerald-600 hover:text-emerald-700 font-bold text-sm cursor-pointer"
                  >
                    Show All Crops
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
                  {filteredCrops.map((c) => (
                    <Cropcard key={c.id} crop={c} />
                  ))}
                </div>
              )}
            </div>

            {/* Right 30% Column: "Other Thing" (Analytics & Context Info) */}
            <div className="lg:col-span-3 flex flex-col gap-6 order-2 lg:order-none">
              {/* Analytics Panel */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-2">
                  <FaChartPie className="text-emerald-600" />
                  Crop Analytics
                </h3>
                
                <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
                  <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-xl p-3 flex flex-col">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">Active</span>
                    <span className="text-xl font-black text-emerald-700 mt-1">{activeCount}</span>
                  </div>
                  
                  <div className="bg-amber-50/50 border border-amber-100/50 rounded-xl p-3 flex flex-col">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">Ready</span>
                    <span className="text-xl font-black text-amber-700 mt-1">{readyCount}</span>
                  </div>

                  <div className="bg-blue-50/50 border border-blue-100/50 rounded-xl p-3 flex flex-col">
                    <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wide">Harvested</span>
                    <span className="text-xl font-black text-blue-700 mt-1">{harvestedCount}</span>
                  </div>
                </div>
              </div>

              {/* Sowing Season Card */}
              <div className="bg-gradient-to-b from-emerald-800 to-emerald-600 rounded-2xl p-5 text-white shadow-sm flex flex-col gap-4">
                <h3 className="text-sm font-bold flex items-center gap-2 border-b border-emerald-700/50 pb-2">
                  <FaCalendarCheck />
                  Sowing Calendar
                </h3>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-200">Current Season</p>
                  <p className="text-lg font-extrabold mt-0.5">Kharif Season</p>
                </div>
                <p className="text-xs leading-relaxed text-emerald-100">
                  Monsoon crops are sowed. Make sure to monitor irrigation thresholds and inspect active sprouts daily.
                </p>
              </div>

              {/* Crop Tips Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <FaInfoCircle className="text-emerald-600" />
                  Quick Advice
                </h3>
                <ul className="text-xs text-slate-500 space-y-2 list-disc list-inside leading-relaxed">
                  <li>Keep soil moist during vegetative growth phases.</li>
                  <li>Check Mandi prices daily to map crop profit metrics.</li>
                  <li>Record all seedling cost transactions inside Finance tab.</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}