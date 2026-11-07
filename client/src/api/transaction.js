import { API_BASE_URL } from "../config/api";

export async function getTransactions() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/transactions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  return await response.json();
}
