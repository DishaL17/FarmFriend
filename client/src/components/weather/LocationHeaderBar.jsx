import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaLocationArrow,
  FaRedo,
  FaCloudSun,
} from "react-icons/fa";

export default function LocationHeaderBar({
  weather,
  onRefresh,
  onUseGps,
  loading = false,
}) {
  const [gpsLoading, setGpsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGpsClick = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setGpsLoading(true);
    setMessage("Acquiring GPS location...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        setMessage("GPS coordinates updated!");
        onUseGps(pos.coords.latitude, pos.coords.longitude);
        setTimeout(() => setMessage(""), 4000);
      },
      (err) => {
        setGpsLoading(false);
        setMessage("");
        console.warn("GPS error:", err.message);
        alert("Could not access GPS location. Please allow location access in your browser.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Location Details */}
      <div className="flex items-center gap-3">
        <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-700 shrink-0">
          <FaMapMarkerAlt className="text-xl" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800">
              {weather?.city || "Your Farm Location"}
            </h1>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Live Forecast
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400 font-medium">
            <span>
              {weather?.latitude ? `${weather.latitude.toFixed(4)}° N, ${weather.longitude.toFixed(4)}° E` : "Coordinates active"}
            </span>
            <span>•</span>
            <span className="text-slate-500">
              Updated {new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
            </span>
            {message && (
              <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md animate-pulse">
                {message}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex items-center gap-2.5 self-start sm:self-auto">
        <button
          type="button"
          onClick={handleGpsClick}
          disabled={gpsLoading || loading}
          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow cursor-pointer disabled:opacity-50"
        >
          <FaLocationArrow className={`text-xs ${gpsLoading ? "animate-spin text-emerald-600" : ""}`} />
          <span>{gpsLoading ? "Locating..." : "Use My GPS"}</span>
        </button>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading || gpsLoading}
          className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow cursor-pointer disabled:opacity-50"
        >
          <FaRedo className={`text-xs ${loading ? "animate-spin text-emerald-600" : ""}`} />
          <span>{loading ? "Updating..." : "Refresh"}</span>
        </button>
      </div>
    </div>
  );
}
