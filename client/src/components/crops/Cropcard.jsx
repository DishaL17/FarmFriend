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

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-5 border border-white/20 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col gap-3 group">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700 group-hover:scale-110 transition-transform duration-300">
            <FaSeedling className="text-lg" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 capitalize leading-tight">
            {crop.crop}
          </h2>
        </div>
        <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-100">
          Active
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-1">
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
    </div>
  );
}
