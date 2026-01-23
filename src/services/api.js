// // src/services/api.js
// const API_BASE_URL = process.env.REACT_APP_LOCAL_API;

// /* -------------------------------------------------
//    REFRESH TOKEN
// ------------------------------------------------- */
// async function refreshAccessToken() {
//   const refreshToken = localStorage.getItem("refresh_token");
//   if (!refreshToken) return null;

//   try {
//     const res = await fetch(`${API_BASE_URL}/refresh`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ refresh_token: refreshToken }),
//     });

//     if (!res.ok) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("refresh_token");
//       return null;
//     }

//     const data = await res.json();
//     localStorage.setItem("token", data.access_token);
//     return data.access_token;
//   } catch (err) {
//     console.error("Refresh token error:", err);
//     return null;
//   }
// }

// /* -------------------------------------------------
//    AUTHORIZED FETCH
// ------------------------------------------------- */
// async function authorizedFetch(url, options = {}) {
//   let token = localStorage.getItem("token");

//   if (!token) {
//     throw new Error("No access token available");
//   }

//   options.headers = {
//     ...(options.headers || {}),
//     Authorization: `Bearer ${token}`,
//     "Content-Type": "application/json",
//   };

//    console.log("Sending request to:", url, "at", new Date().toISOString());

//   let response = await fetch(url, options);

//   if (response.status === 401) {
//     console.log("Token expired, attempting refresh...");
//     const newToken = await refreshAccessToken();
    
//     if (!newToken) {
//       throw new Error("Session expired. Please log in again.");
//     }

//     options.headers.Authorization = `Bearer ${newToken}`;
//     response = await fetch(url, options);
//   }

//   const contentType = response.headers.get("content-type");

//   if (contentType?.includes("application/json")) {
//     const data = await response.json();
//     if (!response.ok) {
//       throw new Error(data.detail || `Request failed: ${response.status}`);
//     }
//     return data;
//   }

//   if (!response.ok) {
//     throw new Error(`Request failed: ${response.status}`);
//   }

//   return null;
// }

// /* -------------------------------------------------
//    LOGIN
// ------------------------------------------------- */
// export async function loginUser(email, password) {
//   const res = await fetch(`${API_BASE_URL}/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   });

//   if (!res.ok) {
//     const error = await res.json().catch(() => ({}));
//     throw new Error(error.detail || "Invalid credentials");
//   }

//   const data = await res.json();
  
//   localStorage.setItem("token", data.access_token);
//   localStorage.setItem("refresh_token", data.refresh_token);

//   return data;
// }

// /* -------------------------------------------------
//    ADMIN APIs
// ------------------------------------------------- */
// export async function getAllUsers() {
//   const data = await authorizedFetch(`${API_BASE_URL}/admin/users`);
//   return data.users || [];
// }

// export async function createUser(userData) {
//   return authorizedFetch(`${API_BASE_URL}/admin/create`, {
//     method: "POST",
//     body: JSON.stringify(userData),
//   });
// }

// export async function updateUser(email, userData) {
//   return authorizedFetch(`${API_BASE_URL}/admin/users/${email}`, {
//     method: "PUT",
//     body: JSON.stringify(userData),
//   });
// }

// export async function deleteUser(email) {
//   return authorizedFetch(`${API_BASE_URL}/admin/users/${email}`, {
//     method: "DELETE",
//   });
// }
// export async function getUserProjects(email) {
//   // Pass email if your backend filters by user, otherwise it might return all public projects
//   return authorizedFetch(`${API_BASE_URL}/projects?email=${encodeURIComponent(email)}`);
// }
// export async function getProjectConversations(projectId) {
//   return authorizedFetch(`${API_BASE_URL}/projects/${projectId}/conversations`, {
//     method: "GET",
//   });
// }

// /* -------------------------------------------------
//    CHAT APIs - Updated for Project Filtering
// ------------------------------------------------- */

