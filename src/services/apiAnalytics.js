// src/services/apiAnalytics.js

// Helper to get the token from storage (handles potential naming mismatches)
const getToken = () => {
  return localStorage.getItem("access_token") || localStorage.getItem("token") || "";
};

export const getAnalytics = async () => {
  const token = getToken();
  
  // Use relative path if you have a proxy, otherwise absolute
  // We use the absolute URL to match your backend config
  const API_URL = "http://localhost:8000/api/admin/analytics";

  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` // Ensure Bearer scheme is used
    },
  });

  if (response.status === 401) {
    throw new Error("Unauthorized: Please log in again.");
  }

  if (!response.ok) {
    throw new Error(`Error fetching analytics: ${response.statusText}`);
  }

  return await response.json();
};