import {
  WiDaySunny,
  WiCloud,
  WiDayCloudy,
  WiFog,
  WiRain,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";

export default function HourlyForecast({ forecast }) {
  if (!forecast) return null;

  const getWeatherIcon = (code) => {
    if (code === 0)
      return <WiDaySunny className="text-5xl text-yellow-500 mx-auto" />;

    if ([1, 2].includes(code))
      return <WiDayCloudy className="text-5xl text-gray-500 mx-auto" />;

    if (code === 3)
      return <WiCloud className="text-5xl text-gray-600 mx-auto" />;

    if ([45, 48].includes(code))
      return <WiFog className="text-5xl text-gray-500 mx-auto" />;

    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code))
      return <WiRain className="text-5xl text-blue-500 mx-auto" />;

    if ([71, 73, 75, 77, 85, 86].includes(code))
      return <WiSnow className="text-5xl text-cyan-400 mx-auto" />;

    if (code >= 95)
      return (
        <WiThunderstorm className="text-5xl text-yellow-600 mx-auto" />
      );

    return <WiCloud className="text-5xl text-gray-500 mx-auto" />;
  };

 
  const now = new Date();
  now.setMinutes(0, 0, 0);


  let startIndex = forecast.time.findIndex(
    (time) => new Date(time) >= now
  );

 
  if (startIndex === -1) startIndex = 0;

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {forecast.time
        .slice(startIndex, startIndex + 8)
        .map((time, index) => {
          const actualIndex = startIndex + index;

          return (
            <div
              key={time}
              className="min-w-[100px] rounded-2xl bg-white/20 backdrop-blur-md p-4 text-center flex-shrink-0"
            >
              <p className="text-sm font-medium text-lime-900">
                {index === 0
                  ? "Now"
                  : new Date(time).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
              </p>

              {getWeatherIcon(
                forecast.weather_code[actualIndex]
              )}

              <p className="text-xl font-bold text-lime-900">
                {Math.round(
                  forecast.temperature_2m[actualIndex]
                )}
                °
              </p>
            </div>
          );
        })}
    </div>
  );
}