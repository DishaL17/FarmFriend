import { useEffect, useState } from "react";
import { fetchWeather } from "../../api/weather";

import WeatherCard from "../weather/weathercard";
import ActiveCrops from "../crops/activecrop";

export default function Hero() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    async function loadWeather() {
      try {
        let user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (token) {
          // Attempt to fetch fresh profile details to guarantee we have coordinates and location names
          try {
            const res = await fetch("http://localhost:5000/api/auth/me", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const data = await res.json();
            if (data.success && data.user) {
              user = data.user;
              localStorage.setItem("user", JSON.stringify(user));
            }
          } catch (err) {
            console.warn("Failed to sync fresh user profile, using cached localStorage session:", err);
          }
        }

        if (!user) {
          console.error("No user session found");
          return;
        }

        const displayLocation =
          user.location && user.district
            ? `${user.location}, ${user.district}`
            : user.location || user.district || "";

        const data = await fetchWeather(
          user.latitude,
          user.longitude,
          displayLocation
        );

        setWeather(data);
      } catch (error) {
        console.error("Failed to load weather:", error);
      }
    }

    loadWeather();
  }, []);

  return (
    <section className="flex flex-col xl:flex-row gap-6 items-stretch">
      {/* Left Side */}
      <div className="w-full xl:w-2/3">
        <WeatherCard weather={weather} />
      </div>

      {/* Right Side */}
      <div className="w-full xl:w-1/3">
        <div className="bg-gradient-to-b from-lime-800 via-lime-700 to-lime-500 rounded-2xl shadow-md p-5 h-[510px]">
          <ActiveCrops />
        </div>
      </div>
    </section>
  );
}