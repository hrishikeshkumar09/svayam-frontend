// src/services/apiAuth.js

// Use the correct deployed URL
//const API_BASE_URL = "https://svayam-ams-api-a2g7e0cxgsacfxcy.southindia-01.azurewebsites.net";
const API_BASE_URL = "http://127.0.0.1:8000";

// Get auth header with token
export function getAuthHeader() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found in localStorage.");
    return {};
  }
  return { Authorization: `Bearer ${token}` };
}

export async function loginUser(email, password) {
  // The backend's OAuth2PasswordRequestForm expects
  // 'username' and 'password' as form data.
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);

  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }

  console.log("🔑 Generated Session ID/token:", data.access_token);

  // On successful login, store the token and user data
  localStorage.setItem("token", data.access_token);
  localStorage.setItem("user", JSON.stringify(data.user));
  
  return data;
}

export async function logoutUser() {
  const token = localStorage.getItem("token");
  
  if (token) {
    try {
      // Tell the server to delete the session from the database
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}` 
        }
      });
      console.log("Session deleted from server.");
    } catch (e) {
      console.error("Logout API call failed:", e);
      // We continue to clear local storage even if the API fails
    }
  }

  // Clear local artifacts
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getLoggedInUser() {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
}

export async function getAllUsers() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: getAuthHeader(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Error fetching users");
    }

    return data.users;
  } catch (err) {
    console.error("❌ Fetch users failed:", err);
    throw err;
  }
}

export async function createUser(userData) {
  const response = await fetch(`${API_BASE_URL}/admin/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Error creating user");
  return data;
}

export async function updateUser(email, userData) {
  const response = await fetch(`${API_BASE_URL}/admin/users/${email}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Error updating user");
  return data;
}

export async function deleteUser(email) {
  const response = await fetch(`${API_BASE_URL}/admin/users/${email}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  // Delete returns 200 with a message
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Error deleting user");
  return data;
}