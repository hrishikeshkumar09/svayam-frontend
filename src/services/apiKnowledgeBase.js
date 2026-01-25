// // src/services/apiKnowledgeBase.js
// import { getAuthHeader } from './apiAuth'; // <-- Imports the auth function

// // This is the single source of truth for your API URL
// //const API_BASE_URL = "https://svayam-ams-api-a2g7e0cxgsacfxcy.southindia-01.azurewebsites.net";
// const API_BASE_URL = "http://127.0.0.1:8000";

// /**
//  * A helper function to handle API responses and errors.
//  * @param {Response} response - The fetch response object.
//  */
// const handleResponse = async (response) => {
//   if (response.status === 204) {
//     return; // No content, but successful (for DELETE)
//   }
  
//   const data = await response.json();

//   if (!response.ok) {
//     // Throw an error with the message from the backend
//     throw new Error(data.detail || `Error ${response.status}: ${response.statusText}`);
//   }
  
//   return data;
// };

// /**
//  * Fetches the entire knowledge base tree structure.
//  */
// export const fetchKnowledgeBaseTree = async () => {
//   const response = await fetch(`${API_BASE_URL}/api/kb/`, {
//     headers: getAuthHeader() // <-- Adds Auth
//   });
//   return handleResponse(response);
// };

// /**
//  * Gets a time-limited SAS URL for downloading/viewing a file.
//  * @param {string} blobName - The full path/id of the blob.
//  */
// export const getDownloadUrl = async (blobName) => {
//   const encodedBlobName = encodeURIComponent(blobName);
//   const response = await fetch(`${API_BASE_URL}/api/kb/download-url?blob_name=${encodedBlobName}`, {
//     headers: getAuthHeader() // <-- Adds Auth
//   });
//   return handleResponse(response);
// };

// /**
//  * Deletes a file or folder from blob storage.
//  * @param {string} path - The path/id of the item to delete.
//  * @param {'file' | 'folder'} type - The type of item.
//  */
// export const deleteItem = async (path, type) => {
//   const response = await fetch(`${API_BASE_URL}/api/kb/delete`, {
//     method: 'DELETE',
//     headers: { 
//       'Content-Type': 'application/json',
//       ...getAuthHeader() // <-- Adds Auth
//     },
//     body: JSON.stringify({ path, type }),
//   });
//   return handleResponse(response); // Will handle the 204 No Content
// };

// /**
//  * Renames a file or folder in blob storage.
//  * @param {string} old_path - The current path/id of the item.
//  * @param {string} new_name - The new name for the item.
//  * @param {'file' | 'folder'} type - The type of item.
//  */
// export const renameItem = async (old_path, new_name, type) => {
//   const response = await fetch(`${API_BASE_URL}/api/kb/rename`, {
//     method: 'PUT',
//     headers: { 
//       'Content-Type': 'application/json',
//       ...getAuthHeader() // <-- Adds Auth
//     },
//     body: JSON.stringify({ old_path, new_name, type }),
//   });
//   return handleResponse(response);
// };

// /**
//  * Triggers the backend to re-run the Azure AI Search indexer.
//  */
// export const triggerIndexer = async () => {
//   const response = await fetch(`${API_BASE_URL}/api/search/run-indexer`, {
//     method: 'POST',
//     headers: getAuthHeader() // <-- Adds Auth
//   });
//   return handleResponse(response);
// };

// /**
//  * Uploads files to the knowledge base with progress tracking.
//  * @param {FormData} formData - The form data containing files and destination.
//  * @param {(progress: number) => void} onProgress - A callback function to report progress (0-100).
//  */
// export const uploadFiles = (formData, onProgress) => {
//   return new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();
    
//     xhr.open("POST", `${API_BASE_URL}/api/kb/upload-files`);
    
//     // --- Add the auth token to the XHR request ---
//     const authHeader = getAuthHeader();
//     if (authHeader.Authorization) {
//       xhr.setRequestHeader("Authorization", authHeader.Authorization);
//     }
//     // --- End auth token ---
    
//     // Track upload progress
//     xhr.upload.onprogress = (event) => {
//       if (event.lengthComputable) {
//         const percentComplete = Math.round((event.loaded / event.total) * 100);
//         onProgress(percentComplete);
//       }
//     };
    
//     // Handle success
//     xhr.onload = () => {
//       if (xhr.status >= 200 && xhr.status < 300) {
//         resolve(JSON.parse(xhr.responseText));
//       } else {
//         // Try to parse error detail from backend
//         try {
//           const errData = JSON.parse(xhr.responseText);
//           reject(new Error(errData.detail || `Upload failed with status: ${xhr.status}`));
//         } catch (e) {
//           reject(new Error(`Upload failed with status: ${xhr.status}`));
//         }
//       }
//     };
    
