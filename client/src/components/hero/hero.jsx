import { useEffect, useState } from "react";
import { fetchWeather } from "../../api/weather";

import WeatherCard from "../weather/weathercard";
import ActiveCrops from "../crops/activecrop";
import Cropstatus from "../crops/cropstatus";


export default function Hero() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    async function loadWeather() {
      try {
        const data = await fetchWeather("Bhopal");
        console.log(data); // check that daily exists
        setWeather(data);
      } catch (error) {
        console.error("Failed to load weather:", error);
      }
    }

    loadWeather();
  }, []);

  return (
    <section className="flex flex-col xl:flex-row gap-6 ">
      {/* Left Side */}
      <div className="w-full xl:w-2/3">
        <WeatherCard weather={weather} />
      </div>

      {/* Right Side */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6">
        <div className="bg-gradient-to-b from-green-900 via-emerald-800 to-emerald-500 rounded-2xl shadow-md p-4">
          <ActiveCrops />
        </div>

      </div>
    </section>
  );
}