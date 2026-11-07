import { useState, useEffect } from "react";
import {
  FaRobot,
  FaSprayCan,
  FaTint,
  FaShieldAlt,
  FaRedo,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaInfoCircle,
  FaLeaf,
} from "react-icons/fa";
import { getWeatherCropAdvisory } from "../../api/ai";

export default function FarmingWeatherAdvisory({ weather }) {
  const [advisoryData, setAdvisoryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!weather) return;
    loadAdvisory();
  }, [weather?.city, weather?.latitude, weather?.longitude]);

  async function loadAdvisory() {
    if (!weather) return;
    setLoading(true);
    setError("");

    try {
      const data = await getWeatherCropAdvisory(weather);
      setAdvisoryData(data);
    } catch (err) {
      console.warn("Could not fetch remote weather advisory, using local indicators:", err);
      // Generate client-side fallback if not logged in or offline
      setAdvisoryData(buildLocalAdvisory(weather));
    } finally {
      setLoading(false);
    }
  }

  function buildLocalAdvisory(w) {
    const temp = w?.current?.temperature_2m ?? 25;
    const humidity = w?.current?.relative_humidity_2m ?? 50;
    const wind = w?.current?.wind_speed_10m ?? 6;
    const rainProb = w?.daily?.precipitation_probability_max?.[0] ?? 0;
    const rainSum = w?.daily?.precipitation_sum?.[0] ?? 0;

    const isWindLow = wind <= 4.5;
    const isRainLow = rainProb < 20;

    let sprayStatus = isRainLow && isWindLow ? "Optimal Window" : !isRainLow ? "Rain Risk" : "Wind Drift Caution";
    let sprayLevel = isRainLow && isWindLow ? "success" : !isRainLow ? "danger" : "warning";
    let sprayReason = isRainLow && isWindLow
      ? "Calm winds and low rain probability provide a safe window for foliar spraying."
      : !isRainLow
      ? `${rainProb}% rain probability will wash away chemicals. Postpone spray.`
      : `Wind speed (${wind} m/s) may cause chemical spray drift.`;

    let irrigationStatus = rainProb >= 40 ? "Hold Irrigation" : "Normal Schedule";
    let irrigationLevel = rainProb >= 40 ? "success" : "info";
    let irrigationReason = rainProb >= 40
      ? `Expected rainfall (${rainProb}% chance) will hydrate soil naturally.`
      : "Standard evaporative loss. Irrigate according to crop soil dryness.";

    let diseaseStatus = humidity >= 70 && temp >= 20 ? "High Alert" : humidity >= 60 ? "Moderate Watch" : "Low Risk";
    let diseaseLevel = humidity >= 70 && temp >= 20 ? "danger" : humidity >= 60 ? "warning" : "success";
    let diseaseReason = humidity >= 70
      ? `High humidity (${humidity}%) elevates risk of fungal leaf spot and blight.`
      : "Dry conditions limit fungal spore germination.";

    return {
      indicators: {
        spray: { status: sprayStatus, level: sprayLevel, reason: sprayReason },
        irrigation: { status: irrigationStatus, level: irrigationLevel, reason: irrigationReason },
        disease: { status: diseaseStatus, level: diseaseLevel, reason: diseaseReason },
      },
      aiAdvisory: `💧 Irrigation: ${irrigationReason}\n\n🧪 Spraying Window: ${sprayReason}\n\n🛡️ Field Protection: ${diseaseReason}`,
      isFallback: true,
    };
  }

  const indicators = advisoryData?.indicators || buildLocalAdvisory(weather).indicators;

  const getLevelBadge = (level) => {
    switch (level) {
      case "success":
        return {
          bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
          icon: <FaCheckCircle className="text-emerald-600 text-sm" />,
        };
      case "warning":
        return {
          bg: "bg-amber-50 text-amber-800 border-amber-200",
          icon: <FaExclamationTriangle className="text-amber-600 text-sm" />,
        };
      case "danger":
        return {
          bg: "bg-red-50 text-red-800 border-red-200",
          icon: <FaTimesCircle className="text-red-600 text-sm" />,
        };
      default:
        return {
          bg: "bg-blue-50 text-blue-800 border-blue-200",
          icon: <FaInfoCircle className="text-blue-600 text-sm" />,
        };
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 3 Core Agricultural Weather Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* 1. Pesticide / Foliar Spray Window */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-700">
                <FaSprayCan className="text-lg" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  Spray Window
                </h3>
                <p className="text-[11px] text-slate-400">Pesticides & Foliar</p>
              </div>
            </div>

            {(() => {
              const b = getLevelBadge(indicators.spray.level);
              return (
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${b.bg}`}>
                  {b.icon}
                  {indicators.spray.status}
                </span>
              );
            })()}
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            {indicators.spray.reason}
          </p>

          <div className="bg-slate-50 rounded-xl p-2.5 text-[11px] text-slate-500 flex justify-between font-medium">
            <span>Wind: {weather?.current?.wind_speed_10m ?? "--"} m/s</span>
            <span>Rain Risk: {weather?.daily?.precipitation_probability_max?.[0] ?? 0}%</span>
          </div>
        </div>

        {/* 2. Irrigation & Moisture Planner */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="bg-blue-100 p-2.5 rounded-xl text-blue-700">
                <FaTint className="text-lg" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  Irrigation Planner
                </h3>
                <p className="text-[11px] text-slate-400">Water Conservation</p>
              </div>
            </div>

            {(() => {
              const b = getLevelBadge(indicators.irrigation.level);
              return (
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${b.bg}`}>
                  {b.icon}
                  {indicators.irrigation.status}
                </span>
              );
            })()}
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            {indicators.irrigation.reason}
          </p>

          <div className="bg-slate-50 rounded-xl p-2.5 text-[11px] text-slate-500 flex justify-between font-medium">
            <span>ET₀ Loss: {weather?.daily?.et0_fao_evapotranspiration?.[0] ?? "4.2"} mm/day</span>
            <span>Expected Rain: {weather?.daily?.precipitation_sum?.[0] ?? 0} mm</span>
          </div>
        </div>

        {/* 3. Pest & Disease Alert Index */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="bg-amber-100 p-2.5 rounded-xl text-amber-700">
                <FaShieldAlt className="text-lg" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  Disease & Pest Alert
                </h3>
                <p className="text-[11px] text-slate-400">Fungal & Blight Risk</p>
              </div>
            </div>

            {(() => {
              const b = getLevelBadge(indicators.disease.level);
              return (
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${b.bg}`}>
                  {b.icon}
                  {indicators.disease.status}
                </span>
              );
            })()}
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            {indicators.disease.reason}
          </p>

          <div className="bg-slate-50 rounded-xl p-2.5 text-[11px] text-slate-500 flex justify-between font-medium">
            <span>Humidity: {weather?.current?.relative_humidity_2m ?? "--"}%</span>
            <span>Temperature: {Math.round(weather?.current?.temperature_2m ?? 0)}°C</span>
          </div>
        </div>

      </div>

      {/* AI Agricultural Weather Advisory Box */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        {/* Background Decorative Rings */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full pointer-events-none blur-xl"></div>
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-emerald-500/10 rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/15 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-inner">
                <FaRobot className="text-emerald-300 text-2xl animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white tracking-wide">
                    AI Agricultural Weather Advisor
                  </h3>
                  <span className="bg-emerald-500/40 border border-emerald-300/40 text-emerald-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Gemini AI
                  </span>
                </div>
                <p className="text-xs text-emerald-100/80">
                  Customized field guidance for your active crops & microclimate
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={loadAdvisory}
              disabled={loading}
              className="self-start sm:self-auto bg-white/10 hover:bg-white/20 border border-white/25 px-3 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
            >
              <FaRedo className={`text-[10px] ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Analyzing..." : "Refresh Insights"}</span>
            </button>
          </div>

          {loading ? (
            <div className="py-8 flex flex-col items-center justify-center text-center gap-2">
              <FaLeaf className="text-2xl text-emerald-300 animate-bounce" />
              <p className="text-sm font-semibold text-white animate-pulse">
                Synthesizing weather data with your crops...
              </p>
              <p className="text-xs text-emerald-200/70">
                Evaluating spray windows, evapotranspiration, and disease risks
              </p>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5">
              <div className="text-sm leading-relaxed whitespace-pre-line text-emerald-50 space-y-2">
                {advisoryData?.aiAdvisory || indicators.aiAdvisory}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
