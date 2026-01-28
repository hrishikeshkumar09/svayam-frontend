//src/services/api.js

//   const API_BASE_URL = 'https://svayam-argkayfnckeccqd6.southindia-01.azurewebsites.net'
//   const KB_BASE_URL = 'https://svayam-argkayfnckeccqd6.southindia-01.azurewebsites.net/api/kb'
  
//   /**
//    * Gets the current logged-in user from local storage
//    */
//   export function getLoggedInUser() {
//     try {
//       const user = localStorage.getItem("user");
//       return user ? JSON.parse(user) : null;
//     } catch (e) {
//       return null;
//     }
//   }

//   /**
//    * Generates the Authorization header object
//    * Useful for components that bypass authorizedFetch
//    */
//   export function getAuthHeader() {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       console.warn("No token found in localStorage.");
//       return {};
//     }
//     return { Authorization: `Bearer ${token}` };
//   }

//   /* -------------------------------------------------
//     REFRESH TOKEN
//   ------------------------------------------------- */
//   async function refreshAccessToken() {
//     const refreshToken = localStorage.getItem("refresh_token");
//     if (!refreshToken) return null;

//     try {
//       const res = await fetch(`${API_BASE_URL}/refresh`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ refresh_token: refreshToken }),
//       });

//       if (!res.ok) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("refresh_token");
//         localStorage.removeItem("user");
//         return null;
//       }

//       const data = await res.json();
//       localStorage.setItem("token", data.access_token);
//       return data.access_token;
//     } catch (err) {
//       console.error("Refresh token error:", err);
//       return null;
//     }
//   }

//   /* -------------------------------------------------
//     AUTHORIZED FETCH
//   ------------------------------------------------- */
//   async function authorizedFetch(url, options = {}) {
//     let token = localStorage.getItem("token");

//     if (!token) {
//       throw new Error("No access token available");
//     }

//     options.headers = {
//       ...(options.headers || {}),
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     };

//     console.log("Sending request to:", url); // Debug Log
//     console.log(`📡 [API] ${options.method || 'GET'} ${url}`);

//     let response = await fetch(url, options);

//     // Handle Token Expiry (401)
//     if (response.status === 401) {
//       console.log("Token expired, attempting refresh...");
//       const newToken = await refreshAccessToken();
      
//       if (!newToken) {
//         window.dispatchEvent(new CustomEvent('auth-error', { detail: "Session expired." }));
//         throw new Error("Session expired. Please log in again.");
//       }

//       options.headers.Authorization = `Bearer ${newToken}`;
//       response = await fetch(url, options);
//     }

//     // Handle Response Parsing
//     const contentType = response.headers.get("content-type");

//     if (contentType?.includes("application/json")) {
//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.detail || `Request failed: ${response.status}`);
//       }
//       return data;
//     }

//     if (!response.ok) {
//       throw new Error(`Request failed: ${response.status}`);
//     }

//     return null;
//   }

//   /* -------------------------------------------------
//     LOGIN / AUTH
//   ------------------------------------------------- */
//   export async function loginUser(email, password) {
//     const res = await fetch(`${API_BASE_URL}/login`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     if (!res.ok) {
//       const error = await res.json().catch(() => ({}));
//       throw new Error(error.detail || "Invalid credentials");
//     }

//     const data = await res.json();

//     console.log("🔑 Login successful. Token generated.");
    
//     localStorage.setItem("token", data.access_token);
//     localStorage.setItem("refresh_token", data.refresh_token);

//     // Store user info if backend sends it, otherwise basic info
//     if (data.user) {
//       localStorage.setItem("user", JSON.stringify(data.user));
//     }

//     return data;
//   }

//   export async function logoutUserApi() {
//     try {
//       const token = localStorage.getItem("token");
//       if (token) {
//         await fetch(`${API_BASE_URL}/logout`, {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//       }
//     } catch (err) {
//       console.error("Logout API error:", err);
//     } finally {
//       localStorage.removeItem("token");
//       localStorage.removeItem("refresh_token");
//       localStorage.removeItem("user");
//     }
//   }

//   // Alias for compatibility if other components call 'logoutUser' instead of 'logoutUserApi'
//   export const logoutUser = logoutUserApi;

//   /* -------------------------------------------------
//     PROJECTS
//   ------------------------------------------------- */
//   export async function getUserProjects(email) {
//     return authorizedFetch(`${API_BASE_URL}/projects?email=${encodeURIComponent(email)}`);
//   }

//   export async function getProjectConversations(projectId) {
//     return authorizedFetch(`${API_BASE_URL}/projects/${projectId}/conversations`);
//   }

