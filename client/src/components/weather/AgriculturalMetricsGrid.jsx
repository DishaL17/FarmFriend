import {
  FaSun,
  FaCloudRain,
  FaWind,
  FaCompass,
  FaClock,
  FaTint,
  FaShieldAlt,
} from "react-icons/fa";

export default function AgriculturalMetricsGrid({ weather }) {
  if (!weather) return null;

  const current = weather.current || {};
  const daily = weather.daily || {};

  // 1. UV Index calculation & advisory
  const uvMax = daily.uv_index_max?.[0] ?? 6.0;
  let uvLabel = "Moderate";
  let uvColor = "text-amber-600 bg-amber-50 border-amber-200";
  if (uvMax < 3) {
    uvLabel = "Low";
    uvColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
  } else if (uvMax >= 8) {
    uvLabel = "Very High";
    uvColor = "text-red-700 bg-red-50 border-red-200";
  } else if (uvMax >= 6) {
    uvLabel = "High";
    uvColor = "text-orange-700 bg-orange-50 border-orange-200";
  }

  // 2. Sunrise, Sunset & Daylight calculation
  const sunriseRaw = daily.sunrise?.[0];
  const sunsetRaw = daily.sunset?.[0];

  const formatTime = (isoStr) => {
    if (!isoStr) return "--:--";
    return new Date(isoStr).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const calculateDaylight = () => {
    if (!sunriseRaw || !sunsetRaw) return "Approx. 11h 30m";
    const diffMs = new Date(sunsetRaw).getTime() - new Date(sunriseRaw).getTime();
    if (diffMs <= 0) return "--";
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m daylight`;
  };

  // 3. 7-Day Rainfall sum
  const rainSum7Days = (daily.precipitation_sum || []).reduce(
    (acc, val) => acc + Number(val || 0),
    0
  );
  const rainProbToday = daily.precipitation_probability_max?.[0] ?? 0;

  // 4. Wind Gusts & Speed
  const windSpeed = current.wind_speed_10m ?? 7.5;
  const maxGust = daily.wind_speed_10m_max?.[0] ?? Math.round(windSpeed * 1.3);

  // 5. Evapotranspiration ET0
  const et0 = daily.et0_fao_evapotranspiration?.[0] ?? 4.2;

  // 6. Surface Pressure
  const pressure = current.surface_pressure ?? 965;

  const metrics = [
    {
      title: "UV Radiation Index",
      value: uvMax.toFixed(1),
      unit: "Index",
      badge: uvLabel,
      badgeColor: uvColor,
      icon: <FaSun className="text-amber-500 text-lg" />,
      subtext: uvMax >= 6 ? "High sun intensity. Provide shade & water for laborers." : "Safe solar radiation levels.",
    },
    {
      title: "Solar Cycle & Daylight",
      value: calculateDaylight(),
      unit: "",
      badge: `Rise: ${formatTime(sunriseRaw)}`,
      badgeColor: "text-amber-700 bg-amber-50 border-amber-200",
      icon: <FaClock className="text-orange-500 text-lg" />,
      subtext: `Sunset at ${formatTime(sunsetRaw)}. Field lighting needed after dusk.`,
    },
    {
      title: "Precipitation Outlook",
      value: `${rainProbToday}%`,
      unit: "Probability",
      badge: rainSum7Days > 0 ? `${rainSum7Days.toFixed(1)} mm / 7d` : "Dry Week",
      badgeColor: rainSum7Days > 5 ? "text-blue-700 bg-blue-50 border-blue-200" : "text-slate-700 bg-slate-50 border-slate-200",
      icon: <FaCloudRain className="text-blue-500 text-lg" />,
      subtext: rainProbToday > 40 ? "Rain likely today. Secure harvested produce." : "No significant rainfall expected today.",
    },
    {
      title: "Crop Evapotranspiration",
      value: Number(et0).toFixed(1),
      unit: "mm/day (ET₀)",
      badge: et0 > 4.5 ? "High Water Loss" : "Moderate Loss",
      badgeColor: et0 > 4.5 ? "text-amber-700 bg-amber-50 border-amber-200" : "text-emerald-700 bg-emerald-50 border-emerald-200",
      icon: <FaTint className="text-teal-600 text-lg" />,
      subtext: "Crop water depletion rate used to calculate irrigation volume.",
    },
    {
      title: "Wind Speed & Peak Gusts",
      value: `${windSpeed}`,
      unit: "m/s",
      badge: `Gust: ${maxGust} m/s`,
      badgeColor: maxGust > 6 ? "text-orange-700 bg-orange-50 border-orange-200" : "text-emerald-700 bg-emerald-50 border-emerald-200",
      icon: <FaWind className="text-cyan-600 text-lg" />,
      subtext: windSpeed <= 4.2 ? "Calm wind. Safe for chemical spraying." : "Elevated gusts. High pesticide drift risk.",
    },
    {
      title: "Atmospheric Barometer",
      value: `${pressure}`,
      unit: "hPa",
      badge: pressure >= 1010 ? "High Pressure" : "Stable",
      badgeColor: "text-slate-700 bg-slate-100 border-slate-200",
      icon: <FaCompass className="text-indigo-600 text-lg" />,
      subtext: "Atmospheric pressure correlates with clear sky weather patterns.",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            Agricultural Weather Indicators
          </h3>
          <p className="text-xs text-slate-400">
            Meteorological metrics vital for field operations, irrigation, and labor planning
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {metrics.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-3 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-slate-50 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-700">
                    {item.title}
                  </h4>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xl font-black text-slate-900">
                      {item.value}
                    </span>
                    {item.unit && (
                      <span className="text-[11px] font-semibold text-slate-400">
                        {item.unit}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-50 pt-2">
              {item.subtext}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
