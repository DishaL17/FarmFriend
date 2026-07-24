const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";

async function fetchCoordsForName(name) {
  if (!name || name.trim() === "") return null;
  try {
    // Open-Meteo geocoding search works best with single city/district names (no commas)
    const cleanName = name.trim();
    const response = await fetch(
      `${GEO_URL}?name=${encodeURIComponent(cleanName)}&count=1&language=en&format=json`
    );
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return {
        latitude: data.results[0].latitude,
        longitude: data.results[0].longitude,
      };
    }
  } catch (err) {
    console.warn(`Geocoding fetch failed for "${name}":`, err.message);
  }
  return null;
}

export async function getCoordinates(village, district, state) {

  // 1. Village + district + state
  if (village && district && state) {
    const coords = await fetchCoordsForName(
      `${village}, ${district}, ${state}, India`
    );

    if (coords) return coords;
  }


  // 2. Village + district
  if (village && district) {
    const coords = await fetchCoordsForName(
      `${village}, ${district}`
    );

    if (coords) return coords;
  }


  // 3. District
  if (district) {
    const coords = await fetchCoordsForName(district);
    if (coords) return coords;
  }


  // 4. State
  if (state) {
    const coords = await fetchCoordsForName(state);
    if (coords) return coords;
  }


  throw new Error("Location not found");
}