// /**
//  * Get user conversations, optionally filtered by project
//  * Backend returns from SQL database
//  */
// export async function getUserConversations(projectId = null) {
//   let url = `${API_BASE_URL}/conversations`;
  
//   if (projectId) {
//     url += `?project_id=${encodeURIComponent(projectId)}`;
//   }

//   return authorizedFetch(url);
// }

// /**
//  * Start a new conversation thread for a specific project
//  */
// export async function startConversation(projectId) {
//   if (!projectId) throw new Error("Invalid project ID");

//   return authorizedFetch(`${API_BASE_URL}/conversations/start`, {
//     method: "POST",
//     body: JSON.stringify({ project_id: projectId }),
//   });
// }



// /**
//  * Get specific conversation details
//  * Backend returns metadata from SQL + message count from Cosmos
//  */
// export async function getConversation(conversation_uuid) {
//   return authorizedFetch(
//     `${API_BASE_URL}/conversations/${conversation_uuid}`
//   );
// }

// /**
//  * Get all messages in a conversation
//  * Backend loads from Cosmos DB (LangGraph memory)
//  * Returns: [{ role: "user"|"assistant", content: "...", timestamp: "..." }]
//  */
// export async function getMessages(conversation_uuid) {
//   return authorizedFetch(
//     `${API_BASE_URL}/conversations/${conversation_uuid}/messages`
//   );
// }

// /**
//  * Send a message and get AI response
//  * Backend:
//  * 1. Saves user message to Cosmos
//  * 2. Calls LangGraph with full conversation context
//  * 3. Streams AI response
//  * 4. Saves AI response to Cosmos
//  * 5. Returns AI message
//  * 
//  * Returns: { role: "assistant", content: "...", timestamp: "..." }
//  */
// export async function sendMessage(conversation_uuid, text) {
//   return authorizedFetch(
//     `${API_BASE_URL}/conversations/${conversation_uuid}/messages`,
//     {
//       method: "POST",
//       body: JSON.stringify({ text, sender: "user" }),
//     }
//   );
// }

// /* -------------------------------------------------
//    LOGOUT
// ------------------------------------------------- */
// export async function logoutUserApi() {
//   try {
//     const token = localStorage.getItem("token");
//     if (token) {
//       await fetch(`${API_BASE_URL}/logout`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//     }
//   } catch (err) {
//     console.error("Logout API error:", err);
//   } finally {
//     localStorage.removeItem("token");
//     localStorage.removeItem("refresh_token");
//   }
// }

// /* -------------------------------------------------
//    KNOWLEDGE BASE (KB) APIs
// ------------------------------------------------- */

// // Backend: /api/kb
// const KB_BASE_URL = `${process.env.REACT_APP_AZURE_KB_API}/api/kb`;

// /* ---- 1. Get Knowledge Base Tree ---- */
// export async function getKnowledgeBaseTree() {
//   return authorizedFetch(`${KB_BASE_URL}/`);
// }

// /* ---- 2. Get file download URL ---- */
// export async function getDownloadUrl(blobName) {
//   const url = `${KB_BASE_URL}/download-url?blob_name=${encodeURIComponent(blobName)}`;
//   return authorizedFetch(url);
// }

// /* ---- 3. Rename file/folder ---- */
// export async function renameKbItem(payload) {
//   return authorizedFetch(`${KB_BASE_URL}/rename`, {
//     method: "PUT",
//     body: JSON.stringify(payload),
//   });
// }

// /* ---- 4. Delete file/folder ---- */
// export async function deleteKbItem(payload) {
//   return authorizedFetch(`${KB_BASE_URL}/delete`, {
//     method: "DELETE",
//     body: JSON.stringify(payload),
//   });
// }

// /* ---- 5. Upload Files ---- */
// export function uploadKbFiles(formData, onProgress) {
//   return new Promise((resolve, reject) => {
//     const token = localStorage.getItem("token");
//     const xhr = new XMLHttpRequest();

