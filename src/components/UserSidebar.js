// src/components/UserSidebar.js
// import React from "react";
// import {
//   Box,
//   Drawer,
//   Button,
//   Typography,
//   IconButton,
//   Skeleton,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import Tooltip from "@mui/material/Tooltip";

// const SIDEBAR_WIDTH = 260;

// // Loading Skeleton Component
// const ConversationSkeleton = () => (
//   <Box
//     sx={{
//       p: 1.3,
//       mb: 1,
//       borderRadius: "12px",
//       border: "2px solid transparent",
//     }}
//   >
//     <Skeleton
//       variant="text"
//       width="80%"
//       height={20}
//       sx={{ borderRadius: "4px", mb: 0.5 }}
//     />
//     <Skeleton
//       variant="text"
//       width="60%"
//       height={16}
//       sx={{ borderRadius: "4px" }}
//     />
//   </Box>
// );

// const UserSidebar = ({
//   conversations = [],
//   onNewChat = () => {},
//   onSelectConversation = () => {},
//   onDeleteConversation = () => {},
//   currentConversationId,
//   appBarHeight,
//   isLoading = false, // NEW PROP
// }) => {
//   return (
//     <Drawer
//       variant="permanent"
//       anchor="left"
//       sx={{
//         width: SIDEBAR_WIDTH,
//         flexShrink: 0,
//         "& .MuiDrawer-paper": {
//           width: SIDEBAR_WIDTH,
//           top: appBarHeight,
//           height: `calc(100vh - ${appBarHeight}px)`,
//           boxSizing: "border-box",
//           bgcolor: "#ffffff",
//           borderRight: "1px solid #e5e7eb",
//           display: "flex",
//           flexDirection: "column",
//         },
//       }}
//     >
//       {/* Conversation List */}
//       <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
//         {isLoading ? (
//           // Show skeleton loaders while loading
//           <>
//             <ConversationSkeleton />
//             <ConversationSkeleton />
//             <ConversationSkeleton />
//             <ConversationSkeleton />
//             <ConversationSkeleton />
//           </>
//         ) : conversations.length === 0 ? (
//           // Empty state
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               height: "100%",
//               px: 2,
//               textAlign: "center",
//             }}
//           >
//             <Typography
//               sx={{
//                 fontSize: "0.9rem",
//               color: "#94a3b8",
//                 mb: 1,
//             }}
//           >
//               No conversations yet
//             </Typography>
//             <Typography
//               sx={{
//                 fontSize: "0.75rem",
//                 color: "#cbd5e1",
//               }}
//             >
//               Start a new chat to begin
//             </Typography>
//           </Box>
//         ) : (
//           // Actual conversations
//           conversations.map((conv) => (
//             <Box
//               key={conv.conversation_uuid}
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 p: 1.3,
//                 mb: 1,
//                 borderRadius: "12px",
//                 cursor: "pointer",
//                 transition: "0.2s ease",
//                 bgcolor:
//                   currentConversationId === conv.conversation_uuid
//                     ? "rgba(102, 126, 234, 0.12)"
//                     : "transparent",
//                 border: "2px solid",
//                 borderColor:
//                   currentConversationId === conv.conversation_uuid
//                     ? "rgba(102, 126, 234, 0.3)"
//                     : "transparent",
//                 "&:hover": {
//                   bgcolor: "#f8fafc",
//                   borderColor: "#e2e8f0",
//                   "& .delete-icon": {
//                     opacity: 1,
//                     visibility: "visible",
//                     transform: "translateX(0px)",
//                   },
//                 },
//               }}
//             >
//               {/* Chat Row */}
//               <Box
//                 onClick={() => onSelectConversation(conv.conversation_uuid)}
//                 sx={{ flexGrow: 1, minWidth: 0 }}
//               >
//               <Tooltip title={conv.topic} placement="right" arrow>
//                 <Typography
//                   sx={{
//                     fontWeight: 600,
//                       fontSize: "0.88rem",
//                       color:
//                         currentConversationId === conv.conversation_uuid
//                           ? "#667eea"
//                           : "#1e293b",
//                     whiteSpace: "nowrap",
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                       cursor: "default",
//                   }}
//                 >
//                   {conv.topic}
//                 </Typography>
//               </Tooltip>

//               <Typography
//                 sx={{
//                     fontSize: "0.72rem",
//                   color: "#94a3b8",
//                     mt: 0.3,
//                     whiteSpace: "nowrap",
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                 }}
//               >
//                   {new Date(conv.startDate).toLocaleDateString("en-US", {
//                     month: "short",
//                     day: "numeric",
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//               </Typography>
//               </Box>

