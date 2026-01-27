// import React, { useState, useRef, useEffect, useMemo } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   TextField,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Stack,
//   CircularProgress,
//   Alert,
//   AlertTitle,
//   Chip,
//   LinearProgress,
//   Breadcrumbs,
//   Link,
//   Menu,
//   MenuItem,
//   ListItemIcon,
//   List,
//   ListItemButton,
//   ListItemText,
//   Divider,
// } from "@mui/material";

// // Icons
// import FolderIcon from "@mui/icons-material/Folder";
// import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
// import UploadFileIcon from "@mui/icons-material/UploadFile";
// import DeleteIcon from "@mui/icons-material/Delete";
// import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
// import FolderZipIcon from "@mui/icons-material/FolderZip";
// import NavigateNextIcon from "@mui/icons-material/NavigateNext";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import SyncIcon from "@mui/icons-material/Sync";

// // ----- IMPORT KB API SERVICE -----
// import {
//   getKnowledgeBaseTree,
//   getDownloadUrl,
//   renameKbItem,
//   deleteKbItem,
//   uploadKbFiles,
//   triggerKbIndexer,
// } from "../../services/api";

// // -----------------------------------------------------------
// // Helper: find node by path ("SEWA/SEWA/EWM")
// // -----------------------------------------------------------
// const findNodeByPath = (nodes, path) => {
//   if (!path) {
//     return { type: "folder", children: nodes, name: "Root", id: "" };
//   }

//   let currentChildren = nodes;
//   let currentNode = null;
//   const parts = path.split("/");

//   for (const part of parts) {
//     if (!currentChildren) return null;
//     const found = currentChildren.find((n) => n.name === part);
//     if (!found) return null;
//     currentNode = found;
//     currentChildren = found.children;
//   }

//   return currentNode;
// };

// const KnowledgeBaseManagement = () => {
//   // Data
//   const [knowledgeBase, setKnowledgeBase] = useState([]);
//   const [currentPath, setCurrentPath] = useState("");

//   // Loading + error
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Context menu
//   const [contextMenu, setContextMenu] = useState(null);
//   const [nodeToAction, setNodeToAction] = useState(null);

//   // Actions state
//   const [isViewingId, setIsViewingId] = useState(null);
//   const [isDeletingId, setIsDeletingId] = useState(null);
//   const [isRenamingId, setIsRenamingId] = useState(null);

//   // Rename dialog
//   const [openRenameDialog, setOpenRenameDialog] = useState(false);
//   const [renamingNodeName, setRenamingNodeName] = useState("");

//   // Upload dialog
//   const [openUploadDialog, setOpenUploadDialog] = useState(false);
//   const [filesToUpload, setFilesToUpload] = useState([]);
//   const [uploadError, setUploadError] = useState("");
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [isUploading, setIsUploading] = useState(false);
//   const fileInputRef = useRef(null);
//   const folderInputRef = useRef(null);

//   // Indexing
//   const [isIndexing, setIsIndexing] = useState(false);
//   const [indexStatus, setIndexStatus] = useState({ msg: "", type: "" });

//   // -----------------------------------------------------------
//   // Fetch Knowledge Base Tree
//   // -----------------------------------------------------------
//   const loadKnowledgeBase = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       const startTime = new Date().toLocaleString();
//       console.log(`Knowledge Base loading started at: ${startTime}`);

//       const data = await getKnowledgeBaseTree();

//       const completionTime = new Date().toLocaleString();
//       console.log(`Knowledge Base loading completed at: ${completionTime}`);

//       setKnowledgeBase(data || []);
//     } catch (err) {
//       console.error("Failed to load KB:", err);
//       setError(err.message || "Failed to load knowledge base");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadKnowledgeBase();
//   }, []);

//   // -----------------------------------------------------------
//   // Breadcrumbs
//   // -----------------------------------------------------------
//   const breadcrumbs = useMemo(() => {
//     const list = [{ name: "Root", path: "" }];
//     if (!currentPath) return list;

//     const parts = currentPath.split("/");
//     let acc = "";
//     for (const part of parts) {
//       acc = acc ? `${acc}/${part}` : part;
//       list.push({ name: part, path: acc });
//     }
//     return list;
//   }, [currentPath]);

//   // -----------------------------------------------------------
//   // Visible items in current folder (Mac Finder-style list)
//   // -----------------------------------------------------------
//   const displayedItems = useMemo(() => {
//     const node = findNodeByPath(knowledgeBase, currentPath);
//     if (!node || !node.children) return [];
//     const arr = [...node.children];
//     // Folders first, then files, alphabetical
//     arr.sort((a, b) => {
//       if (a.type === b.type) {
//         return a.name.localeCompare(b.name);
//       }
//       return a.type === "folder" ? -1 : 1;
//     });
//     return arr;
//   }, [knowledgeBase, currentPath]);

//   // -----------------------------------------------------------
//   // View / Download file
//   // -----------------------------------------------------------
//   const handleViewFile = async (node) => {
//     if (!node || node.type !== "file") return;
//     try {
//       setIsViewingId(node.id);
//       const { url } = await getDownloadUrl(node.id);
//       window.open(url, "_blank");
//     } catch (err) {
//       console.error("View/download failed:", err);
//       alert(err.message || "Failed to open file.");
//     } finally {
//       setIsViewingId(null);
//     }
//   };

//   // -----------------------------------------------------------
//   // Double click row: open folder or view file
//   // -----------------------------------------------------------
//   const handleItemDoubleClick = (node) => {
//     if (!node) return;
//     if (node.type === "folder") {
//       setCurrentPath(node.id);
//     } else {
//       handleViewFile(node);
//     }
//   };

//   // -----------------------------------------------------------
//   // Context Menu
//   // -----------------------------------------------------------
//   const handleContextMenu = (e, node) => {
//     e.preventDefault();
//     setContextMenu({
//       mouseX: e.clientX + 2,
//       mouseY: e.clientY - 6,
//       node,
//     });
//   };

//   const closeContextMenu = () => {
//     setContextMenu(null);
//   };

//   // -----------------------------------------------------------
//   // Delete
//   // -----------------------------------------------------------
//   const handleDelete = async () => {
//     const node = contextMenu?.node;
//     closeContextMenu();
//     if (!node) return;

//     if (!window.confirm(`Are you sure you want to delete "${node.name}"?`)) {
//       return;
//     }

//     setIsDeletingId(node.id);
//     try {
//       await deleteKbItem({ path: node.id, type: node.type });
//       await loadKnowledgeBase();
//     } catch (err) {
//       console.error("Delete failed:", err);
//       alert(err.message || "Failed to delete item.");
//     } finally {
//       setIsDeletingId(null);
//     }
//   };

//   // -----------------------------------------------------------
//   // Rename
//   // -----------------------------------------------------------
//   const handleOpenRename = () => {
//     const node = contextMenu?.node;
//     closeContextMenu();
//     if (!node) return;
//     setNodeToAction(node);
//     setRenamingNodeName(node.name);
//     setOpenRenameDialog(true);
//   };

//   const confirmRename = async () => {
//     const node = nodeToAction;
//     const newName = renamingNodeName.trim();
//     if (!node || !newName) return;

//     if (newName === node.name) {
//       setOpenRenameDialog(false);
//       setNodeToAction(null);
//       return;
//     }

//     setOpenRenameDialog(false);
//     setIsRenamingId(node.id);
//     try {
//       await renameKbItem({
//         old_path: node.id,
//         new_name: newName,
//         type: node.type,
//       });
//       await loadKnowledgeBase();
//     } catch (err) {
//       console.error("Rename failed:", err);
//       alert(err.message || "Failed to rename item.");
//     } finally {
//       setIsRenamingId(null);
//       setNodeToAction(null);
//     }
//   };