//     xhr.open("POST", `${KB_BASE_URL}/upload-files`);
//     xhr.setRequestHeader("Authorization", `Bearer ${token}`);

//     xhr.upload.onprogress = (event) => {
//       if (event.lengthComputable && onProgress) {
//         const percent = Math.round((event.loaded / event.total) * 100);
//         onProgress(percent);
//       }
//     };

//     xhr.onload = () => {
//       try {
//         const res = JSON.parse(xhr.responseText);
//         if (xhr.status >= 200 && xhr.status < 300) {
//           resolve(res);
//         } else {
//           reject(new Error(res.detail || "Upload failed"));
//         }
//       } catch {
//         reject(new Error("Upload error"));
//       }
//     };

//     xhr.onerror = () => reject(new Error("Network upload error"));
//     xhr.send(formData);
//   });
// }

// /* ---- 6. Trigger Search Index Refresh ---- */
// export async function triggerKbIndexer() {
//   return authorizedFetch(`${process.env.REACT_APP_AZURE_KB_API}/search/run-indexer`, {
//     method: "POST",
//   });
// }

// /* -------------------------------------------------
//    DIRECT CHAT (optional - no conversation tracking)
// ------------------------------------------------- */
// export async function directChat(message) {
//   return authorizedFetch(`${API_BASE_URL}/chat`, {
//     method: "POST",
//     body: JSON.stringify({ message }),
//   });
// }

// //Feedback apis
// //Submit feedback for a conversation
// export async function submitFeedback(conversation_uuid, feedbackData) {
//   return authorizedFetch(
//     `${API_BASE_URL}/conversations/${conversation_uuid}/feedback`,
//     {
//       method: "POST",
//       body: JSON.stringify(feedbackData),
//     }
//   );
// }

// //feedback exist for user
// export async function checkFeedback(conversation_uuid) {
//   return authorizedFetch(
//     `${API_BASE_URL}/conversations/${conversation_uuid}/feedback`
//   );
// }

// //admin only
// export async function getFeedbackStats() {
//   return authorizedFetch(`${API_BASE_URL}/admin/feedback/stats`);
// }


// export async function listAllFeedback(limit = 50, offset = 0) {
//   return authorizedFetch(
//     `${API_BASE_URL}/admin/feedback/list?limit=${limit}&offset=${offset}`
//   );
// }
// /* -------------------------------------------------
//    FILE UPLOAD APIs (Option B)
// ------------------------------------------------- */

// // Upload image
// export async function uploadImage(conversationUuid, file) {
//   const formData = new FormData();
//   formData.append("file", file);

//   const token = localStorage.getItem("token");

//   const response = await fetch(
//     `${API_BASE_URL}/conversations/${conversationUuid}/upload-image`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: formData,
//     }
//   );

//   if (!response.ok) {
//     const err = await response.text();
//     throw new Error(err || "Image upload failed");
//   }

//   return await response.json();
// }

// // Upload document
// export async function uploadDocument(conversationUuid, file) {
//   const formData = new FormData();
//   formData.append("file", file);

//   const token = localStorage.getItem("token");

//   const response = await fetch(
//     `${API_BASE_URL}/conversations/${conversationUuid}/upload-document`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: formData,
//     }
//   );

//   if (!response.ok) {
//     const err = await response.text();
//     throw new Error(err || "Document upload failed");
//   }

//   return await response.json();
// }

// // Send message + files
// export async function sendMessageWithFiles(conversationUuid, text, files = []) {
//   const formData = new FormData();
//   formData.append("content", text);

//   files.forEach((f) => formData.append("files", f));

//   const token = localStorage.getItem("token");

//   const response = await fetch(
//     `${API_BASE_URL}/conversations/${conversationUuid}/messages-with-files`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: formData,
//     }
//   );

//   if (!response.ok) {
//     const err = await response.text();
//     throw new Error(err || "Failed to send message with files");
//   }