//     // Handle network errors
//     xhr.onerror = () => {
//       reject(new Error("Network error during upload."));
//     };
    
//     xhr.send(formData);
//   });
// };



// src/services/apiKnowledgeBase.js
// import { getAuthHeader } from './apiAuth'; 

// // This is the single source of truth for your API URL
// //const API_BASE_URL = "https://svayam-ams-api-a2g7e0cxgsacfxcy.southindia-01.azurewebsites.net";
// const API_BASE_URL = "http://127.0.0.1:8000"; // Use this for local testing

// /**
//  * A helper function to handle API responses and errors.
//  * @param {Response} response - The fetch response object.
//  */
// const handleResponse = async (response) => {
//   if (response.status === 204) {
//     return; // No content, but successful (for DELETE)
//   }
  
//   const data = await response.json();

//   if (!response.ok) {
//     // --- NEW: Handle Session Timeout (401) ---
//     if (response.status === 401) {
//       // Dispatch a custom event that App.js will listen for
//       const event = new CustomEvent('auth-error', { 
//         detail: data.detail || "Session expired. Please log in again." 
//       });
//       window.dispatchEvent(event);
//     }
//     // -----------------------------------------

//     // Throw an error with the message from the backend
//     throw new Error(data.detail || `Error ${response.status}: ${response.statusText}`);
//   }
  
//   return data;
// };

// /**
//  * Fetches the list of all blob containers.
//  */
// export const fetchContainers = async () => {
//   const response = await fetch(`${API_BASE_URL}/api/kb/containers`, {
//     headers: getAuthHeader() 
//   });
//   return handleResponse(response);
// };

// /**
//  * Fetches the entire knowledge base tree structure.
//  */
// export const fetchKnowledgeBaseTree = async () => {
//   const response = await fetch(`${API_BASE_URL}/api/kb/`, {
//     headers: getAuthHeader() 
//   });
//   return handleResponse(response);
// };

// /**
//  * Gets a time-limited SAS URL for downloading/viewing a file.
//  * @param {string} blobName - The full path/id of the blob.
//  */
// export const getDownloadUrl = async (blobName) => {
//   const encodedBlobName = encodeURIComponent(blobName);
//   const response = await fetch(`${API_BASE_URL}/api/kb/download-url?blob_name=${encodedBlobName}`, {
//     headers: getAuthHeader() 
//   });
//   return handleResponse(response);
// };

// /**
//  * Deletes a file or folder from blob storage.
//  * @param {string} path - The path/id of the item to delete.
//  * @param {'file' | 'folder'} type - The type of item.
//  */
// export const deleteItem = async (path, type) => {
//   const response = await fetch(`${API_BASE_URL}/api/kb/delete`, {
//     method: 'DELETE',
//     headers: { 
//       'Content-Type': 'application/json',
//       ...getAuthHeader() 
//     },
//     body: JSON.stringify({ path, type }),
//   });
//   return handleResponse(response); 
// };

// /**
//  * Renames a file or folder in blob storage.
//  * @param {string} old_path - The current path/id of the item.
//  * @param {string} new_name - The new name for the item.
//  * @param {'file' | 'folder'} type - The type of item.
//  */
// export const renameItem = async (old_path, new_name, type) => {
//   const response = await fetch(`${API_BASE_URL}/api/kb/rename`, {
//     method: 'PUT',
//     headers: { 
//       'Content-Type': 'application/json',
//       ...getAuthHeader() 
//     },
//     body: JSON.stringify({ old_path, new_name, type }),
//   });
//   return handleResponse(response);
// };

// /**
//  * Triggers the backend to re-run the Azure AI Search indexer.
//  */
// export const triggerIndexer = async () => {
//   const response = await fetch(`${API_BASE_URL}/api/search/run-indexer`, {
//     method: 'POST',
//     headers: getAuthHeader() 
//   });
//   return handleResponse(response);
// };

// /**
//  * Uploads files to the knowledge base with progress tracking.
//  * @param {FormData} formData - The form data containing files and destination.
//  * @param {(progress: number) => void} onProgress - A callback function to report progress (0-100).
//  */
// export const uploadFiles = (formData, onProgress) => {
//   return new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();
    
//     xhr.open("POST", `${API_BASE_URL}/api/kb/upload-files`);
    
//     // --- Add the auth token to the XHR request ---
//     const authHeader = getAuthHeader();
//     if (authHeader.Authorization) {
//       xhr.setRequestHeader("Authorization", authHeader.Authorization);
//     }
//     // --- End auth token ---
    