//   // -----------------------------------------------------------
//   // Upload
//   // -----------------------------------------------------------
//   const handleOpenUploadDialog = () => {
//     setFilesToUpload([]);
//     setUploadError("");
//     setUploadProgress(0);
//     setIsUploading(false);
//     setOpenUploadDialog(true);
//   };

//   const handleUpload = async () => {
//     if (!filesToUpload.length) {
//       setUploadError("Please select at least one file or folder.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("destination_folder", currentPath || "");

//     filesToUpload.forEach((file) => {
//       const path = file.webkitRelativePath || file.name;
//       formData.append("files", file, path);
//     });

//     setIsUploading(true);
//     setUploadError("");

//     try {
//       await uploadKbFiles(formData, (percent) => setUploadProgress(percent));
//       setOpenUploadDialog(false);
//       await loadKnowledgeBase();
//     } catch (err) {
//       console.error("Upload failed:", err);
//       setUploadError(err.message || "Upload failed.");
//     } finally {
//       setIsUploading(false);
//       setUploadProgress(0);
//     }
//   };

//   // -----------------------------------------------------------
//   // Trigger Indexing
//   // -----------------------------------------------------------
//   const handleTriggerIndex = async () => {
//     setIsIndexing(true);
//     setIndexStatus({ msg: "", type: "" });

//     try {
//       await triggerKbIndexer();
//       setIndexStatus({
//         msg: "Indexer started successfully. Changes will reflect after a few minutes.",
//         type: "success",
//       });
//     } catch (err) {
//       console.error("Index trigger failed:", err);
//       setIndexStatus({
//         msg: err.message || "Failed to trigger indexer.",
//         type: "error",
//       });
//     } finally {
//       setIsIndexing(false);
//     }
//   };

//   // -----------------------------------------------------------
//   // Render
//   // -----------------------------------------------------------
//   return (
//     <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
//       {/* Header */}
//       <Box
//         sx={{
//           p: 2,
//           borderBottom: "1px solid #e2e8f0",
//           flexShrink: 0,
//           bgcolor: "background.paper",
//         }}
//       >
//         <Typography variant="h6" sx={{ fontWeight: 600 }}>
//           Knowledge Base Management
//         </Typography>
//       </Box>

//       {/* Toolbar / Breadcrumbs */}
//       <Box
//         sx={{
//           p: 2,
//           borderBottom: "1px solid #e2e8f0",
//           flexShrink: 0,
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           bgcolor: "background.paper",
//         }}
//       >
//         <Breadcrumbs
//           separator={<NavigateNextIcon fontSize="small" />}
//           aria-label="breadcrumb"
//         >
//           {breadcrumbs.map((bc, idx) =>
//             idx === breadcrumbs.length - 1 ? (
//               <Typography key={bc.path} color="text.primary" sx={{ fontWeight: 500 }}>
//                 {bc.name}
//               </Typography>
//             ) : (
//               <Link
//                 key={bc.path}
//                 component="button"
//                 onClick={() => setCurrentPath(bc.path)}
//                 sx={{ textDecoration: "none" }}
//               >
//                 {bc.name}
//               </Link>
//             )
//           )}
//         </Breadcrumbs>

//         <Stack direction="row" spacing={1}>
//           <Button
//             variant="outlined"
//             size="small"
//             startIcon={<UploadFileIcon />}
//             onClick={handleOpenUploadDialog}
//           >
//             Upload
//           </Button>

//           <Button
//             variant="contained"
//             size="small"
//             startIcon={
//               isIndexing ? <CircularProgress size={16} color="inherit" /> : <SyncIcon />
//             }
//             disabled={isIndexing}
//             onClick={handleTriggerIndex}
//           >
//             {isIndexing ? "Updating Index..." : "Update Index"}
//           </Button>
//         </Stack>
//       </Box>

//       {/* Indexing Status */}
//       {indexStatus.msg && (
//         <Box sx={{ p: 2 }}>
//           <Alert
//             severity={indexStatus.type === "success" ? "success" : "error"}
//             onClose={() => setIndexStatus({ msg: "", type: "" })}
//           >
//             <AlertTitle>
//               {indexStatus.type === "success" ? "Success" : "Error"}
//             </AlertTitle>
//             {indexStatus.msg}
//           </Alert>
//         </Box>
//       )}

//       {/* Main Content: Mac Finder–style flat list */}
//       <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}

//         {isLoading ? (
//           <Box
//             sx={{
//               height: "100%",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: 1,
//             }}
//           >
//             <CircularProgress size={22} />
//             <Typography color="text.secondary">
//               Loading Knowledge Base...
//             </Typography>
//           </Box>
//         ) : displayedItems.length === 0 ? (
//           <Box
//             sx={{
//               mt: 6,
//               textAlign: "center",
//               color: "text.secondary",
//             }}
//           >
//             <Typography variant="body1">This folder is empty.</Typography>
//           </Box>
//         ) : (
//           <Box
//             sx={{
//               border: "1px solid #e2e8f0",
//               borderRadius: 1,
//               overflow: "hidden",
//             }}
//           >
//             {/* Header row like Finder / Files app */}
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 px: 2,
//                 py: 1,
//                 bgcolor: "grey.50",
//                 borderBottom: "1px solid #e2e8f0",
//               }}
//             >
//               <Box sx={{ width: 32, mr: 1 }} />
//               <Box sx={{ flex: 3 }}>
//                 <Typography variant="caption" sx={{ fontWeight: 600, textTransform: "uppercase" }}>
//                   Name
//                 </Typography>
//               </Box>
//               <Box sx={{ flex: 1 }}>
//                 <Typography variant="caption" sx={{ fontWeight: 600, textTransform: "uppercase" }}>
//                   Type
//                 </Typography>
//               </Box>
//             </Box>

//             <List dense disablePadding>
//               {displayedItems.map((node, index) => {
//                 const isBusy =
//                   isDeletingId === node.id || isRenamingId === node.id;
//                 const isFile = node.type === "file";

//                 return (
//                   <React.Fragment key={node.id}>
//                     <ListItemButton
//                       dense
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         px: 2,
//                         py: 0.75,
//                         opacity: isBusy ? 0.6 : 1,
//                       }}
//                       onDoubleClick={() => !isBusy && handleItemDoubleClick(node)}
//                       onContextMenu={(e) => !isBusy && handleContextMenu(e, node)}
//                     >
//                       {/* Icon */}
//                       <Box sx={{ width: 32, mr: 1, display: "flex", justifyContent: "center" }}>
//                         {isFile ? (
//                           <InsertDriveFileIcon fontSize="small" />
//                         ) : (
//                           <FolderIcon fontSize="small" color="primary" />
//                         )}
//                       </Box>

//                       {/* Name */}
//                       <Box sx={{ flex: 3, display: "flex", alignItems: "center" }}>
//                         <ListItemText
//                           primaryTypographyProps={{
//                             noWrap: true,
//                             sx: { fontSize: 14 },
//                             title: node.name,
//                           }}
//                           primary={node.name}
//                         />
//                         {isBusy && (
//                           <CircularProgress
//                             size={16}
//                             sx={{ ml: 1 }}
//                           />
//                         )}
//                       </Box>

//                       {/* Type */}
//                       <Box sx={{ flex: 1 }}>
//                         <Typography
//                           variant="caption"
//                           sx={{ color: "text.secondary" }}
//                         >
//                           {node.type === "folder" ? "Folder" : "File"}
//                         </Typography>
//                       </Box>
//                     </ListItemButton>

//                     {index < displayedItems.length - 1 && <Divider component="li" />}
//                   </React.Fragment>
//                 );
//               })}
//             </List>
//           </Box>
//         )}
//       </Box>

