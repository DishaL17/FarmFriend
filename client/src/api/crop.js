export async function fetchCrops() {
  const response = await fetch("http://localhost:5000/crops");
  return response.json();
}