//     // Track upload progress
//     xhr.upload.onprogress = (event) => {
//       if (event.lengthComputable) {
//         const percentComplete = Math.round((event.loaded / event.total) * 100);
//         onProgress(percentComplete);
//       }
//     };
    
//     // Handle success
//     xhr.onload = () => {
//       // --- NEW: Handle Session Timeout in XHR (401) ---
//       if (xhr.status === 401) {
//          const event = new CustomEvent('auth-error', { detail: "Session expired during upload." });
//          window.dispatchEvent(event);
//          reject(new Error("Session expired."));
//          return;
//       }
//       // ------------------------------------------------

//       if (xhr.status >= 200 && xhr.status < 300) {
//         resolve(JSON.parse(xhr.responseText));
//       } else {
//         // Try to parse error detail from backend
//         try {
//           const errData = JSON.parse(xhr.responseText);
//           reject(new Error(errData.detail || `Upload failed with status: ${xhr.status}`));
//         } catch (e) {
//           reject(new Error(`Upload failed with status: ${xhr.status}`));
//         }
//       }
//     };
    
//     // Handle network errors
//     xhr.onerror = () => {
//       reject(new Error("Network error during upload."));
//     };
    
//     xhr.send(formData);
//   });
// };

// src/services/apiKnowledgeBase.js
// import { getAuthHeader } from './apiAuth'; 

// //const API_BASE_URL = "https://svayam-ams-api-a2g7e0cxgsacfxcy.southindia-01.azurewebsites.net";
// const API_BASE_URL = "http://127.0.0.1:8000";

// const handleResponse = async (response) => {
//   if (response.status === 204) return;
//   const data = await response.json();
//   if (!response.ok) {
//     if (response.status === 401) {
//       window.dispatchEvent(new CustomEvent('auth-error', { 
//         detail: data.detail || "Session expired. Please log in again." 
//       }));
//     }
//     throw new Error(data.detail || `Error ${response.status}: ${response.statusText}`);
//   }
//   return data;
// };

// /**
//  * Fetches the list of all blob containers (Projects).
//  */
// export const fetchContainers = async () => {
//   const response = await fetch(`${API_BASE_URL}/api/kb/containers`, {
//     headers: getAuthHeader() 
//   });
//   return handleResponse(response);
// };

// /**
//  * Fetches files. If projectName is provided, fetches from that container.
//  */
// export const fetchKnowledgeBaseTree = async (projectName = null) => {
//   let url = `${API_BASE_URL}/api/kb/`;
//   if (projectName) {
//     url += `?project=${encodeURIComponent(projectName)}`;
//   }
//   const response = await fetch(url, {
//     headers: getAuthHeader() 
//   });
//   return handleResponse(response);
// };

// export const getDownloadUrl = async (blobName, projectName = null) => {
//   let url = `${API_BASE_URL}/api/kb/download-url?blob_name=${encodeURIComponent(blobName)}`;
//   if (projectName) {
//     url += `&project=${encodeURIComponent(projectName)}`;
//   }
//   const response = await fetch(url, {
//     headers: getAuthHeader() 
//   });
//   return handleResponse(response);
// };

// export const deleteItem = async (path, type, projectName = null) => {
//   const response = await fetch(`${API_BASE_URL}/api/kb/delete`, {
//     method: 'DELETE',
//     headers: { 
//       'Content-Type': 'application/json',
//       ...getAuthHeader() 
//     },
//     // Backend expects 'project_name' in the body
//     body: JSON.stringify({ path, type, project_name: projectName }),
//   });
//   return handleResponse(response); 
// };

// export const renameItem = async (old_path, new_name, type, projectName = null) => {
//   const response = await fetch(`${API_BASE_URL}/api/kb/rename`, {
//     method: 'PUT',
//     headers: { 
//       'Content-Type': 'application/json',
//       ...getAuthHeader() 
//     },
//     // Backend expects 'project_name' in the body
//     body: JSON.stringify({ old_path, new_name, type, project_name: projectName }),
//   });
//   return handleResponse(response);
// };

// export const createProject = async (projectName) => {
//   const response = await fetch(`${API_BASE_URL}/api/kb/create-project`, {
//     method: 'POST',
//     headers: { 
//       'Content-Type': 'application/json',
//       ...getAuthHeader() 
//     },
//     body: JSON.stringify({ project_name: projectName }),
//   });
//   return handleResponse(response);
// };

// export const triggerIndexer = async () => {
//   const response = await fetch(`${API_BASE_URL}/api/search/run-indexer`, {
//     method: 'POST',
//     headers: getAuthHeader() 
//   });
//   return handleResponse(response);
// };

// export const uploadFiles = (formData, onProgress) => {
//   return new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();
//     xhr.open("POST", `${API_BASE_URL}/api/kb/upload-files`);
    