//       {/* Context Menu */}
//       <Menu
//         open={Boolean(contextMenu)}
//         onClose={closeContextMenu}
//         anchorReference="anchorPosition"
//         anchorPosition={
//           contextMenu
//             ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
//             : undefined
//         }
//       >
//         {contextMenu?.node?.type === "file" && (
//           <MenuItem onClick={() => handleViewFile(contextMenu.node)}>
//             <ListItemIcon>
//               <VisibilityIcon fontSize="small" />
//             </ListItemIcon>
//             View / Download
//           </MenuItem>
//         )}

//         <MenuItem onClick={handleOpenRename}>
//           <ListItemIcon>
//             <DriveFileRenameOutlineIcon fontSize="small" />
//           </ListItemIcon>
//           Rename
//         </MenuItem>

//         <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
//           <ListItemIcon>
//             <DeleteIcon fontSize="small" color="error" />
//           </ListItemIcon>
//           Delete
//         </MenuItem>
//       </Menu>

//       {/* Rename Dialog */}
//       <Dialog
//         open={openRenameDialog}
//         onClose={() => setOpenRenameDialog(false)}
//       >
//         <DialogTitle>Rename "{nodeToAction?.name}"</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             fullWidth
//             margin="dense"
//             label="New name"
//             value={renamingNodeName}
//             onChange={(e) => setRenamingNodeName(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenRenameDialog(false)}>Cancel</Button>
//           <Button
//             variant="contained"
//             onClick={confirmRename}
//             disabled={!renamingNodeName.trim()}
//           >
//             Rename
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Upload Dialog */}
//       <Dialog
//         open={openUploadDialog}
//         onClose={() => setOpenUploadDialog(false)}
//         fullWidth
//         maxWidth="sm"
//       >
//         <DialogTitle>
//           Upload to "{breadcrumbs[breadcrumbs.length - 1]?.name}"
//         </DialogTitle>
//         <DialogContent>
//           <Stack spacing={2} sx={{ mt: 1 }}>
//             <Typography variant="body2">
//               You can upload one or more files, or select a folder.
//             </Typography>

//             <Stack direction="row" spacing={2}>
//               <Button
//                 variant="outlined"
//                 startIcon={<UploadFileIcon />}
//                 onClick={() => fileInputRef.current?.click()}
//                 disabled={isUploading}
//               >
//                 Select Files
//               </Button>
//               <Button
//                 variant="outlined"
//                 startIcon={<FolderZipIcon />}
//                 onClick={() => folderInputRef.current?.click()}
//                 disabled={isUploading}
//               >
//                 Select Folder
//               </Button>
//             </Stack>

//             {/* Hidden Inputs */}
//             <input
//               type="file"
//               multiple
//               ref={fileInputRef}
//               style={{ display: "none" }}
//               onChange={(e) =>
//                 setFilesToUpload(Array.from(e.target.files || []))
//               }
//             />
//             <input
//               type="file"
//               ref={folderInputRef}
//               style={{ display: "none" }}
//               webkitdirectory="true"
//               directory="true"
//               onChange={(e) =>
//                 setFilesToUpload(Array.from(e.target.files || []))
//               }
//             />

//             {/* Selected Files */}
//             {filesToUpload.length > 0 && (
//               <Box
//                 sx={{
//                   maxHeight: 160,
//                   overflowY: "auto",
//                   bgcolor: "grey.100",
//                   p: 1,
//                   borderRadius: 1,
//                 }}
//               >
//                 <Typography variant="subtitle2" sx={{ mb: 1 }}>
//                   Selected {filesToUpload.length} file(s):
//                 </Typography>
//                 <Stack spacing={0.5}>
//                   {filesToUpload.map((file, idx) => (
//                     <Chip
//                       key={idx}
//                       size="small"
//                       label={file.webkitRelativePath || file.name}
//                     />
//                   ))}
//                 </Stack>
//               </Box>
//             )}

//             {uploadError && <Alert severity="error">{uploadError}</Alert>}

//             {isUploading && (
//               <Box sx={{ width: "100%" }}>
//                 <LinearProgress
//                   variant={
//                     uploadProgress > 0 && uploadProgress < 100
//                       ? "determinate"
//                       : "indeterminate"
//                   }
//                   value={uploadProgress}
//                 />
//                 <Typography
//                   variant="caption"
//                   align="center"
//                   display="block"
//                   sx={{ mt: 0.5 }}
//                 >
//                   {uploadProgress > 0 && uploadProgress < 100
//                     ? `Uploading... ${uploadProgress}%`
//                     : uploadProgress >= 100
//                     ? "Processing files on server..."
//                     : "Uploading..."}
//                 </Typography>
//               </Box>
//             )}
//           </Stack>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenUploadDialog(false)} disabled={isUploading}>
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             onClick={handleUpload}
//             disabled={filesToUpload.length === 0 || isUploading}
//           >
//             {isUploading ? "Uploading..." : `Upload (${filesToUpload.length})`}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default KnowledgeBaseManagement;

////EDIT IN KNOWLEDGEBASE 2

//src/components/Admin/KnowledgeBaseManagement.js

// import React, { useState, useRef, useEffect, useMemo } from 'react';
// import {
//   Box,
//   Typography,
//   Button,
//   TextField,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Stack,
//   Paper,
//   CircularProgress,
//   Alert,
//   AlertTitle,
//   Chip,
//   LinearProgress,
//   Grid,
//   Breadcrumbs,
//   Link,
//   Menu,
//   MenuItem,
//   ListItemIcon,
// } from '@mui/material';

// // Icons
// import FolderIcon from '@mui/icons-material/Folder';
// import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
// import UploadFileIcon from '@mui/icons-material/UploadFile';
// import DeleteIcon from '@mui/icons-material/Delete';
// import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
// import FolderZipIcon from '@mui/icons-material/FolderZip';
// import NavigateNextIcon from '@mui/icons-material/NavigateNext'; 
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import SyncIcon from '@mui/icons-material/Sync'; 
// import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
// import StorageIcon from '@mui/icons-material/Storage';

// // API Service Imports
// import {
//   getKnowledgeBaseTree as fetchKnowledgeBaseTree, // Aliasing to keep your component code working
//   getDownloadUrl,
//   deleteKbItem as deleteItem,       // Aliased
//   renameKbItem as renameItem,       // Aliased
//   triggerKbIndexer as triggerIndexer, // Aliased
//   uploadKbFiles as uploadFiles,     // Aliased
//   createProject,
//   fetchContainers
// } from '../../services/api'; 

// // --- Helper: Find Node in Tree ---
// const findNodeByPath = (nodes, path) => {
//   if (path === '') return { type: 'folder', children: nodes, name: 'Root', id: '' };
//   let currentChildren = nodes;
//   let currentNode = null;
//   const parts = path.split('/');
//   for (const part of parts) {
//     if (!currentChildren) return null;
//     const foundNode = currentChildren.find(node => node.name === part); 
//     if (!foundNode) return null;
//     currentNode = foundNode;
//     currentChildren = foundNode.children;
//   }
//   return currentNode;
// };

// const KnowledgeBaseManagement = () => {
//   // --- State: View Mode (Containers vs Files) ---
//   const [viewMode, setViewMode] = useState('containers'); 
//   const [containers, setContainers] = useState([]);
//   const [selectedContainer, setSelectedContainer] = useState(null);

//   // --- State: File System ---
//   const [knowledgeBase, setKnowledgeBase] = useState([]);
//   const [currentPath, setCurrentPath] = useState(''); 
  
//   // --- State: UI & Loading ---
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [contextMenu, setContextMenu] = useState(null); 
//   const [indexStatus, setIndexStatus] = useState({ msg: '', type: '' }); 

//   // --- State: Loading Indicators ---
//   const [isViewingId, setIsViewingId] = useState(null);
//   const [isDeletingId, setIsDeletingId] = useState(null); 
//   const [isRenamingId, setIsRenamingId] = useState(null); 
//   const [isIndexing, setIsIndexing] = useState(false); 

