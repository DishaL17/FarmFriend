import { useEffect, useState } from "react";
import { fetchWeather } from "../api/weather";

import Nav from "../components/nav+side/nav";
import Sidebar from "../components/nav+side/sidebar";
import WeatherCard from "../components/weather/weathercard";
import WeeklyForecast from "../components/weather/weeklyforecast";
import FarmingWeatherAdvisory from "../components/weather/FarmingWeatherAdvisory";
import AgriculturalMetricsGrid from "../components/weather/AgriculturalMetricsGrid";
import LocationHeaderBar from "../components/weather/LocationHeaderBar";

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    loadWeather();
  }, []);

  async function loadWeather(customLat, customLon, bypassCache = false) {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user")) || {};

      const lat =
        customLat !== undefined && customLat !== null
          ? customLat
          : user.latitude ?? 23.2599;

      const lon =
        customLon !== undefined && customLon !== null
          ? customLon
          : user.longitude ?? 77.4126;

      const locName = user.location || user.district || "Farm Location";

      setCoords({ lat, lon });

      const data = await fetchWeather(lat, lon, locName, bypassCache);
      setWeather(data);
    } catch (err) {
      console.error("Failed to fetch weather:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleUseGps = (lat, lon) => {
    loadWeather(lat, lon, true);
  };

  const handleRefresh = () => {
    loadWeather(coords?.lat, coords?.lon, true);
  };

  return (
    <div className="flex min-h-screen bg-lime-50">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col lg:ml-64 bg-lime-50 min-w-0">
        <Nav setIsSidebarOpen={setIsSidebarOpen} />

        <div className="flex-1 p-4 sm:p-6 space-y-6">
          {/* Location & GPS Header Bar */}
          <LocationHeaderBar
            weather={weather}
            onRefresh={handleRefresh}
            onUseGps={handleUseGps}
            loading={loading}
          />

          {/* Top Hero Section: Today's Weather & 7-Day Forecast */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
            <div className="xl:col-span-2">
              <WeatherCard weather={weather} />
            </div>

            <div className="xl:col-span-1">
              <WeeklyForecast daily={weather?.daily} />
            </div>
          </div>

          {/* Agricultural Field Operations & AI Weather Advisory */}
          <FarmingWeatherAdvisory weather={weather} />

          {/* Key Agricultural Meteorological Metrics */}
          <AgriculturalMetricsGrid weather={weather} />
        </div>
      </main>
    </div>
  );
}
