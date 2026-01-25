// src/services/apiConversations.js
import { getAuthHeader } from './authService';

// Use your deployed API URL
//const API_BASE_URL = "https://svayam-ams-api-a2g7e0cxgsacfxcy.southindia-01.azurewebsites.net";
const API_BASE_URL = "https://svayam-argkayfnckeccqd6.southindia-01.azurewebsites.net"; 

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401) {
      window.dispatchEvent(new CustomEvent('auth-error', { detail: "Session expired." }));
    }
    throw new Error(data.detail || "Error fetching conversations");
  }
  return data;
};

// Fetch ALL (For Admin)
export const getAllConversations = async () => {
  const response = await fetch(`${API_BASE_URL}/api/conversations/`, {
    headers: getAuthHeader()
  });
  return handleResponse(response);
};

// Fetch MY (For User)
export const getMyConversations = async () => {
  const response = await fetch(`${API_BASE_URL}/api/conversations/my`, {
    headers: getAuthHeader()
  });
  return handleResponse(response);
};