//   // --- State: Create Project Dialog ---
//   const [openCreateProject, setOpenCreateProject] = useState(false);
//   const [newProjectName, setNewProjectName] = useState('');
//   const [isCreatingProject, setIsCreatingProject] = useState(false);
//   // Removed projectFiles state

//   // --- State: Upload Dialog ---
//   const [openAddFileDialog, setOpenAddFileDialog] = useState(false);
//   const [filesToUpload, setFilesToUpload] = useState([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadError, setUploadError] = useState('');
//   const [uploadProgress, setUploadProgress] = useState(0);

//   // --- State: Rename Dialog ---
//   const [openRenameDialog, setOpenRenameDialog] = useState(false);
//   const [renamingNodeName, setRenamingNodeName] = useState('');
//   const [nodeToAction, setNodeToAction] = useState(null);

//   // Refs for hidden file inputs
//   const fileInputRef = useRef(null);
//   const folderInputRef = useRef(null);

//   // --- 1. Load Data Effect ---
//   useEffect(() => {
//     loadData();
//   }, [viewMode, selectedContainer]);

//   const loadData = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       if (viewMode === 'containers') {
//         // Fetch list of Projects (Containers)
//         const data = await fetchContainers();
//         setContainers(data);
//       } else {
//         // Fetch files for the selected Project
//         const data = await fetchKnowledgeBaseTree(selectedContainer);
//         setKnowledgeBase(data);
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // --- 2. Navigation Handlers ---
//   const handleContainerClick = (containerName) => {
//     setSelectedContainer(containerName);
//     setCurrentPath(''); // Reset folder path when entering a new project
//     setViewMode('files');
//   };

//   const handleBackToContainers = () => {
//     setSelectedContainer(null);
//     setViewMode('containers');
//   };

//   const handleItemDoubleClick = (node) => {
//     if (node.type === 'folder') {
//       setCurrentPath(node.id);
//     } else {
//       handleViewFile(node);
//     }
//   };

//   const handleBreadcrumbClick = (crumb) => {
//       if (crumb.onClick) {
//           crumb.onClick();
//       } else {
//           setCurrentPath(crumb.path);
//       }
//   };

//   // --- 3. Computed Data ---
//   const breadcrumbs = useMemo(() => {
//     const crumbs = [
//         { name: 'All Projects', onClick: handleBackToContainers, isLink: true }
//     ];

//     if (viewMode === 'files' && selectedContainer) {
//         crumbs.push({ name: selectedContainer, path: '', isLink: true, onClick: () => setCurrentPath('') });
        
//         if (currentPath) {
//             const parts = currentPath.split('/');
//             let path = '';
//             for (const part of parts) {
//                 path = path ? `${path}/${part}` : part;
//                 crumbs.push({ name: part, path, isLink: true });
//             }
//         }
//     }
//     return crumbs;
//   }, [viewMode, selectedContainer, currentPath]);

//   const displayedItems = useMemo(() => {
//     if (viewMode === 'containers') {
//         return containers;
//     }
//     // File View logic: Filter by current folder path
//     const currentNode = findNodeByPath(knowledgeBase, currentPath);
//     if (currentNode && currentNode.children) {
//       return currentNode.children.sort((a, b) => {
//         // Sort: Folders first, then files alphabetically
//         if (a.type === b.type) return a.name.localeCompare(b.name);
//         return a.type === 'folder' ? -1 : 1;
//       });
//     }
//     return [];
//   }, [viewMode, containers, knowledgeBase, currentPath]);

//   // --- 4. Action Handlers ---

//   // A. Create Project (Simplified)
//   const handleCreateProject = async () => {
//     if (!newProjectName.trim()) return;
//     setIsCreatingProject(true);
//     setIndexStatus({ msg: '', type: '' });

//     try {
//       const sanitizedName = newProjectName.trim().toLowerCase().replace(/\s+/g, '-');
      
//       await createProject(sanitizedName);

//       setOpenCreateProject(false);
//       setNewProjectName('');
//       setIndexStatus({
//         msg: `Project '${sanitizedName}' created successfully!`,
//         type: "success"
//       });
//       loadData(); // Refresh the list of containers
//     } catch (err) {
//       setIndexStatus({ 
//         msg: `Failed to create project: ${err.message}`, 
//         type: "error" 
//       });
//     } finally {
//       setIsCreatingProject(false);
//     }
//   };

//   // B. View, Delete, Rename, Upload
//   const handleViewFile = async (fileNode) => {
//     if (!fileNode || !fileNode.id || fileNode.type !== 'file') return;
//     setIsViewingId(fileNode.id);
//     try {
//       // Pass selectedContainer to get correct download link
//       const data = await getDownloadUrl(fileNode.id, selectedContainer);
//       window.open(data.url, "_blank");
//     } catch (err) {
//       alert(`Error: ${err.message}`);
//     } finally {
//       setIsViewingId(null);
//     }
//   };

//   const handleConfirmUpload = async () => {
//     if (filesToUpload.length === 0) {
//       setUploadError("Please select files.");
//       return;
//     }
//     const destinationPath = currentPath;
    
//     setIsUploading(true);
//     setUploadError('');
//     setUploadProgress(0);

//     const formData = new FormData();
//     formData.append("destination_folder", destinationPath);
    
//     // Pass the project name so backend uploads to the right container
//     if (selectedContainer) {
//       formData.append("project_name", selectedContainer);
//     }

//     filesToUpload.forEach(file => {
//       const path = file.webkitRelativePath || file.name;
//       formData.append("files", file, path);
//     });

//     try {
//       const progressCallback = (percent) => setUploadProgress(percent);
//       await uploadFiles(formData, progressCallback);
//       handleCloseAddFileDialog();
//       loadData(); // Refresh file list
//     } catch (err) {
//       setUploadError(err.message);
//     } finally {
//       setIsUploading(false);
//       setUploadProgress(0);
//     }
//   };

//   const handleOpenDelete = async () => {
//     if (!contextMenu?.targetNode) return;
//     const nodeToDelete = contextMenu.targetNode;
//     handleCloseContextMenu(); 

//     const isContainer = nodeToDelete.type === 'container';
//     const msg = isContainer 
//       ? `DELETE PROJECT "${nodeToDelete.name}"?\n\nWARNING: This will delete the Blob Container and Search Index permanently.` 
//       : `Delete "${nodeToDelete.name}"?`;

//     if (window.confirm(msg)) {
//       setIsDeletingId(nodeToDelete.id || nodeToDelete.name);
//       try {
//         // Pass project name to delete from correct container
//         await deleteItem(
//             isContainer ? nodeToDelete.name : nodeToDelete.id, 
//             nodeToDelete.type, 
//             selectedContainer
//         );
//         loadData();
//       } catch (err) {
//         alert(`Error: ${err.message}`);
//       } finally {
//         setIsDeletingId(null);
//       }
//     }
//   };

//   const confirmRename = async () => {
//     if (!renamingNodeName.trim() || !nodeToAction) return;
//     if (renamingNodeName.trim() === nodeToAction.name) {
//       setOpenRenameDialog(false);
//       return;
//     }
//     setIsRenamingId(nodeToAction.id);
//     setOpenRenameDialog(false);
//     try {
//       // Pass project name
//       await renameItem(nodeToAction.id, renamingNodeName.trim(), nodeToAction.type, selectedContainer);
//       loadData();
//     } catch (err) {
//       alert(`Error: ${err.message}`);
//     } finally {
//       setIsRenamingId(null);
//       setNodeToAction(null);
//     }
//   };

//   const handleTriggerIndex = async () => {
//     setIndexStatus({ msg: '', type: '' });
//     setIsIndexing(true);
//     try {
//       await triggerIndexer(); 
//       setIndexStatus({ msg: "Indexer started.", type: "success" });
//     } catch (err) {
//       setIndexStatus({ msg: err.message, type: "error" });
//     } finally {
//       setIsIndexing(false);
//     }
//   };