//     const authHeader = getAuthHeader();
//     if (authHeader.Authorization) {
//       xhr.setRequestHeader("Authorization", authHeader.Authorization);
//     }

//     xhr.upload.onprogress = (event) => {
//       if (event.lengthComputable) {
//         const percentComplete = Math.round((event.loaded / event.total) * 100);
//         onProgress(percentComplete);
//       }
//     };
    
//     xhr.onload = () => {
//       if (xhr.status === 401) {
//          window.dispatchEvent(new CustomEvent('auth-error', { detail: "Session expired during upload." }));
//          reject(new Error("Session expired."));
//          return;
//       }
//       if (xhr.status >= 200 && xhr.status < 300) {
//         resolve(JSON.parse(xhr.responseText));
//       } else {
//         try {
//           const errData = JSON.parse(xhr.responseText);
//           reject(new Error(errData.detail || `Upload failed with status: ${xhr.status}`));
//         } catch (e) {
//           reject(new Error(`Upload failed with status: ${xhr.status}`));
//         }
//       }
//     };
    
//     xhr.onerror = () => reject(new Error("Network error during upload."));
//     xhr.send(formData);
//   });
// };

// src/services/apiKnowledgeBase.js
import { getAuthHeader } from './authService'; 

// Use your deployed Azure URL
const API_BASE_URL = "https://svayam-argkayfnckeccqd6.southindia-01.azurewebsites.net";
//const API_BASE_URL = "http://127.0.0.1:8000";

const handleResponse = async (response) => {
  if (response.status === 204) return;
  
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401) {
      window.dispatchEvent(new CustomEvent('auth-error', { 
        detail: data.detail || "Session expired. Please log in again." 
      }));
    }
    throw new Error(data.detail || `Error ${response.status}: ${response.statusText}`);
  }
  return data;
};

// --- EXISTING FUNCTIONS (Updated to accept projectName) ---

export const fetchContainers = async () => {
  const response = await fetch(`${API_BASE_URL}/api/kb/containers`, {
    headers: getAuthHeader() 
  });
  return handleResponse(response);
};

export const fetchKnowledgeBaseTree = async (projectName = null) => {
  let url = `${API_BASE_URL}/api/kb/`;
  if (projectName) {
    url += `?project=${encodeURIComponent(projectName)}`;
  }
  const response = await fetch(url, {
    headers: getAuthHeader() 
  });
  return handleResponse(response);
};

export const getDownloadUrl = async (blobName, projectName = null) => {
  let url = `${API_BASE_URL}/api/kb/download-url?blob_name=${encodeURIComponent(blobName)}`;
  if (projectName) {
    url += `&project=${encodeURIComponent(projectName)}`;
  }
  const response = await fetch(url, {
    headers: getAuthHeader() 
  });
  return handleResponse(response);
};

export const deleteItem = async (path, type, projectName = null) => {
  const response = await fetch(`${API_BASE_URL}/api/kb/delete`, {
    method: 'DELETE',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeader() 
    },
    body: JSON.stringify({ path, type, project_name: projectName }),
  });
  return handleResponse(response); 
};

export const renameItem = async (old_path, new_name, type, projectName = null) => {
  const response = await fetch(`${API_BASE_URL}/api/kb/rename`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeader() 
    },
    body: JSON.stringify({ old_path, new_name, type, project_name: projectName }),
  });
  return handleResponse(response);
};

export const triggerIndexer = async () => {
  const response = await fetch(`${API_BASE_URL}/api/search/run-indexer`, {
    method: 'POST',
    headers: getAuthHeader() 
  });
  return handleResponse(response);
};

export const uploadFiles = (formData, onProgress) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE_URL}/api/kb/upload-files`);
    
    const authHeader = getAuthHeader();
    if (authHeader.Authorization) {
      xhr.setRequestHeader("Authorization", authHeader.Authorization);
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        onProgress(percentComplete);
      }
    };
    
    xhr.onload = () => {
      if (xhr.status === 401) {
         window.dispatchEvent(new CustomEvent('auth-error', { detail: "Session expired during upload." }));
         reject(new Error("Session expired."));
         return;
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        try {
          const errData = JSON.parse(xhr.responseText);
          reject(new Error(errData.detail || `Upload failed with status: ${xhr.status}`));
        } catch (e) {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      }
    };
    
    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.send(formData);
  });
};

// --- NEW FUNCTION FOR PROJECT CREATION ---
export const createProject = async (projectName) => {
  const response = await fetch(`${API_BASE_URL}/api/kb/create-project`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeader() 
    },
    body: JSON.stringify({ project_name: projectName }),
  });
  return handleResponse(response);
};