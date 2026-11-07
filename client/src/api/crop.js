import { API_BASE_URL } from "../config/api";

export async function getCrops() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/crops`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  return await response.json();
}

export async function markCropAsHarvested(cropId, status = "Harvested") {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/crops/${cropId}/harvest`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP Error: ${response.status}`);
  }

  return await response.json();
}