//   // --- Context Menu Logic ---
//   const handleContextMenu = (event, item) => {
//     event.preventDefault();
//     setContextMenu({ mouseX: event.clientX + 2, mouseY: event.clientY - 6, targetNode: item });
//   };
//   const handleCloseContextMenu = () => setContextMenu(null);
//   const handleOpenRename = () => {
//     setNodeToAction(contextMenu.targetNode);
//     setRenamingNodeName(contextMenu.targetNode.name);
//     setOpenRenameDialog(true);
//     handleCloseContextMenu();
//   };
//   const handleOpenView = () => {
//     handleViewFile(contextMenu.targetNode);
//     handleCloseContextMenu();
//   };

//   // --- Upload Dialog Logic ---
//   const handleOpenUploadDialog = () => {
//     setFilesToUpload([]);
//     setUploadError('');
//     setOpenAddFileDialog(true);
//     handleCloseContextMenu();
//   };
//   const handleCloseAddFileDialog = () => setOpenAddFileDialog(false);
//   const handleSelectFiles = (e) => {
//     if (e.target.files) setFilesToUpload(Array.from(e.target.files));
//     e.target.value = null;
//   };
//   const handleSelectFolder = (e) => {
//     if (e.target.files) setFilesToUpload(Array.from(e.target.files));
//     e.target.value = null;
//   };


//   // --- RENDER ---
//   return (
//     <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//       {/* Header */}
//       <Box sx={{ p: 2.5, borderBottom: '1px solid #e2e8f0', flexShrink: 0 }}>
//         <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
//           Knowledge Base
//         </Typography>
//       </Box>
      
//       {/* Toolbar */}
//       <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper' }}>
//         <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
//           {breadcrumbs.map((crumb, index) => (
//              index === breadcrumbs.length - 1 ? 
//                 <Typography key={index} color="text.primary" sx={{ fontWeight: 500 }}>{crumb.name}</Typography> : 
//                 <Link key={index} component="button" onClick={() => handleBreadcrumbClick(crumb)} sx={{ cursor: 'pointer', textDecoration: 'none' }}>{crumb.name}</Link>
//           ))}
//         </Breadcrumbs>
        
//         <Stack direction="row" spacing={1}>
//            {/* Show "New Project" only in root container view */}
//            {viewMode === 'containers' && (
//              <Button variant="outlined" size="small" startIcon={<CreateNewFolderIcon />} onClick={() => setOpenCreateProject(true)}>
//                New Project
//              </Button>
//            )}
           
//            {/* Show File Operations only when inside a project */}
//            {viewMode === 'files' && (
//              <>
//                 <Button variant="outlined" size="small" startIcon={<UploadFileIcon />} onClick={handleOpenUploadDialog}>Upload</Button>
//                 <Button variant="contained" color="primary" size="small" startIcon={isIndexing ? <CircularProgress size={16} color="inherit" /> : <SyncIcon />} onClick={handleTriggerIndex} disabled={isIndexing}>
//                     {isIndexing ? "Updating..." : "Update Index"}
//                 </Button>
//              </>
//            )}
//          </Stack>
//       </Box>

//       {/* Main Content Grid */}
//       <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
//         {indexStatus.msg && (
//           <Alert 
//             severity={indexStatus.type} 
//             onClose={() => setIndexStatus({ msg: '', type: '' })} 
//             sx={{ mb: 2 }}
//           >
//             <AlertTitle>{indexStatus.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
//             {indexStatus.msg}
//           </Alert>
//         )}
        
//         {isLoading ? (
//           <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 2, gap: 1 }}>
//             <CircularProgress size={20} />
//             <Typography sx={{ color: 'text.secondary' }}>Loading...</Typography>
//           </Box>
//         ) : (
//           <Grid container spacing={2}>
//             {displayedItems.length === 0 && (
//               <Grid item xs={12}>
//                 <Typography sx={{ p: 2, color: 'text.secondary', textAlign: 'center' }}>
//                   {viewMode === 'containers' ? "No projects found. Create one!" : "This folder is empty."}
//                 </Typography>
//               </Grid>
//             )}
            
//             {displayedItems.map((item, index) => {
//                 const isContainer = viewMode === 'containers';
//                 const isDeleting = isDeletingId === (isContainer ? item.name : item.id);
//                 const isRenaming = isRenamingId === item.id;
//                 const isDisabled = isDeleting || isRenaming;

//                 // Decide Icon
//                 let Icon = InsertDriveFileIcon;
//                 let iconColor = 'text.secondary';
//                 if (isContainer) { Icon = StorageIcon; iconColor = 'primary.main'; }
//                 else if (item.type === 'folder') { Icon = FolderIcon; iconColor = 'primary.main'; }

//                 return (
//                 <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
//                   <Paper
//                     variant="outlined"
//                     sx={{
//                       '&:hover': { bgcolor: isDisabled ? 'transparent' : 'action.hover', cursor: isDisabled ? 'default' : 'pointer' },
//                       userSelect: 'none', position: 'relative', opacity: isDisabled ? 0.5 : 1
//                     }}
//                     onDoubleClick={() => !isDisabled && (isContainer ? handleContainerClick(item.name) : handleItemDoubleClick(item))}
//                     onContextMenu={(e) => !isDisabled && handleContextMenu(e, item)}
//                   >
//                     {isDisabled && (
//                       <Box sx={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.7)', zIndex: 1 }}>
//                         <CircularProgress size={24} />
//                         <Typography variant="caption" sx={{ mt: 1, fontWeight: 'bold' }}>{isDeleting ? "Deleting..." : "Renaming..."}</Typography>
//                       </Box>
//                     )}
//                     <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 2 }}>
//                       <Icon sx={{ color: iconColor }} />
//                       <Typography variant="body2" noWrap sx={{ fontWeight: 500 }} title={item.name}>
//                         {item.name}
//                       </Typography>
//                     </Stack>
//                   </Paper>
//                 </Grid>
//               );
//             })}
//           </Grid>
//         )}
//       </Box>

//       {/* --- Context Menu --- */}
//       <Menu open={Boolean(contextMenu)} onClose={handleCloseContextMenu} anchorReference="anchorPosition" anchorPosition={contextMenu ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}>
//         {contextMenu?.targetNode && [
//           // View (Files Only)
//           contextMenu.targetNode.type === 'file' && <MenuItem key="view" onClick={handleOpenView}><ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>View / Download</MenuItem>,
//           // Rename (Files/Folders Only - NOT Projects)
//           contextMenu.targetNode.type !== 'container' && <MenuItem key="rename" onClick={handleOpenRename}><ListItemIcon><DriveFileRenameOutlineIcon fontSize="small" /></ListItemIcon>Rename</MenuItem>,
//           // Delete (All)
//           <MenuItem key="delete" onClick={handleOpenDelete} sx={{ color: 'error.main' }}><ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>Delete {contextMenu.targetNode.type === 'container' ? "Project" : ""}</MenuItem>
//         ]}
//       </Menu>

//       {/* --- Create Project Dialog (SIMPLIFIED) --- */}
//       <Dialog open={openCreateProject} onClose={() => !isCreatingProject && setOpenCreateProject(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>Create New Project</DialogTitle>
//         <DialogContent>
//           <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
//             Create a dedicated Blob Container and Search Index for your project.
//           </Typography>
          
//           <TextField 
//             autoFocus 
//             label="Project Name" 
//             fullWidth 
//             variant="outlined" 
//             value={newProjectName} 
//             onChange={(e) => setNewProjectName(e.target.value)} 
//             disabled={isCreatingProject} 
//             helperText="Lowercase letters, numbers, and hyphens only." 
//           />
            
