import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/nav+side/nav";
import Sidebar from "../components/nav+side/sidebar";
import { getCrops } from "../api/crop";
import Cropcard from "../components/crops/Cropcard";
import AICropAdvisor from "../components/crops/AICropAdvisor";
import {
  FaPlus,
  FaSeedling,
  FaFilter,
  FaCalendarCheck,
  FaRobot,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaInfoCircle,
  FaLayerGroup,
  FaClock,
} from "react-icons/fa";

export default function Crops() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedCropForAi, setSelectedCropForAi] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const filterOptions = ["All", "Active", "Ready", "Harvested"];

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored) setCurrentUser(stored);
    } catch (e) {
      console.error(e);
    }

    async function loadCrops() {
      try {
        setLoading(true);
        const res = await getCrops();
        if (res.success) {
          const loadedCrops = res.crops || [];
          setCrops(loadedCrops);
          if (loadedCrops.length > 0) {
            setSelectedCropForAi(loadedCrops[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load crops:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCrops();
  }, []);

  const getCropStatus = (c) => {
    if (c.status === "Harvested") {
      return "Harvested";
    }

    if (!c.date) return "Active";

    const sowedDate = new Date(c.date);
    const currentDate = new Date();

    sowedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    const diffTime = currentDate.getTime() - sowedDate.getTime();
    const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    const harvestDay = Number(c.harvest_day ?? 100);

    if (diffDays >= harvestDay || c.status === "Ready") {
      return "Ready";
    }

    return "Active";
  };

  // Filter the crops list based on selected filter
  const filteredCrops = crops.filter((c) => {
    if (selectedFilter === "All") return true;
    return getCropStatus(c) === selectedFilter;
  });

  const activeCount = crops.filter((c) => getCropStatus(c) === "Active").length;
  const readyCount = crops.filter((c) => getCropStatus(c) === "Ready").length;
  const harvestedCount = crops.filter((c) => getCropStatus(c) === "Harvested").length;

  // Calculate total area in acres
  const totalAcreage = crops.reduce((sum, c) => {
    const parsed = parseFloat(c.area) || 0;
    return sum + parsed;
  }, 0);

  const handleSelectCropForAi = (crop) => {
    setSelectedCropForAi(crop);
    const advisorEl = document.getElementById("ai-crop-advisor");
    if (advisorEl) {
      advisorEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCropHarvested = (cropId) => {
    setCrops((prev) =>
      prev.map((c) => (c.id === cropId ? { ...c, status: "Harvested" } : c))
    );
  };

  // Current Indian agricultural season context
  const currentMonth = new Date().getMonth(); // 0-11
  const isKharif = currentMonth >= 5 && currentMonth <= 9;
  const seasonName = isKharif ? "Kharif Season" : "Rabi Season";
  const seasonAdvice = isKharif
    ? "Monsoon crops are active. Monitor field drainage and fungal spore spread."
    : "Winter season. Optimal weather for Wheat tillering, Gram flowering & Mustard pod filling.";

  return (
    <div className="flex min-h-screen bg-lime-50">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col lg:ml-64 bg-lime-50 min-w-0">
        <Nav setIsSidebarOpen={setIsSidebarOpen} />

        <div className="flex-1 p-4 sm:p-6 space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 p-2 rounded-xl text-emerald-700">
                  <FaSeedling className="text-lg" />
                </span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800">
                  Crop Management & Life Stages
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Track sowing milestones, real growth state transitions & receive AI agronomic care
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {currentUser?.isDemo && (
                <span className="bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                  <FaInfoCircle className="text-xs text-amber-600" />
                  Demo Mode (View Only)
                </span>
              )}

              <button
                onClick={() => {
                  const advisorEl = document.getElementById("ai-crop-advisor");
                  advisorEl?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <FaRobot className="text-emerald-600 text-xs" />
                <span>Ask AI Advisor</span>
              </button>

              <button
                onClick={() => navigate("/add-crop")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <FaPlus className="text-xs" />
                <span>Add Crop</span>
              </button>
            </div>
          </div>

          {/* Top Farm KPI Summary Row - Eliminates Empty Space */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total Crops
                </p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-1">
                  {crops.length} {crops.length === 1 ? "Crop" : "Crops"}
                </h3>
                <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">
                  {activeCount} Active • {readyCount} Ready
                </p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl text-xl">
                <FaSeedling />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Farm Area
                </p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-1">
                  {totalAcreage > 0 ? `${totalAcreage} Acres` : "12 Acres"}
                </h3>
                <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                  Under cultivation
                </p>
              </div>
              <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl text-xl">
                <FaLayerGroup />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Growth Transition
                </p>
                <h3 className="text-base sm:text-lg font-extrabold text-emerald-800 mt-1">
                  Multi-Stage Active
                </h3>
                <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">
                  Vegetative, Bloom & Maturity
                </p>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl text-xl">
                <FaClock />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Current Season
                </p>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-800 mt-1">
                  {seasonName}
                </h3>
                <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                  Optimal sowing & growth
                </p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl text-xl">
                <FaCalendarCheck />
              </div>
            </div>
          </div>

          {/* Main 12-Column Balanced Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 Columns: Sowed Crops Grid & Real State Transitions */}
            <div className="lg:col-span-7 flex flex-col gap-6 order-1 lg:order-none min-w-0">
              {/* Filter Pills Bar */}
              {crops.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-2.5 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 text-xs font-bold px-2 py-1 flex items-center gap-1.5 uppercase tracking-wider">
                      <FaFilter className="text-[10px] text-slate-400" />
                      Filter:
                    </span>
                    {filterOptions.map((filter) => {
                      const isActive = selectedFilter === filter;
                      const count =
                        filter === "All"
                          ? crops.length
                          : filter === "Active"
                          ? activeCount
                          : filter === "Ready"
                          ? readyCount
                          : harvestedCount;

                      return (
                        <button
                          key={filter}
                          onClick={() => setSelectedFilter(filter)}
                          className={`
                            px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer
                            ${isActive
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "text-slate-600 hover:bg-slate-100"}
                          `}
                        >
                          {filter} ({count})
                        </button>
                      );
                    })}
                  </div>

                  <span className="text-xs font-bold text-slate-400 pr-2">
                    Showing {filteredCrops.length} of {crops.length}
                  </span>
                </div>
              )}

              {/* Crops Grid */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-2xl border border-slate-100">
                  <p className="text-xs font-medium animate-pulse">Loading crop records & stage transitions...</p>
                </div>
              ) : crops.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                  <div className="bg-emerald-50 text-emerald-600 p-4 rounded-full mb-3">
                    <FaSeedling className="text-2xl animate-bounce" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 mb-1">No crops added yet</h3>
                  <p className="text-slate-400 text-xs mb-5 max-w-xs">
                    Track your sowing schedule, growth state transitions, and receive AI-powered care advice.
                  </p>
                  <button
                    onClick={() => navigate("/add-crop")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    Add Your First Crop
                  </button>
                </div>
              ) : filteredCrops.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                  <h3 className="text-base font-bold text-slate-800 mb-1">No matches found</h3>
                  <p className="text-slate-400 text-xs mb-4">
                    There are no crops matching the "{selectedFilter}" status filter.
                  </p>
                  <button
                    onClick={() => setSelectedFilter("All")}
                    className="text-emerald-600 hover:text-emerald-700 font-bold text-xs cursor-pointer"
                  >
                    Show All Crops
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5">
                  {filteredCrops.map((c) => (
                    <Cropcard
                      key={c.id}
                      crop={c}
                      onGetAiAdvice={handleSelectCropForAi}
                      onCropHarvested={handleCropHarvested}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right 5 Columns: AI Crop Assistant & Agronomic Milestones */}
            <div className="lg:col-span-5 flex flex-col gap-6 order-2 lg:order-none min-w-0">
              {/* Interactive AI Crop Assistant (Ask Questions & Get Meaningful Advice in Short) */}
              <AICropAdvisor
                crops={crops}
                selectedCrop={selectedCropForAi}
                onSelectCrop={setSelectedCropForAi}
              />

              {/* State Transition Upcoming Milestones Card */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <FaClock className="text-emerald-600 text-xs" />
                    Upcoming Field Milestones
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Action Calendar
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start gap-2.5 text-xs">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">Wheat (HD-2967) · 2nd Irrigation Window</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Due in 5 days (Crown root & tillering phase). Apply light irrigation and 25 kg/acre urea or Nano Urea spray.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start gap-2.5 text-xs">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">Chana (JG-11) · Pod Borer Scouting</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Active flowering stage. Install pheromone traps and prepare 5% Neem oil or Emamectin Benzoate barrier.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start gap-2.5 text-xs">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">Soybean (JS 9560) · Mandi Slot Booking</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Moisture level optimal (12-13%). Current Mandi benchmark rate ~₹4,400/Qtl. Book slot on Mandi tab.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sowing Season Context Card */}
              <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-2xl p-5 text-white shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-emerald-700/60 pb-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 text-emerald-200">
                    <FaCalendarCheck className="text-emerald-300" />
                    Agronomic Season Guide
                  </h3>
                  <span className="text-[10px] font-bold bg-emerald-950/60 text-emerald-200 px-2 py-0.5 rounded-full">
                    {seasonName}
                  </span>
                </div>

                <div>
                  <p className="text-base font-extrabold">
                    Active Rabi Cultivation Cycle
                  </p>
                  <p className="text-xs leading-relaxed text-emerald-100 mt-1">
                    {seasonAdvice}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-700/50 text-[11px]">
                  <div className="bg-emerald-900/40 p-2 rounded-lg">
                    <p className="text-emerald-300 text-[10px] font-semibold uppercase">Morning Humidity</p>
                    <p className="font-bold text-white mt-0.5">Moderate (Optimal)</p>
                  </div>
                  <div className="bg-emerald-900/40 p-2 rounded-lg">
                    <p className="text-emerald-300 text-[10px] font-semibold uppercase">Foliar Spray Suitability</p>
                    <p className="font-bold text-white mt-0.5">Good (7 AM - 10 AM)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