//   /* -------------------------------------------------
//     CHATS & CONVERSATIONS
//   ------------------------------------------------- */

//   /**
//    * Get user conversations with Optional Project Filtering
//    * ✅ FIXED: Now correctly appends ?project_id=... to the URL
//    */
//   export async function getUserConversations(projectId = null) {
//     let url = `${API_BASE_URL}/conversations`;
//     if (projectId) {
//       url += `?project_id=${encodeURIComponent(projectId)}`;
//     }
//     return authorizedFetch(url);
//   }

//   export async function startConversation(projectId) {
//     if (!projectId) throw new Error("Invalid project ID");

//     return authorizedFetch(`${API_BASE_URL}/conversations/start`, {
//       method: "POST",
//       body: JSON.stringify({ project_id: projectId }),
//     });
//   }

//   export async function getConversation(conversation_uuid) {
//     return authorizedFetch(
//       `${API_BASE_URL}/conversations/${conversation_uuid}`
//     );
//   }

//   export async function getMessages(conversation_uuid) {
//     return authorizedFetch(
//       `${API_BASE_URL}/conversations/${conversation_uuid}/messages`
//     );
//   }

//   export async function sendMessage(conversation_uuid, text) {
//     return authorizedFetch(
//       `${API_BASE_URL}/conversations/${conversation_uuid}/messages`,
//       {
//         method: "POST",
//         body: JSON.stringify({ text, sender: "user" }),
//       }
//     );
//   }

//   export async function deleteConversation(uuid) {
//     return authorizedFetch(`${API_BASE_URL}/conversations/${uuid}`, {
//       method: "DELETE",
//     });
//   }

//   /* -------------------------------------------------
//     FEEDBACK
//   ------------------------------------------------- */
//   export async function submitFeedback(conversation_uuid, feedbackData) {
//     return authorizedFetch(
//       `${API_BASE_URL}/conversations/${conversation_uuid}/feedback`,
//       {
//         method: "POST",
//         body: JSON.stringify(feedbackData),
//       }
//     );
//   }

//   export async function checkFeedback(conversation_uuid) {
//     return authorizedFetch(
//       `${API_BASE_URL}/conversations/${conversation_uuid}/feedback`
//     );
//   }

//   export async function getFeedbackStats() {
//     return authorizedFetch(`${API_BASE_URL}/admin/feedback/stats`);
//   }

//   export async function listAllFeedback(limit = 50, offset = 0) {
//     return authorizedFetch(`${API_BASE_URL}/admin/feedback/list?limit=${limit}&offset=${offset}`);
//   }

//   /* -------------------------------------------------
//     ADMIN APIs
//   ------------------------------------------------- */
//   // export async function getAllUsers() {
//   //   const data = await authorizedFetch(`${API_BASE_URL}/admin/users`);
//   //   return data.users || [];
//   // }
// export async function getAllUsers() {
//   const data = await authorizedFetch(`${API_BASE_URL}/admin/users`);
//   // If backend returns {"users": [...] } or returns an array directly
//   if (Array.isArray(data)) return data;
//   if (data && Array.isArray(data.users)) return data.users;
//   return [];
// }


//   export async function createUser(userData) {
//     return authorizedFetch(`${API_BASE_URL}/admin/create`, {
//       method: "POST",
//       body: JSON.stringify(userData),
//     });
//   }

//   export async function updateUser(email, userData) {
//     return authorizedFetch(`${API_BASE_URL}/admin/users/${email}`, {
//       method: "PUT",
//       body: JSON.stringify(userData),
//     });
//   }

//   export async function deleteUser(email) {
//     return authorizedFetch(`${API_BASE_URL}/admin/users/${email}`, {
//       method: "DELETE",
//     });
//   }

//   // export async function getFeedbackStats() {
//   //   return authorizedFetch(`${API_BASE_URL}/admin/feedback/stats`);
//   // }

//   // export async function listAllFeedback(limit = 50, offset = 0) {
//   //   return authorizedFetch(
//   //     `${API_BASE_URL}/admin/feedback/list?limit=${limit}&offset=${offset}`
//   //   );
//   // }

//   /* -------------------------------------------------
//     KNOWLEDGE BASE (KB)
//   ------------------------------------------------- */
//   // const KB_BASE_URL = `${process.env.REACT_APP_AZURE_KB_API || 'http://localhost:8000'}/api/kb`;

//   export async function getKnowledgeBaseTree() {
//     return authorizedFetch(`${KB_BASE_URL}/`);
//   }

