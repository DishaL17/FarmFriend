const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

// Convert city name to latitude & longitude
export async function getCoordinates(city) {
  const cacheKey = `geo_${city.toLowerCase()}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      // ignore parsing error and fetch fresh
    }
  }

  const res = await fetch(
    `${GEO_URL}?name=${city}&count=1&language=en&format=json`
  );

  const data = await res.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("City not found");
  }

  const coords = {
    latitude: data.results[0].latitude,
    longitude: data.results[0].longitude,
    name: data.results[0].name,
    country: data.results[0].country,
  };

  localStorage.setItem(cacheKey, JSON.stringify(coords));
  return coords;
}

// Get complete weather data
export async function fetchWeather(city) {
  const cacheKey = `weather_${city.toLowerCase()}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const { timestamp, data } = JSON.parse(cached);
      // Cache valid for 10 minutes
      if (Date.now() - timestamp < 10 * 60 * 1000) {
        return data;
      }
    } catch (e) {
      // ignore parsing error and fetch fresh
    }
  }

  const { latitude, longitude, name, country } =
    await getCoordinates(city);

  const url =
    `${WEATHER_URL}` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&current=` +
    `temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,is_day,wind_speed_10m` +
    `&hourly=` +
    `temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m` +
    `&daily=` +
    `weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset` +
    `&forecast_days=7` +
    `&timezone=auto`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Unable to fetch weather");
  }

  const weather = await res.json();
  const weatherData = {
    city: name,
    country,
    ...weather,
  };

  localStorage.setItem(
    cacheKey,
    JSON.stringify({
      timestamp: Date.now(),
      data: weatherData,
    })
  );

  return weatherData;
}