//           {isCreatingProject && (
//             <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
//                 <CircularProgress size={20} />
//                 <Typography variant="caption">Provisioning Azure resources...</Typography>
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenCreateProject(false)} disabled={isCreatingProject}>Cancel</Button>
//           <Button 
//             onClick={handleCreateProject} 
//             variant="contained" 
//             disabled={!newProjectName.trim() || isCreatingProject}
//           >
//             {isCreatingProject ? "Creating..." : "Create Project"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* --- Upload Dialog (Existing Project) --- */}
//       <Dialog open={openAddFileDialog} onClose={handleCloseAddFileDialog} fullWidth maxWidth="sm">
//         <DialogTitle>Upload to "{selectedContainer}"</DialogTitle>
//         <DialogContent>
//           <input type="file" multiple ref={fileInputRef} style={{ display: 'none' }} onChange={handleSelectFiles} />
//           <input type="file" webkitdirectory="" directory="" ref={folderInputRef} style={{ display: 'none' }} onChange={(e) => { if(e.target.files) setFilesToUpload(Array.from(e.target.files)); }} />
//           <Stack spacing={2} sx={{ mt: 1 }}>
//             <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
//               <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={() => fileInputRef.current?.click()} disabled={isUploading}>Files</Button>
//               <Button variant="outlined" startIcon={<FolderZipIcon />} onClick={() => folderInputRef.current?.click()} disabled={isUploading}>Folder</Button>
//             </Stack>
//             {filesToUpload.length > 0 && (
//               <Box sx={{ maxHeight: 150, overflowY: 'auto', bgcolor: 'grey.100', p: 1, borderRadius: 1 }}>
//                 <Typography variant="subtitle2" sx={{ mb: 1 }}>Selected {filesToUpload.length} file(s)</Typography>
//                 {filesToUpload.slice(0, 10).map((file, i) => <Chip key={i} size="small" label={file.name} sx={{ m: 0.5 }} />)}
//                 {filesToUpload.length > 10 && <Typography variant="caption" sx={{ ml: 1 }}>...and {filesToUpload.length - 10} more</Typography>}
//               </Box>
//             )}
//             {uploadError && <Alert severity="error">{uploadError}</Alert>}
//             {isUploading && <LinearProgress variant={uploadProgress < 100 ? "determinate" : "indeterminate"} value={uploadProgress} />}
//           </Stack>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseAddFileDialog} disabled={isUploading}>Cancel</Button>
//           <Button onClick={handleConfirmUpload} variant="contained" disabled={filesToUpload.length === 0 || isUploading}>{isUploading ? "Uploading..." : "Upload"}</Button>
//         </DialogActions>
//       </Dialog>

//       {/* --- Rename Dialog --- */}
//       <Dialog open={openRenameDialog} onClose={() => setOpenRenameDialog(false)}>
//         <DialogTitle>Rename</DialogTitle>
//         <DialogContent>
//           <TextField autoFocus margin="dense" label="New Name" fullWidth variant="outlined" value={renamingNodeName} onChange={(e) => setRenamingNodeName(e.target.value)} />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenRenameDialog(false)}>Cancel</Button>
//           <Button onClick={confirmRename} variant="contained" disabled={!renamingNodeName.trim()}>Rename</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default KnowledgeBaseManagement;



import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Paper,
  CircularProgress,
  Alert,
  AlertTitle,
  Chip,
  LinearProgress,
  Grid,
  Breadcrumbs,
  Link,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';

// Icons
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import NavigateNextIcon from '@mui/icons-material/NavigateNext'; 
import VisibilityIcon from '@mui/icons-material/Visibility';
import SyncIcon from '@mui/icons-material/Sync'; 
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import StorageIcon from '@mui/icons-material/Storage';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// API Service Imports
import {
  getKnowledgeBaseTree as fetchKnowledgeBaseTree, // Aliasing to keep component logic consistent
  getDownloadUrl,
  deleteKbItem as deleteItem,       // Aliased
  renameKbItem as renameItem,       // Aliased
  triggerKbIndexer as triggerIndexer, // Aliased
  uploadKbFiles as uploadFiles,     // Aliased
  createProject,
  fetchContainers
} from '../../services/api'; 

// --- Helper: Find Node in Tree ---
const findNodeByPath = (nodes, path) => {
  if (path === '') return { type: 'folder', children: nodes, name: 'Root', id: '' };
  let currentChildren = nodes;
  let currentNode = null;
  const parts = path.split('/');
  for (const part of parts) {
    if (!currentChildren) return null;
    const foundNode = currentChildren.find(node => node.name === part); 
    if (!foundNode) return null;
    currentNode = foundNode;
    currentChildren = foundNode.children;
  }
  return currentNode;
};