//   // export async function getDownloadUrl(blobName) {
//   //   const url = `${KB_BASE_URL}/download-url?blob_name=${encodeURIComponent(blobName)}`;
//   //   return authorizedFetch(url);
//   // }

//   export async function getDownloadUrl(blobName, projectName = null) {
//     let url = `${KB_BASE_URL}/download-url?blob_name=${encodeURIComponent(blobName)}`;
//     if (projectName) {
//       url += `&project=${encodeURIComponent(projectName)}`;
//     }
//     return authorizedFetch(url);
//   }

//   export async function renameKbItem(payload) {
//     return authorizedFetch(`${KB_BASE_URL}/rename`, {
//       method: "PUT",
//       body: JSON.stringify(payload),
//     });
//   }

//   export async function deleteKbItem(payload) {
//     return authorizedFetch(`${KB_BASE_URL}/delete`, {
//       method: "DELETE",
//       body: JSON.stringify(payload),
//     });
//   }

//   export async function createProject(projectName) {
//     return authorizedFetch(`${KB_BASE_URL}/create-project`, {
//       method: 'POST',
//       body: JSON.stringify({ project_name: projectName }),
//     });
//   }

//   export async function fetchContainers() {
//     return authorizedFetch(`${KB_BASE_URL}/containers`);
//   }

//   export async function triggerKbIndexer() {
//     return authorizedFetch(`${KB_BASE_URL || 'http://localhost:8000'}/search/run-indexer`, {
//       method: "POST",
//     });
//   }

//   export function uploadKbFiles(formData, onProgress) {
//     return new Promise((resolve, reject) => {
//       const token = localStorage.getItem("token");
//       const xhr = new XMLHttpRequest();

//       xhr.open("POST", `${KB_BASE_URL}/upload-files`);
//       xhr.setRequestHeader("Authorization", `Bearer ${token}`);

//       xhr.upload.onprogress = (event) => {
//         if (event.lengthComputable && onProgress) {
//           const percent = Math.round((event.loaded / event.total) * 100);
//           onProgress(percent);
//         }
//       };

//       xhr.onload = () => {
//         try {
//           const res = JSON.parse(xhr.responseText);
//           if (xhr.status >= 200 && xhr.status < 300) {
//             resolve(res);
//           } else {
//             reject(new Error(res.detail || "Upload failed"));
//           }
//         } catch {
//           reject(new Error("Upload error"));
//         }
//       };

//       xhr.onerror = () => reject(new Error("Network upload error"));
//       xhr.send(formData);
//     });
//   }

//   // export async function triggerKbIndexer() {
//   //   // Assuming indexer endpoint is on same backend or separate
//   //   return authorizedFetch(`${process.env.REACT_APP_AZURE_KB_API || 'http://localhost:8000'}/search/run-indexer`, {
//   //     method: "POST",
//   //   });
//   // }

//   /* -------------------------------------------------
//     FILE UPLOADS
//   ------------------------------------------------- */
//   export async function sendMessageWithFiles(conversationUuid, text, files = []) {
//     const formData = new FormData();
//     formData.append("content", text);
//     files.forEach((f) => formData.append("files", f));

//     const token = localStorage.getItem("token");
//     const response = await fetch(
//       `${API_BASE_URL}/conversations/${conversationUuid}/messages-with-files`,
//       {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       }
//     );

//     if (!response.ok) {
//       const err = await response.text();
//       throw new Error(err || "Failed to send message with files");
//     }
//     return await response.json();
//   }
// export async function getAdminRecentConversations() {
//   const res = await authorizedFetch(`${API_BASE_URL}/api/conversations`);
//   return res || [];
// }

// export async function getUserRecentConversations() {
//   const res = await authorizedFetch(`${API_BASE_URL}/api/conversations/my`);
//   return res || [];
// }

// export async function getAdminConversations() {
//     return authorizedFetch(`${API_BASE_URL}/admin/all-conversations`);
// }


