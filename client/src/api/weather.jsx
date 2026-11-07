const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

// =============================
// Fetch Weather using Latitude & Longitude
// =============================
export async function fetchWeather(latitude, longitude, location, bypassCache = false) {
  const lat = latitude !== undefined && latitude !== null && !isNaN(latitude) ? latitude : 23.2599;
  const lon = longitude !== undefined && longitude !== null && !isNaN(longitude) ? longitude : 77.4126;

  let loc = "Your Location";
  if (location) {
    // Capitalize words nicely (e.g. suhana, sehore -> Suhana, Sehore)
    loc = location
      .split(", ")
      .map((word) => word.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "))
      .join(", ");
  }

  const cacheKey = `weather_${lat}_${lon}`;

  // Check cache unless bypass requested
  if (!bypassCache) {
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      try {
        const { timestamp, data } = JSON.parse(cached);

        // Cache valid for 10 minutes
        if (Date.now() - timestamp < 10 * 60 * 1000) {
          return {
            ...data,
            city: loc,
          };
        }
      } catch (err) {
        localStorage.removeItem(cacheKey);
      }
    }
  }

  const url =
    `${WEATHER_URL}` +
    `?latitude=${lat}` +
    `&longitude=${lon}` +
    `&current=` +
    `temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,is_day,wind_speed_10m,precipitation,surface_pressure` +
    `&hourly=` +
    `temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,precipitation_probability` +
    `&daily=` +
    `weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,uv_index_max,wind_speed_10m_max,et0_fao_evapotranspiration` +
    `&forecast_days=7` +
    `&timezone=auto`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to fetch weather");
  }

  const weather = await response.json();

  const weatherData = {
    city: loc,
    latitude: lat,
    longitude: lon,
    ...weather,
  };

  // Save in cache
  try {
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        timestamp: Date.now(),
        data: weatherData,
      })
    );
  } catch (e) {
    // ignore quota issues
  }

  return weatherData;
}
