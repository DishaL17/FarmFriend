import {
  WiDaySunny,
  WiCloud,
  WiDayCloudy,
  WiFog,
  WiRain,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";

export default function WeeklyForecast({ daily }) {
  if (!daily) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-bold text-lime-900">
          Loading Forecast...
        </h2>
      </div>
    );
  }

  const getWeatherIcon = (code) => {
    if (code === 0)
      return <WiDaySunny className="text-5xl text-yellow-500" />;

    if ([1, 2].includes(code))
      return <WiDayCloudy className="text-5xl text-gray-500" />;

    if (code === 3)
      return <WiCloud className="text-5xl text-gray-600" />;

    if ([45, 48].includes(code))
      return <WiFog className="text-5xl text-gray-500" />;

    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code))
      return <WiRain className="text-5xl text-blue-500" />;

    if ([71, 73, 75, 77, 85, 86].includes(code))
      return <WiSnow className="text-5xl text-cyan-400" />;

    if (code >= 95)
      return <WiThunderstorm className="text-5xl text-yellow-600" />;

    return <WiCloud className="text-5xl text-gray-500" />;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-5 h-full">
      <h2 className="text-2xl font-bold text-lime-900 mb-5">
        7-Day Forecast
      </h2>

      <div className="space-y-3">
        {daily.time.slice(0, 7).map((day, index) => (
          <div
            key={day}
            className="flex items-center justify-between bg-lime-50 rounded-xl px-4 p2-3 hover:bg-lime-100 transition"
          >
            {/* Day */}
            <div className="w-20">
              <p className="font-semibold text-lime-900">
                {index === 0
                  ? "Today"
                  : new Date(day).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
              </p>
            </div>

            {/* Weather Icon */}
            <div>
              {getWeatherIcon(daily.weather_code[index])}
            </div>

            {/* Max / Min Temperature */}
            <div className="text-right">
              <p className="font-bold text-lime-900 text-lg">
                {Math.round(daily.temperature_2m_max[index])}°
              </p>

              <p className="text-gray-500">
                {Math.round(daily.temperature_2m_min[index])}°
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}