//               {/* Delete Button */}
//               <IconButton
//                 className="delete-icon"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onDeleteConversation(conv.conversation_uuid);
//                 }}
//                 sx={{
//                   ml: 1,
//                   opacity: 0,
//                   visibility: "hidden",
//                   transform: "translateX(6px)",
//                   transition: "all 0.25s ease",
//                   width: 28,
//                   height: 28,
//                   borderRadius: "50%",
//                   backgroundColor: "transparent",
//                   "&:hover": {
//                     backgroundColor: "#ffecec",
//                   },
//                   "& .MuiSvgIcon-root": {
//                     fontSize: 18,
//                     color: "#ef4444",
//                   },
//                 }}
//               >
//                 <DeleteOutlineIcon />
//               </IconButton>
//             </Box>
//           ))
//         )}
//       </Box>

//       {/* New Chat Button */}
//       <Box sx={{ p: 2, borderTop: "1px solid #f1f5f9" }}>
//         <Button
//           fullWidth
//           onClick={onNewChat}
//           disabled={isLoading} // Disable while loading
//           startIcon={<AddIcon />}
//           sx={{
//             background: isLoading
//               ? "#e2e8f0"
//               : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//             color: isLoading ? "#94a3b8" : "white",
//             textTransform: "none",
//             borderRadius: "12px",
//             py: 1.5,
//             fontSize: "0.95rem",
//             fontWeight: 600,
//             boxShadow: isLoading ? "none" : "0 4px 12px rgba(102, 126, 234, 0.3)",
//             "&:hover": {
//               background: isLoading
//                 ? "#e2e8f0"
//                 : "linear-gradient(135deg, #5568d3 0%, #6941a8 100%)",
//               transform: isLoading ? "none" : "translateY(-2px)",
//             },
//             "&.Mui-disabled": {
//               color: "#94a3b8",
//             },
//           }}
//         >
//           New chat
//         </Button>
//       </Box>
//     </Drawer>
//   );
// };

// export default UserSidebar;
// src/components/UserSidebar.js
// import React from "react";
// import {
//   Box,
//   Drawer,
//   Button,
//   Typography,
//   IconButton,
//   Skeleton,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import Tooltip from "@mui/material/Tooltip";

// const SIDEBAR_WIDTH = 260;

// // Loading Skeleton Component
// const ConversationSkeleton = () => (
//   <Box
//     sx={{
//       p: 1.3,
//       mb: 1,
//       borderRadius: "12px",
//       border: "2px solid transparent",
//     }}
//   >
//     <Skeleton
//       variant="text"
//       width="80%"
//       height={20}
//       sx={{ borderRadius: "4px", mb: 0.5 }}
//     />
//     <Skeleton
//       variant="text"
//       width="60%"
//       height={16}
//       sx={{ borderRadius: "4px" }}
//     />
//   </Box>
// );

// const UserSidebar = ({
//   conversations = [],
//   onNewChat = () => {},
//   onSelectConversation = () => {},
//   onDeleteConversation = () => {},
//   currentConversationId,
//   appBarHeight,
//   isLoading = false, // NEW PROP
// }) => {
//   return (
//     <Drawer
//       variant="permanent"
//       anchor="left"
//       sx={{
//         width: SIDEBAR_WIDTH,
//         flexShrink: 0,
//         "& .MuiDrawer-paper": {
//           width: SIDEBAR_WIDTH,
//           top: appBarHeight,
//           height: `calc(100vh - ${appBarHeight}px)`,
//           boxSizing: "border-box",
//           bgcolor: "#ffffff",
//           borderRight: "1px solid #e5e7eb",
//           display: "flex",
//           flexDirection: "column",
//         },
//       }}
//     >
//       {/* Conversation List */}
//       <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
//         {isLoading ? (
//           // Show skeleton loaders while loading
//           <>
//             <ConversationSkeleton />
//             <ConversationSkeleton />
//             <ConversationSkeleton />
//             <ConversationSkeleton />
//             <ConversationSkeleton />
//           </>
//         ) : conversations.length === 0 ? (
//           // Empty state
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               height: "100%",
//               px: 2,
//               textAlign: "center",
//             }}
//           >
//             <Typography
//               sx={{
//                 fontSize: "0.9rem",
//               color: "#94a3b8",
//                 mb: 1,
//             }}
//           >
//               No conversations yet
//             </Typography>
//             <Typography
//               sx={{
//                 fontSize: "0.75rem",
//                 color: "#cbd5e1",
//               }}
//             >
//               Start a new chat to begin
//             </Typography>
//           </Box>
//         ) : (
//           // Actual conversations
//           conversations.map((conv) => (
//             <Box
//               key={conv.conversation_uuid}
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 p: 1.3,
//                 mb: 1,
//                 borderRadius: "12px",
//                 cursor: "pointer",
//                 transition: "0.2s ease",
//                 bgcolor:
//                   currentConversationId === conv.conversation_uuid
//                     ? "rgba(102, 126, 234, 0.12)"
//                     : "transparent",
//                 border: "2px solid",
//                 borderColor:
//                   currentConversationId === conv.conversation_uuid
//                     ? "rgba(102, 126, 234, 0.3)"
//                     : "transparent",
//                 "&:hover": {
//                   bgcolor: "#f8fafc",
//                   borderColor: "#e2e8f0",
//                   "& .delete-icon": {
//                     opacity: 1,
//                     visibility: "visible",
//                     transform: "translateX(0px)",
//                   },
//                 },
//               }}
//             >
//               {/* Chat Row */}
//               <Box
//                 onClick={() => onSelectConversation(conv.conversation_uuid)}
//                 sx={{ flexGrow: 1, minWidth: 0 }}
//               >
//                 <Tooltip title={conv.topic} placement="right" arrow>
//                   <Typography
//                     sx={{
//                       fontWeight: 600,
//                       fontSize: "0.88rem",
//                       color:
//                         currentConversationId === conv.conversation_uuid
//                           ? "#667eea"
//                           : "#1e293b",
//                       whiteSpace: "nowrap",
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                       cursor: "default",
//                     }}
//                   >
//                     {conv.topic}
//                   </Typography>
//                 </Tooltip>

