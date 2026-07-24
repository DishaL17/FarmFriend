export async function getTransactions() {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:5000/api/transactions", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  return await response.json();
}