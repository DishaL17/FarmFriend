import { useEffect, useState } from "react";
import { fetchWeather } from "../api/weather";

import Nav from "../components/nav+side/nav";
import Sidebar from "../components/nav+side/sidebar";
import WeatherCard from "../components/weather/weathercard";
import WeeklyForecast from "../components/weather/weeklyforecast";

export default function Dashboard() {
  const [weather, setWeather] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

useEffect(() => {
  async function loadWeather() {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        console.error("User not found");
        return;
      }

      const data = await fetchWeather(
        user.latitude,
        user.longitude,
        user.location
      );

      console.log(data);
      setWeather(data);
    } catch (err) {
      console.error("Failed to fetch weather:", err);
    }
  }

  loadWeather();
}, []);

  return (
    <div className="flex min-h-screen bg-lime-50">
      <Sidebar
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />

      <main className="flex-1 flex flex-col w-full overflow-x-hidden ">
        <Nav setIsSidebarOpen={setIsSidebarOpen} />

        <section className="flex flex-col xl:flex-row gap-6 p-6">
          <div className="w-full xl:w-2/3">
            <WeatherCard weather={weather} />
          </div>

          <div className="w-full xl:w-1/3">
            <WeeklyForecast daily={weather?.daily} />
          </div>
        </section>
      </main>
    </div>
  );
}