//                 <Typography
//                   sx={{
//                     fontSize: "0.72rem",
//                     color: "#94a3b8",
//                     mt: 0.3,
//                     whiteSpace: "nowrap",
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                   }}
//                 >
//                   {new Date(conv.startDate).toLocaleDateString("en-US", {
//                     month: "short",
//                     day: "numeric",
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </Typography>
//               </Box>

//               {/* Delete Button */}
//               <IconButton
//                 className="delete-icon"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onDeleteConversation(conv.conversation_uuid);
//                 }}
//                 sx={{
//                   ml: 1,
//                   opacity: 0,
//                   visibility: "hidden",
//                   transform: "translateX(6px)",
//                   transition: "all 0.25s ease",
//                   width: 28,
//                   height: 28,
//                   borderRadius: "50%",
//                   backgroundColor: "transparent",
//                   "&:hover": {
//                     backgroundColor: "#ffecec",
//                   },
//                   "& .MuiSvgIcon-root": {
//                     fontSize: 18,
//                     color: "#ef4444",
//                   },
//                 }}
//               >
//                 <DeleteOutlineIcon />
//               </IconButton>
//             </Box>
//           ))
//         )}
//       </Box>

//       {/* New Chat Button */}
//       <Box sx={{ p: 2, borderTop: "1px solid #f1f5f9" }}>
//         <Button
//           fullWidth
//           onClick={onNewChat}
//           disabled={isLoading} // Disable while loading
//           startIcon={<AddIcon />}
//           sx={{
//             background: isLoading
//               ? "#e2e8f0"
//               : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//             color: isLoading ? "#94a3b8" : "white",
//             textTransform: "none",
//             borderRadius: "12px",
//             py: 1.5,
//             fontSize: "0.95rem",
//             fontWeight: 600,
//             boxShadow: isLoading ? "none" : "0 4px 12px rgba(102, 126, 234, 0.3)",
//             "&:hover": {
//               background: isLoading
//                 ? "#e2e8f0"
//                 : "linear-gradient(135deg, #5568d3 0%, #6941a8 100%)",
//               transform: isLoading ? "none" : "translateY(-2px)",
//             },
//             "&.Mui-disabled": {
//               color: "#94a3b8",
//             },
//           }}
//         >
//           New chat
//         </Button>
//       </Box>
//     </Drawer>
//   );
// };

// export default UserSidebar;