//   return await response.json();
// }
// export async function deleteConversation(uuid) {
//   return authorizedFetch(`${API_BASE_URL}/conversations/${uuid}`, {
//     method: "DELETE",
//   });
// }

//src/services/api.js

  const API_BASE_URL = process.env.REACT_APP_LOCAL_API || "http://127.0.0.1:8000";

  /* -------------------------------------------------
    REFRESH TOKEN
  ------------------------------------------------- */
  async function refreshAccessToken() {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) return null;

    try {
      const res = await fetch(`${API_BASE_URL}/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!res.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        return null;
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      return data.access_token;
    } catch (err) {
      console.error("Refresh token error:", err);
      return null;
    }
  }

  /* -------------------------------------------------
    AUTHORIZED FETCH
  ------------------------------------------------- */
  async function authorizedFetch(url, options = {}) {
    let token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No access token available");
    }

    options.headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    console.log("Sending request to:", url); // Debug Log

    let response = await fetch(url, options);

    if (response.status === 401) {
      console.log("Token expired, attempting refresh...");
      const newToken = await refreshAccessToken();
      
      if (!newToken) {
        throw new Error("Session expired. Please log in again.");
      }

      options.headers.Authorization = `Bearer ${newToken}`;
      response = await fetch(url, options);
    }

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || `Request failed: ${response.status}`);
      }
      return data;
    }

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return null;
  }

  /* -------------------------------------------------
    LOGIN / AUTH
  ------------------------------------------------- */
  export async function loginUser(email, password) {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.detail || "Invalid credentials");
    }

    const data = await res.json();
    
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);

    return data;
  }

  export async function logoutUserApi() {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch(`${API_BASE_URL}/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
    }
  }

  /* -------------------------------------------------
    PROJECTS
  ------------------------------------------------- */
  export async function getUserProjects(email) {
    return authorizedFetch(`${API_BASE_URL}/projects?email=${encodeURIComponent(email)}`);
  }

  export async function getProjectConversations(projectId) {
    return authorizedFetch(`${API_BASE_URL}/projects/${projectId}/conversations`);
  }

  /* -------------------------------------------------
    CHATS & CONVERSATIONS
  ------------------------------------------------- */

  /**
   * Get user conversations with Optional Project Filtering
   * ✅ FIXED: Now correctly appends ?project_id=... to the URL
   */
  export async function getUserConversations(projectId = null) {
    let url = `${API_BASE_URL}/conversations`;
    if (projectId) {
      url += `?project_id=${encodeURIComponent(projectId)}`;
    }
    return authorizedFetch(url);
  }

  export async function startConversation(projectId) {
    if (!projectId) throw new Error("Invalid project ID");

    return authorizedFetch(`${API_BASE_URL}/conversations/start`, {
      method: "POST",
      body: JSON.stringify({ project_id: projectId }),
    });
  }

  export async function getConversation(conversation_uuid) {
    return authorizedFetch(
      `${API_BASE_URL}/conversations/${conversation_uuid}`
    );
  }

  export async function getMessages(conversation_uuid) {
    return authorizedFetch(
      `${API_BASE_URL}/conversations/${conversation_uuid}/messages`
    );
  }

  export async function sendMessage(conversation_uuid, text) {
    return authorizedFetch(
      `${API_BASE_URL}/conversations/${conversation_uuid}/messages`,
      {
        method: "POST",
        body: JSON.stringify({ text, sender: "user" }),
      }
    );
  }

  export async function deleteConversation(uuid) {
    return authorizedFetch(`${API_BASE_URL}/conversations/${uuid}`, {
      method: "DELETE",
    });
  }

  /* -------------------------------------------------
    FEEDBACK
  ------------------------------------------------- */
  export async function submitFeedback(conversation_uuid, feedbackData) {
    return authorizedFetch(
      `${API_BASE_URL}/conversations/${conversation_uuid}/feedback`,
      {
        method: "POST",
        body: JSON.stringify(feedbackData),
      }
    );
  }

  export async function checkFeedback(conversation_uuid) {
    return authorizedFetch(
      `${API_BASE_URL}/conversations/${conversation_uuid}/feedback`
    );
  }

  /* -------------------------------------------------
    ADMIN APIs
  ------------------------------------------------- */
  // export async function getAllUsers() {
  //   const data = await authorizedFetch(`${API_BASE_URL}/admin/users`);
  //   return data.users || [];
  // }
