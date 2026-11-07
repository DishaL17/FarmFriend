import { API_BASE_URL as ROOT_API } from "../config/api";
const API_BASE_URL = `${ROOT_API}/ai`;

/**
 * Fetch AI crop care suggestions for a specific crop, question, or symptoms
 */
export async function getCropCareAdvice({ cropId, question = "", symptoms = "" } = {}) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to view AI crop suggestions.");
  }

  const response = await fetch(`${API_BASE_URL}/crop-care`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ cropId, question, symptoms: question || symptoms }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to generate AI crop advice.");
  }

  return data;
}

/**
 * Fetch AI agricultural weather advisory connecting weather and crops
 */
export async function getWeatherCropAdvisory(weatherData) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to view weather advisory.");
  }

  const response = await fetch(`${API_BASE_URL}/weather-advisory`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ weather: weatherData }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to generate weather advisory.");
  }

  return data;
}

/**
 * Fetch AI expense recommendations
 */
export async function getExpenseRecommendations() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to view financial recommendations.");
  }

  const response = await fetch(`${API_BASE_URL}/expense-recommendations`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to generate expense recommendations.");
  }

  return data;
}

/**
 * Fetch market prices and cost-saving alternatives for pesticides and fertilizers
 */
export async function getPesticidePrices() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to view market prices.");
  }

  const response = await fetch(`${API_BASE_URL}/pesticide-prices`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch input prices.");
  }

  return data;
}

/**
 * Fetch financial summary overview
 */
export async function getExpenseSummary() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to view expense summary.");
  }

  const response = await fetch(`${API_BASE_URL}/expense-summary`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch expense summary.");
  }

  return data;
}