//src/components/UserSidebar.js */
import React from "react";
import {
  Box,
  Drawer,
  Button,
  Typography,
  IconButton,
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Tooltip from "@mui/material/Tooltip";
import AccountTreeIcon from '@mui/icons-material/AccountTree';

const SIDEBAR_WIDTH = 260;

// ❌ REMOVED: export const PROJECT_OPTIONS = [...] 
// We no longer hardcode this.

// Loading Skeleton Component
const ConversationSkeleton = () => (
  <Box sx={{ p: 1.3, mb: 1, borderRadius: "12px", border: "2px solid transparent" }}>
    <Skeleton variant="text" width="80%" height={20} sx={{ borderRadius: "4px", mb: 0.5 }} />
    <Skeleton variant="text" width="60%" height={16} sx={{ borderRadius: "4px" }} />
  </Box>
);

const UserSidebar = ({
  conversations = [],
  onNewChat = () => {},
  onSelectConversation = () => {},
  onDeleteConversation = () => {},
  currentConversationId,
  appBarHeight,
  isLoading = false,
  selectedProject,
  onSelectProject,
  projects = [] // ✅ NEW: Receive dynamic projects list as prop
}) => {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: SIDEBAR_WIDTH,
          top: appBarHeight,
          height: `calc(100vh - ${appBarHeight}px)`,
          boxSizing: "border-box",
          bgcolor: "#ffffff",
          borderRight: "1px solid #e5e7eb",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* --- Dynamic Project Selector --- */}
      <Box sx={{ p: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="project-select-label">Select Project</InputLabel>
          <Select
            labelId="project-select-label"
            value={selectedProject || ""} // Handle empty state safely
            label="Select Project"
            onChange={(e) => onSelectProject(e.target.value)}
            sx={{
                borderRadius: '10px',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' }
            }}
          >
            {/* Logic: Map through the fetched projects instead of hardcoded options */}
            {projects.length > 0 ? (
              projects.map((project) => (
<MenuItem key={project.project_uuid} value={project.project_uuid} sx={{ gap: 1.5 }}>
  <AccountTreeIcon sx={{ fontSize: 18, color: "#64748b" }} />
  {project.display_name}  {/* Use display_name instead of name */}
</MenuItem>
              ))
            ) : (
              <MenuItem disabled>Loading Projects...</MenuItem>
            )}
          </Select>
        </FormControl>
      </Box>
      
      <Divider sx={{ mb: 1, mx: 2 }} />

      {/* Conversation List */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2, pt: 0 }}>
        {isLoading ? (
          <>
            <ConversationSkeleton />
            <ConversationSkeleton />
            <ConversationSkeleton />
          </>
        ) : conversations.length === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", px: 2, textAlign: "center" }}>
            <Typography sx={{ fontSize: "0.9rem", color: "#94a3b8", mb: 1 }}>No conversations</Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "#cbd5e1" }}>
              {projects.length === 0 ? "No projects found" : "Select a project and start chatting"}
            </Typography>
          </Box>
        ) : (
          conversations.map((conv) => (
            <Box
              key={conv.conversation_uuid}
              sx={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                p: 1.3, mb: 1, borderRadius: "12px", cursor: "pointer", transition: "0.2s ease",
                bgcolor: currentConversationId === conv.conversation_uuid ? "rgba(102, 126, 234, 0.12)" : "transparent",
                border: "2px solid",
                borderColor: currentConversationId === conv.conversation_uuid ? "rgba(102, 126, 234, 0.3)" : "transparent",
                "&:hover": { bgcolor: "#f8fafc", borderColor: "#e2e8f0", "& .delete-icon": { opacity: 1, visibility: "visible", transform: "translateX(0px)" } },
              }}
            >
              <Box onClick={() => onSelectConversation(conv.conversation_uuid)} sx={{ flexGrow: 1, minWidth: 0 }}>
                <Tooltip title={conv.topic} placement="right" arrow>
                  <Typography sx={{ fontWeight: 600, fontSize: "0.88rem", color: currentConversationId === conv.conversation_uuid ? "#667eea" : "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {conv.topic}
                  </Typography>
                </Tooltip>
                <Typography sx={{ fontSize: "0.72rem", color: "#94a3b8", mt: 0.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {new Date(conv.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </Typography>
              </Box>
              <IconButton className="delete-icon" onClick={(e) => { e.stopPropagation(); onDeleteConversation(conv.conversation_uuid); }} sx={{ ml: 1, opacity: 0, visibility: "hidden", transform: "translateX(6px)", transition: "all 0.25s ease", width: 28, height: 28, borderRadius: "50%", "&:hover": { backgroundColor: "#ffecec" }, "& .MuiSvgIcon-root": { fontSize: 18, color: "#ef4444" } }}>
                <DeleteOutlineIcon />
              </IconButton>
            </Box>
          ))
        )}
      </Box>

      {/* New Chat Button */}
      <Box sx={{ p: 2, borderTop: "1px solid #f1f5f9" }}>
        <Button
          fullWidth
          onClick={onNewChat}
          disabled={isLoading || !selectedProject} // Disable if no project selected
          startIcon={<AddIcon />}
          sx={{
            background: isLoading ? "#e2e8f0" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: isLoading ? "#94a3b8" : "white",
            textTransform: "none", borderRadius: "12px", py: 1.5, fontSize: "0.95rem", fontWeight: 600,
            boxShadow: isLoading ? "none" : "0 4px 12px rgba(102, 126, 234, 0.3)",
            "&:hover": { background: isLoading ? "#e2e8f0" : "linear-gradient(135deg, #5568d3 0%, #6941a8 100%)", transform: isLoading ? "none" : "translateY(-2px)" },
          }}
        >
          Ask Svayam
        </Button>
      </Box>
    </Drawer>
  );
};

export default UserSidebar;