const KnowledgeBaseManagement = () => {
  // --- State: View Mode (Containers vs Files) ---
  const [viewMode, setViewMode] = useState('containers'); 
  const [containers, setContainers] = useState([]);
  const [selectedContainer, setSelectedContainer] = useState(null);

  // --- State: File System ---
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [currentPath, setCurrentPath] = useState(''); 
  
  // --- State: UI & Loading ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contextMenu, setContextMenu] = useState(null); 
  const [indexStatus, setIndexStatus] = useState({ msg: '', type: '' }); 

  // --- State: Loading Indicators ---
  const [isViewingId, setIsViewingId] = useState(null);
  const [isDeletingId, setIsDeletingId] = useState(null); 
  const [isRenamingId, setIsRenamingId] = useState(null); 
  const [isIndexing, setIsIndexing] = useState(false); 

  // --- State: Create Project (UPDATED) ---
  const [openCreateProject, setOpenCreateProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [projectFiles, setProjectFiles] = useState([]); // Files for the new project
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [creationStep, setCreationStep] = useState(''); // "Provisioning...", "Uploading..."

  // --- State: Upload Dialog (Existing Project) ---
  const [openAddFileDialog, setOpenAddFileDialog] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // --- State: Rename Dialog ---
  const [openRenameDialog, setOpenRenameDialog] = useState(false);
  const [renamingNodeName, setRenamingNodeName] = useState('');
  const [nodeToAction, setNodeToAction] = useState(null);

  // Refs for hidden file inputs
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const createProjectFolderRef = useRef(null); // New Ref for Create Project Folder Select

  // --- 1. Load Data Effect ---
  useEffect(() => {
    loadData();
  }, [viewMode, selectedContainer]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (viewMode === 'containers') {
        // Fetch list of Projects (Containers)
        const data = await fetchContainers();
        setContainers(data);
      } else {
        // Fetch files for the selected Project
        const data = await fetchKnowledgeBaseTree(selectedContainer);
        setKnowledgeBase(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. Navigation Handlers ---
  const handleContainerClick = (containerName) => {
    setSelectedContainer(containerName);
    setCurrentPath(''); // Reset folder path when entering a new project
    setViewMode('files');
  };

  const handleBackToContainers = () => {
    setSelectedContainer(null);
    setViewMode('containers');
  };

  const handleItemDoubleClick = (node) => {
    if (node.type === 'folder') {
      setCurrentPath(node.id);
    } else {
      handleViewFile(node);
    }
  };

  const handleBreadcrumbClick = (crumb) => {
      if (crumb.onClick) {
          crumb.onClick();
      } else {
          setCurrentPath(crumb.path);
      }
  };

  // --- 3. Computed Data ---
  const breadcrumbs = useMemo(() => {
    const crumbs = [
        { name: 'All Projects', onClick: handleBackToContainers, isLink: true }
    ];

    if (viewMode === 'files' && selectedContainer) {
        crumbs.push({ name: selectedContainer, path: '', isLink: true, onClick: () => setCurrentPath('') });
        
        if (currentPath) {
            const parts = currentPath.split('/');
            let path = '';
            for (const part of parts) {
                path = path ? `${path}/${part}` : part;
                crumbs.push({ name: part, path, isLink: true });
            }
        }
    }
    return crumbs;
  }, [viewMode, selectedContainer, currentPath]);

  const displayedItems = useMemo(() => {
    if (viewMode === 'containers') {
        return containers;
    }
    // File View logic: Filter by current folder path
    const currentNode = findNodeByPath(knowledgeBase, currentPath);
    if (currentNode && currentNode.children) {
      return currentNode.children.sort((a, b) => {
        // Sort: Folders first, then files alphabetically
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'folder' ? -1 : 1;
      });
    }
    return [];
  }, [viewMode, containers, knowledgeBase, currentPath]);

  // --- 4. Action Handlers ---

  // A. Create Project (UPDATED LOGIC with Folder Select)
  const handleFolderSelectForCreate = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setProjectFiles(files);
      
      // Auto-extract project name from the first file's path (folder name)
      // webkitRelativePath example: "MyDocs/file1.txt" -> we want "MyDocs"
      const firstPath = files[0].webkitRelativePath;
      const folderName = firstPath.split('/')[0];
      
      // Sanitize: lowercase, replace spaces with dashes, only alphanumeric
      const sanitized = folderName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setNewProjectName(sanitized);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    setIsCreatingProject(true);
    setIndexStatus({ msg: '', type: '' });

    try {
      // Step 1: Create the Project (Container + Index + Indexer)
      setCreationStep('Provisioning Azure Resources...');
      await createProject(newProjectName);

      // Step 2: Upload the Files (if any)
      if (projectFiles.length > 0) {
        setCreationStep(`Uploading ${projectFiles.length} files...`);
        const formData = new FormData();
        formData.append("destination_folder", ""); // Root of new project
        formData.append("project_name", newProjectName);
        
        projectFiles.forEach(file => {
          // Use webkitRelativePath to maintain folder structure if needed, or file.name for flat
          const path = file.webkitRelativePath || file.name;
          formData.append("files", file, path);
        });

        await uploadFiles(formData, (percent) => {
             // Optional visual progress
             if(percent % 20 === 0) setCreationStep(`Uploading... ${percent}%`);
        });
      }

      setOpenCreateProject(false);
      setNewProjectName('');
      setProjectFiles([]);
      setIndexStatus({
        msg: `Project '${newProjectName}' created and pipeline built successfully!`,
        type: "success"
      });
      
      loadData(); // Refresh the list of containers
    } catch (err) {
      setIndexStatus({ 
        msg: `Failed: ${err.message}`, 
        type: "error" 
      });
    } finally {
      setIsCreatingProject(false);
      setCreationStep('');
    }
  };

  // B. View, Delete, Rename, Upload
  const handleViewFile = async (fileNode) => {
    if (!fileNode || !fileNode.id || fileNode.type !== 'file') return;
    setIsViewingId(fileNode.id);
    try {
      // Pass selectedContainer to get correct download link
      const data = await getDownloadUrl(fileNode.id, selectedContainer);
      window.open(data.url, "_blank");
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsViewingId(null);
    }
  };

  const handleConfirmUpload = async () => {
    if (filesToUpload.length === 0) {
      setUploadError("Please select files.");
      return;
    }
    const destinationPath = currentPath;
    
    setIsUploading(true);
    setUploadError('');
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("destination_folder", destinationPath);
    
    // Pass the project name so backend uploads to the right container
    if (selectedContainer) {
      formData.append("project_name", selectedContainer);
    }

    filesToUpload.forEach(file => {
      const path = file.webkitRelativePath || file.name;
      formData.append("files", file, path);
    });

    try {
      const progressCallback = (percent) => setUploadProgress(percent);
      await uploadFiles(formData, progressCallback);
      handleCloseAddFileDialog();
      
      // Delay slightly for Azure consistency before reloading
      setTimeout(() => {
          loadData(); 
      }, 500);
      
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleOpenDelete = async () => {
    if (!contextMenu?.targetNode) return;
    const nodeToDelete = contextMenu.targetNode;
    handleCloseContextMenu(); 

    const isContainer = nodeToDelete.type === 'container';
    const msg = isContainer 
      ? `DELETE PROJECT "${nodeToDelete.name}"?\n\nWARNING: This will delete the Blob Container and Search Index permanently.` 
      : `Delete "${nodeToDelete.name}"?`;

    if (window.confirm(msg)) {
      setIsDeletingId(nodeToDelete.id || nodeToDelete.name);
      try {
        // Pass project name to delete from correct container
        await deleteItem(
            isContainer ? nodeToDelete.name : nodeToDelete.id, 
            nodeToDelete.type, 
            selectedContainer
        );
        loadData();
      } catch (err) {
        alert(`Error: ${err.message}`);
      } finally {
        setIsDeletingId(null);
      }
    }
  };

  const confirmRename = async () => {
    if (!renamingNodeName.trim() || !nodeToAction) return;
    if (renamingNodeName.trim() === nodeToAction.name) {
      setOpenRenameDialog(false);
      return;
    }
    setIsRenamingId(nodeToAction.id);
    setOpenRenameDialog(false);
    try {
      // Pass project name
      await renameItem(nodeToAction.id, renamingNodeName.trim(), nodeToAction.type, selectedContainer);
      loadData();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsRenamingId(null);
      setNodeToAction(null);
    }
  };

  const handleTriggerIndex = async () => {
    setIndexStatus({ msg: '', type: '' });
    setIsIndexing(true);
    try {
      // ✅ Pass 'selectedContainer' (project name)
      await triggerIndexer(selectedContainer); 
      setIndexStatus({ msg: "Indexer started.", type: "success" });
    } catch (err) {
      setIndexStatus({ msg: err.message, type: "error" });
    } finally {
      setIsIndexing(false);
    }
  };

  // --- Context Menu Logic ---
  const handleContextMenu = (event, item) => {
    event.preventDefault();
    setContextMenu({ mouseX: event.clientX + 2, mouseY: event.clientY - 6, targetNode: item });
  };
  const handleCloseContextMenu = () => setContextMenu(null);
  const handleOpenRename = () => {
    setNodeToAction(contextMenu.targetNode);
    setRenamingNodeName(contextMenu.targetNode.name);
    setOpenRenameDialog(true);
    handleCloseContextMenu();
  };
  const handleOpenView = () => {
    handleViewFile(contextMenu.targetNode);
    handleCloseContextMenu();
  };

  // --- Upload Dialog Logic ---
  const handleOpenUploadDialog = () => {
    setFilesToUpload([]);
    setUploadError('');
    setOpenAddFileDialog(true);
    handleCloseContextMenu();
  };
  const handleCloseAddFileDialog = () => setOpenAddFileDialog(false);
  const handleSelectFiles = (e) => {
    if (e.target.files) setFilesToUpload(Array.from(e.target.files));
    e.target.value = null;
  };


  // --- RENDER ---
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2.5, borderBottom: '1px solid #e2e8f0', flexShrink: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
          Knowledge Base
        </Typography>
      </Box>
      
      {/* Toolbar */}
      <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper' }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          {breadcrumbs.map((crumb, index) => (
             index === breadcrumbs.length - 1 ? 
                <Typography key={index} color="text.primary" sx={{ fontWeight: 500 }}>{crumb.name}</Typography> : 
                <Link key={index} component="button" onClick={() => handleBreadcrumbClick(crumb)} sx={{ cursor: 'pointer', textDecoration: 'none' }}>{crumb.name}</Link>
          ))}
        </Breadcrumbs>
        
        <Stack direction="row" spacing={1}>
           {/* Show "New Project" only in root container view */}
           {viewMode === 'containers' && (
             <Button variant="outlined" size="small" startIcon={<CreateNewFolderIcon />} onClick={() => setOpenCreateProject(true)}>
               New Project
             </Button>
           )}
           
           {/* Show File Operations only when inside a project */}
           {viewMode === 'files' && (
             <>
                <Button variant="outlined" size="small" startIcon={<UploadFileIcon />} onClick={handleOpenUploadDialog}>Upload</Button>
                <Button variant="contained" color="primary" size="small" startIcon={isIndexing ? <CircularProgress size={16} color="inherit" /> : <SyncIcon />} onClick={handleTriggerIndex} disabled={isIndexing}>
                    {isIndexing ? "Updating..." : "Update Index"}
                </Button>
             </>
           )}
         </Stack>
      </Box>

      {/* Main Content Grid */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {indexStatus.msg && (
          <Alert 
            severity={indexStatus.type} 
            onClose={() => setIndexStatus({ msg: '', type: '' })} 
            sx={{ mb: 2 }}
          >
            <AlertTitle>{indexStatus.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
            {indexStatus.msg}
          </Alert>
        )}
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 2, gap: 1 }}>
            <CircularProgress size={20} />
            <Typography sx={{ color: 'text.secondary' }}>Loading...</Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {displayedItems.length === 0 && (
              <Grid item xs={12}>
                <Typography sx={{ p: 2, color: 'text.secondary', textAlign: 'center' }}>
                  {viewMode === 'containers' ? "No projects found. Create one!" : "This folder is empty."}
                </Typography>
              </Grid>
            )}
            
            {displayedItems.map((item, index) => {
                const isContainer = viewMode === 'containers';
                const isDeleting = isDeletingId === (isContainer ? item.name : item.id);
                const isRenaming = isRenamingId === item.id;
                const isDisabled = isDeleting || isRenaming;

                let Icon = InsertDriveFileIcon;
                let iconColor = 'text.secondary';
                if (isContainer) { Icon = StorageIcon; iconColor = 'primary.main'; }
                else if (item.type === 'folder') { Icon = FolderIcon; iconColor = 'primary.main'; }

                return (
                <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                  <Paper
                    variant="outlined"
                    sx={{
                      '&:hover': { bgcolor: isDisabled ? 'transparent' : 'action.hover', cursor: isDisabled ? 'default' : 'pointer' },
                      userSelect: 'none', position: 'relative', opacity: isDisabled ? 0.5 : 1
                    }}
                    onDoubleClick={() => !isDisabled && (isContainer ? handleContainerClick(item.name) : handleItemDoubleClick(item))}
                    onContextMenu={(e) => !isDisabled && handleContextMenu(e, item)}
                  >
                    {isDisabled && (
                      <Box sx={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.7)', zIndex: 1 }}>
                        <CircularProgress size={24} />
                        <Typography variant="caption" sx={{ mt: 1, fontWeight: 'bold' }}>{isDeleting ? "Deleting..." : "Renaming..."}</Typography>
                      </Box>
                    )}
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 2 }}>
                      <Icon sx={{ color: iconColor }} />
                      <Typography variant="body2" noWrap sx={{ fontWeight: 500 }} title={item.name}>
                        {item.name}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>

      {/* --- Context Menu --- */}
      <Menu open={Boolean(contextMenu)} onClose={handleCloseContextMenu} anchorReference="anchorPosition" anchorPosition={contextMenu ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}>
        {contextMenu?.targetNode && [
          contextMenu.targetNode.type === 'file' && <MenuItem key="view" onClick={handleOpenView}><ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>View / Download</MenuItem>,
          contextMenu.targetNode.type !== 'container' && <MenuItem key="rename" onClick={handleOpenRename}><ListItemIcon><DriveFileRenameOutlineIcon fontSize="small" /></ListItemIcon>Rename</MenuItem>,
          <MenuItem key="delete" onClick={handleOpenDelete} sx={{ color: 'error.main' }}><ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>Delete {contextMenu.targetNode.type === 'container' ? "Project" : ""}</MenuItem>
        ]}
      </Menu>

      {/* --- Create Project Dialog (UPDATED for Folder Select) --- */}
      <Dialog open={openCreateProject} onClose={() => !isCreatingProject && setOpenCreateProject(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          {/* Hidden Input for Folder Selection */}
          <input 
            type="file" 
            webkitdirectory="" 
            directory="" 
            ref={createProjectFolderRef} 
            style={{ display: 'none' }} 
            onChange={handleFolderSelectForCreate} 
          />

          <Box sx={{ textAlign: 'center', py: 3 }}>
            <FolderZipIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2, opacity: 0.8 }} />
            
            <Typography variant="body1" sx={{ mb: 3 }}>
              Select a folder to create a new project. The folder name will be used as the project name, and all files will be indexed automatically.
            </Typography>

            {!newProjectName ? (
               <Button 
                 variant="outlined" 
                 size="large" 
                 startIcon={<FolderIcon />} 
                 onClick={() => createProjectFolderRef.current?.click()}
               >
                 Select Project Folder
               </Button>
            ) : (
               <Stack alignItems="center" spacing={2}>
                  <Chip 
                    icon={<CheckCircleIcon />} 
                    label={`Selected: ${newProjectName}`} 
                    color="success" 
                    variant="outlined" 
                    onDelete={() => { setNewProjectName(''); setProjectFiles([]); }}
                  />
                  <Typography variant="caption" color="text.secondary">
                     {projectFiles.length} file(s) ready to upload.
                  </Typography>
               </Stack>
            )}
          </Box>

          {isCreatingProject && (
            <Box sx={{ mt: 2 }}>
                <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>{creationStep}</Typography>
                <LinearProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateProject(false)} disabled={isCreatingProject}>Cancel</Button>
          <Button 
            onClick={handleCreateProject} 
            variant="contained" 
            disabled={!newProjectName || isCreatingProject}
          >
            {isCreatingProject ? "Building Pipeline..." : "Create & Index"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- Upload Dialog (Existing Project) --- */}
      <Dialog open={openAddFileDialog} onClose={handleCloseAddFileDialog} fullWidth maxWidth="sm">
        <DialogTitle>Upload to "{selectedContainer}"</DialogTitle>
        <DialogContent>
          <input type="file" multiple ref={fileInputRef} style={{ display: 'none' }} onChange={handleSelectFiles} />
          <input type="file" webkitdirectory="" directory="" ref={folderInputRef} style={{ display: 'none' }} onChange={(e) => { if(e.target.files) setFilesToUpload(Array.from(e.target.files)); }} />
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
              <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={() => fileInputRef.current?.click()} disabled={isUploading}>Files</Button>
              <Button variant="outlined" startIcon={<FolderZipIcon />} onClick={() => folderInputRef.current?.click()} disabled={isUploading}>Folder</Button>
            </Stack>
            {filesToUpload.length > 0 && (
              <Box sx={{ maxHeight: 150, overflowY: 'auto', bgcolor: 'grey.100', p: 1, borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Selected {filesToUpload.length} file(s)</Typography>
                {filesToUpload.slice(0, 10).map((file, i) => <Chip key={i} size="small" label={file.name} sx={{ m: 0.5 }} />)}
                {filesToUpload.length > 10 && <Typography variant="caption" sx={{ ml: 1 }}>...and {filesToUpload.length - 10} more</Typography>}
              </Box>
            )}
            {uploadError && <Alert severity="error">{uploadError}</Alert>}
            {isUploading && <LinearProgress variant={uploadProgress < 100 ? "determinate" : "indeterminate"} value={uploadProgress} />}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddFileDialog} disabled={isUploading}>Cancel</Button>
          <Button onClick={handleConfirmUpload} variant="contained" disabled={filesToUpload.length === 0 || isUploading}>{isUploading ? "Uploading..." : "Upload"}</Button>
        </DialogActions>
      </Dialog>

      {/* --- Rename Dialog --- */}
      <Dialog open={openRenameDialog} onClose={() => setOpenRenameDialog(false)}>
        <DialogTitle>Rename</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="New Name" fullWidth variant="outlined" value={renamingNodeName} onChange={(e) => setRenamingNodeName(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRenameDialog(false)}>Cancel</Button>
          <Button onClick={confirmRename} variant="contained" disabled={!renamingNodeName.trim()}>Rename</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default KnowledgeBaseManagement;