const API_BASE_URL = 'https://svayam-argkayfnckeccqd6.southindia-01.azurewebsites.net';

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

    // if (!token) {
    //   throw new Error("No access token available");
    // }
    if (!token) {
      token = await refreshAccessToken();
      if (!token) {
        throw new Error("Session expired. Please log in again.");
      }
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
  const KB_BASE_URL = 'https://svayam-argkayfnckeccqd6.southindia-01.azurewebsites.net/api/kb';

  // export async function getKnowledgeBaseTree() {
  //   return authorizedFetch(`${KB_BASE_URL}/`);
  // }

  // export async function getDownloadUrl(blobName) {
  //   const url = `${KB_BASE_URL}/download-url?blob_name=${encodeURIComponent(blobName)}`;
  //   return authorizedFetch(url);
  // }

  // export async function renameKbItem(payload) {
  //   return authorizedFetch(`${KB_BASE_URL}/rename`, {
  //     method: "PUT",
  //     body: JSON.stringify(payload),
  //   });
  // }

  // export async function deleteKbItem(payload) {
  //   return authorizedFetch(`${KB_BASE_URL}/delete`, {
  //     method: "DELETE",
  //     body: JSON.stringify(payload),
  //   });
  // }

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

  // export async function createProject(projectName) {
  //    return authorizedFetch(`${KB_BASE_URL}/create-project`, {
  //      method: 'POST',
  //      body: JSON.stringify({ project_name: projectName }),
  //    });
  // }

  // // ✅ ADD THIS FUNCTION HERE
  // // This uses authorizedFetch so it handles the token automatically
  // export async function fetchContainers() {
  //   return authorizedFetch(`${KB_BASE_URL}/containers`);
  // }

  // export async function triggerKbIndexer() {
  //   // Assuming indexer endpoint is on same backend or separate
  //   return authorizedFetch(`${process.env.REACT_APP_AZURE_KB_API || 'http://localhost:8000'}/search/run-indexer`, {
  //     method: "POST",
  //   });
  // }

  export async function getKnowledgeBaseTree(projectName) {
    //return authorizedFetch(`${KB_BASE_URL}/`);

    //return authorizedFetch(`${KB_BASE_URL}/?t=${new Date().getTime()}`);
    const params = new URLSearchParams();

    // 2. Add the project name if it exists (CRITICAL FIX)
    if (projectName) {
      params.append("project", projectName);
    }

    // 3. Add the timestamp to bust the browser cache
    params.append("t", new Date().getTime());

    // 4. Send the request with the query string
    // Result looks like: /api/kb/?project=MyProject&t=1738592000123
    return authorizedFetch(`${KB_BASE_URL}/?${params.toString()}`);
  }

  export async function getDownloadUrl(blobName) {
    const url = `${KB_BASE_URL}/download-url?blob_name=${encodeURIComponent(blobName)}`;
    return authorizedFetch(url);
  }

  // export async function renameKbItem(payload) {
  //   return authorizedFetch(`${KB_BASE_URL}/rename`, {
  //     method: "PUT",
  //     body: JSON.stringify(payload),
  //   });
  // }
  // ✅ FIX: Accept 4 arguments to match what the UI sends
  export async function renameKbItem(old_path, new_name, type, project_name) {
    return authorizedFetch(`${KB_BASE_URL}/rename`, {
      method: "PUT",
      // Construct the correct JSON object for the Backend
      body: JSON.stringify({
        old_path: old_path,
        new_name: new_name,
        type: type,
        project_name: project_name
      }),
    });
  }

  // export async function deleteKbItem(payload) {
  //   return authorizedFetch(`${KB_BASE_URL}/delete`, {
  //     method: "DELETE",
  //     body: JSON.stringify(payload),
  //   });
  // }

  // ✅ FIX: Accept 3 arguments to match what the UI sends
  export async function deleteKbItem(path, type, project_name) {
    return authorizedFetch(`${KB_BASE_URL}/delete`, {
      method: "DELETE",
      // Construct the correct JSON object for the Backend
      body: JSON.stringify({
        path: path,
        type: type,
        project_name: project_name 
      }),
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

  export async function createProject(projectName) {
     return authorizedFetch(`${KB_BASE_URL}/create-project`, {
       method: 'POST',
       body: JSON.stringify({ project_name: projectName }),
     });
  }

  // ✅ ADD THIS FUNCTION HERE
  // This uses authorizedFetch so it handles the token automatically
  export async function fetchContainers() {
    return authorizedFetch(`${KB_BASE_URL}/containers`);
  }

  // export async function triggerKbIndexer() {
  //   // Assuming indexer endpoint is on same backend or separate
  //   return authorizedFetch(`${KB_BASE_URL}/search/run-indexer`, {
  //     method: "POST",
  //   });
  // }

  // ✅ FIX: Accept project_name to call the new endpoint correctly
  export async function triggerKbIndexer(project_name) {
    if (!project_name) {
        console.warn("Indexer called without project name.");
        return; 
    }
    return authorizedFetch(`${KB_BASE_URL}/search/run-indexer`, {
      method: "POST",
      body: JSON.stringify({ 
          project_name: project_name 
      }),
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