export async function getAllUsers() {
  const data = await authorizedFetch(`${API_BASE_URL}/admin/users`);
  // If backend returns {"users": [...] } or returns an array directly
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.users)) return data.users;
  return [];
}


  export async function createUser(userData) {
    return authorizedFetch(`${API_BASE_URL}/admin/create`, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  export async function updateUser(email, userData) {
    return authorizedFetch(`${API_BASE_URL}/admin/users/${email}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  export async function deleteUser(email) {
    return authorizedFetch(`${API_BASE_URL}/admin/users/${email}`, {
      method: "DELETE",
    });
  }

  export async function getFeedbackStats() {
    return authorizedFetch(`${API_BASE_URL}/admin/feedback/stats`);
  }

  export async function listAllFeedback(limit = 50, offset = 0) {
    return authorizedFetch(
      `${API_BASE_URL}/admin/feedback/list?limit=${limit}&offset=${offset}`
    );
  }

  /* -------------------------------------------------
    KNOWLEDGE BASE (KB)
  ------------------------------------------------- */
  const KB_BASE_URL = `${process.env.REACT_APP_AZURE_KB_API || 'http://localhost:8000'}/api/kb`;

  export async function getKnowledgeBaseTree() {
    return authorizedFetch(`${KB_BASE_URL}/`);
  }

  export async function getDownloadUrl(blobName) {
    const url = `${KB_BASE_URL}/download-url?blob_name=${encodeURIComponent(blobName)}`;
    return authorizedFetch(url);
  }

  export async function renameKbItem(payload) {
    return authorizedFetch(`${KB_BASE_URL}/rename`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  export async function deleteKbItem(payload) {
    return authorizedFetch(`${KB_BASE_URL}/delete`, {
      method: "DELETE",
      body: JSON.stringify(payload),
    });
  }

  export function uploadKbFiles(formData, onProgress) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem("token");
      const xhr = new XMLHttpRequest();

      xhr.open("POST", `${KB_BASE_URL}/upload-files`);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        try {
          const res = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(res);
          } else {
            reject(new Error(res.detail || "Upload failed"));
          }
        } catch {
          reject(new Error("Upload error"));
        }
      };

      xhr.onerror = () => reject(new Error("Network upload error"));
      xhr.send(formData);
    });
  }

  export async function triggerKbIndexer() {
    // Assuming indexer endpoint is on same backend or separate
    return authorizedFetch(`${process.env.REACT_APP_AZURE_KB_API || 'http://localhost:8000'}/search/run-indexer`, {
      method: "POST",
    });
  }

  /* -------------------------------------------------
    FILE UPLOADS
  ------------------------------------------------- */
  export async function sendMessageWithFiles(conversationUuid, text, files = []) {
    const formData = new FormData();
    formData.append("content", text);
    files.forEach((f) => formData.append("files", f));

    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_BASE_URL}/conversations/${conversationUuid}/messages-with-files`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || "Failed to send message with files");
    }
    return await response.json();
  }
export async function getAdminRecentConversations() {
  const res = await authorizedFetch(`${API_BASE_URL}/api/conversations`);
  return res || [];
}

export async function getUserRecentConversations() {
  const res = await authorizedFetch(`${API_BASE_URL}/api/conversations/my`);
  return res || [];
}

export async function getAdminConversations() {
    return authorizedFetch(`${API_BASE_URL}/admin/all-conversations`);
}
