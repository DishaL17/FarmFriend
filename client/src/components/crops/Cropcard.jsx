import { FaCalendarAlt, FaSeedling, FaMap } from "react-icons/fa";

export default function Cropcard({ crop }) {
  
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStageInfo = () => {
    if (!crop.date) return { index: 0, diffDays: 0, sprout: 7, vegetative: 30, flowering: 60, harvest: 100 };
    
    const sowedDate = new Date(crop.date);
    const currentDate = new Date();
    
    // Reset time components to compare days accurately
    sowedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    
    const diffTime = currentDate.getTime() - sowedDate.getTime();
    const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    
    // Read from DB values, otherwise fall back to standard defaults (e.g. Wheat values)
    const sprout = crop.sprout_day ?? 7;
    const vegetative = crop.vegetative_day ?? 30;
    const flowering = crop.flowering_day ?? 60;
    const harvest = crop.harvest_day ?? 100;
    
    let index = 0; // Seed
    if (diffDays >= harvest) {
      index = 4; // Harvest
    } else if (diffDays >= flowering) {
      index = 3; // Flowering
    } else if (diffDays >= vegetative) {
      index = 2; // Vegetative
    } else if (diffDays >= sprout) {
      index = 1; // Sprout
    }
    
    return { index, diffDays, sprout, vegetative, flowering, harvest };
  };

  const { index: activeIndex, diffDays, flowering, harvest } = getStageInfo();

  // Helper to determine status based on growth days
  const getStatus = () => {
    if (diffDays >= harvest) return { label: "Harvested", color: "bg-blue-50 text-blue-700 border-blue-100" };
    if (diffDays >= flowering) return { label: "Ready", color: "bg-amber-50 text-amber-700 border-amber-100" };
    return { label: "Active", color: "bg-emerald-50 text-emerald-700 border-emerald-100" };
  };

  const status = getStatus();

  const stages = [
    { label: "Seed", icon: "🌱" },
    { label: "Sprout", icon: "🌿" },
    { label: "Vegetative", icon: "🌾" },
    { label: "Flowering", icon: "🌼" },
    { label: "Harvest", icon: "🚜" },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-5 border border-white/20 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col gap-5 group">
      {/* Crop Name & Dynamic Status Badge */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700 group-hover:scale-110 transition-transform duration-300">
            <FaSeedling className="text-lg" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 capitalize leading-tight">
            {crop.crop}
          </h2>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* Sowed Area & Sowed On info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <div className="text-emerald-600 bg-emerald-50 p-1.5 rounded-md">
            <FaMap className="text-sm" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              Area
            </p>
            <p className="text-sm font-bold text-slate-700">
              {crop.area}
            </p>
           
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-emerald-600 bg-emerald-50 p-1.5 rounded-md">
            <FaCalendarAlt className="text-sm" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              Sowed On
            </p>
            <p className="text-sm font-bold text-slate-700">
              {formatDate(crop.date)}
            </p>
          </div>
        </div>
      </div>

      {/* Crop Growth Progress Stepper */}
      <div className="mt-2 border-t border-slate-100 pt-4 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <p className="text-xs font-bold text-slate-500">Crop Growth Stage</p>
          <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 text-[10px] px-2 py-0.5 rounded-full font-bold">
            Day {diffDays}
          </span>
        </div>

        <div className="relative flex items-center justify-between w-full mt-2">
          {/* Background Stepper connector line */}
          <div className="absolute left-4 right-4 top-4.5 h-[3px] bg-slate-100 z-0 rounded-full">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${(activeIndex / 4) * 100}%` }}
            />
          </div>

          {/* Individual Stage Node Bubbles */}
          {stages.map((stage, idx) => {
            const isCompleted = idx < activeIndex;
            const isActive = idx === activeIndex;

            return (
              <div key={idx} className="relative z-10 flex flex-col items-center gap-2 flex-1">
                <div
                  className={`
                    w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all duration-500 shadow-sm
                    ${isActive ? "bg-emerald-500 text-white scale-110 ring-4 ring-emerald-100 font-bold" : ""}
                    ${isCompleted ? "bg-emerald-50 text-emerald-800" : ""}
                    ${!isActive && !isCompleted ? "bg-slate-50 border border-slate-200 text-slate-400" : ""}
                  `}
                >
                  <span className={isActive ? "animate-pulse" : ""}>
                    {stage.icon}
                  </span>
                </div>
                <span
                  className={`
                    text-[8.5px] font-bold tracking-tight text-center leading-tight max-w-[55px]
                    ${isActive ? "text-emerald-700 font-extrabold" : "text-slate-400"}
                  `}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
