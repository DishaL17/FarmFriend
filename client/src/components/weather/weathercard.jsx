
import WeatherStat from "./weatherstat";
import HourlyForecast from "./HourlyForecast";

import weatherImage from "../../assets/images/weather.png";
import "./weather.css";

import RainAnimation from "./animations/RainAnimation";
import SunAnimation from "./animations/SunAnimation";
import CloudAnimation from "./animations/CloudAnimation";
import FogAnimation from "./animations/FogAnimation";
import SnowAnimation from "./animations/SnowAnimation";

export default function WeatherCard({ weather }) {
 
  if (!weather) {
    return (
      <div className="flex items-center justify-center min-h-[300px] sm:min-h-[420px] sm:w-full lg:min-h-[520px] rounded-2xl bg-white shadow-lg">
        <p className="text-lg font-semibold text-gray-600">
          Loading Weather...
        </p>
      </div>
    );
  }

 function getWeatherCondition(code) {
  if (code === 0) return "Clear";
  if ([1, 2, 3].includes(code)) return "Clouds";
  if ([45, 48].includes(code)) return "Mist";
  if (
    [51, 53, 55, 56, 57, 61, 63, 65, 80, 81, 82].includes(code)
  )
    return "Rain";
  if ([71, 73, 75, 77, 85, 86].includes(code))
    return "Snow";

  return "Clouds";
}
function getWeatherDescription(code) {
  const map = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Fog",
    51: "Light Drizzle",
    53: "Drizzle",
    55: "Heavy Drizzle",
    61: "Light Rain",
    63: "Rain",
    65: "Heavy Rain",
    71: "Light Snow",
    73: "Snow",
    75: "Heavy Snow",
    80: "Rain Showers",
    81: "Rain Showers",
    82: "Heavy Showers",
    95: "Thunderstorm",
  };

  return map[code] || "Unknown";
}

const condition = getWeatherCondition(weather.current.weather_code);

  return (
   <div
  className="
    relative
    w-full
    min-h-fit
    rounded-xl
    overflow-hidden
    bg-cover
    bg-center
    shadow-2xl
    border
    border-white/20
  "
  style={{
    backgroundImage: `url(${weatherImage})`,
  }}
>
   
      {condition === "Rain" && <RainAnimation />}
      {condition === "Drizzle" && <RainAnimation />}
      {condition === "Clear" && <SunAnimation />}
      {condition === "Clouds" && <CloudAnimation />}
      {condition === "Snow" && <SnowAnimation />}
      {condition === "Mist" && <FogAnimation />}

     
      <div className="absolute inset-0 bg-black/10"></div>

     
      <div className="relative z-10 p-4 ">
        <div className="flex justify-between gap-6 items-start">
         
          <div className="flex-1 min-w-0">
            <h3 className="text-lime-900 font-semibold text-sm uppercase tracking-wider">
              Today's Weather
            </h3>

            <h2 className="text-2xl   font-bold text-lime-900 mt-1">
              {weather.city}
            </h2>

            <p className="text-lime-900 text-xs  mt-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>

            <h1 className="text-4xl   font-bold text-lime-900 mt-6">
             {Math.round(weather.current.temperature_2m)}°C
            </h1>

            <p className="capitalize text-gray-700 text-lg mt-2">
             {getWeatherDescription(weather.current.weather_code)}
            </p>
          </div>

    
         <div className="flex flex-col gap-4 w-32 sm:w-40 md:w-48 flex-shrink-0">
            <WeatherStat
              icon="💧"
              label="Humidity"
              value={`${weather.current.relative_humidity_2m}%`}
            />

            <WeatherStat
              icon="💨"
              label="Wind"
              value={`${weather.current.wind_speed_10m} m/s`}
            />

            <WeatherStat
              icon="🌡"
              label="Feels Like"
              value={`${Math.round(weather.current.apparent_temperature)}°C`}
            />
          </div>
        </div>

       
       <div className="mt-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-white/10">
    <HourlyForecast forecast={weather.hourly}/>
</div>
      </div>
    </div>
  );
}