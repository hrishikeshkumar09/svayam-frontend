// // src/components/Chatbot/ChatMessage.js
// import React from 'react';
// import { Box, Typography, Paper, Avatar } from '@mui/material';
// import PersonIcon from '@mui/icons-material/Person';
// import SmartToyIcon from '@mui/icons-material/SmartToy';
// import ReactMarkdown from "react-markdown";

// const ChatMessage = ({ message, sender, timestamp }) => {
//   const isUser = sender === "user";

//   const formatTime = (t) => {
//     if (!t) return "";
//     return new Date(t).toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: isUser ? "flex-end" : "flex-start",
//         alignItems: "flex-end",
//         mb: 2.5,
//         gap: 1.5,
//         px: 2,
//         width: "100%",
//       }}
//     >
//       {/* Assistant Avatar - Left Side */}
//       {!isUser && (
//         <Avatar 
//           sx={{ 
//             background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//             width: 36, 
//             height: 36,
//             boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
//             flexShrink: 0,
//           }}
//         >
//           <SmartToyIcon sx={{ fontSize: 20 }} />
//         </Avatar>
//       )}

//       {/* Message Content */}
//       <Box sx={{ maxWidth: "70%", display: "flex", flexDirection: "column" }}>
//         <Paper
//           elevation={0}
//           sx={{
//             p: 2,
//             background: isUser
//               ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
//               : "#ffffff",
//             color: isUser ? "white" : "#1e293b",
//             borderRadius: isUser
//               ? "16px 16px 4px 16px"
//               : "16px 16px 16px 4px",
//             border: isUser ? "none" : "1px solid #e5e7eb",
//             boxShadow: isUser 
//               ? "0 4px 12px rgba(102, 126, 234, 0.25)" 
//               : "0 1px 3px rgba(0,0,0,0.08)",
//             width: "fit-content",
//             maxWidth: "100%",
//             overflowWrap: "break-word",
//             transition: "all 0.2s ease",
//             "&:hover": {
//               boxShadow: isUser 
//                 ? "0 6px 16px rgba(102, 126, 234, 0.35)" 
//                 : "0 2px 8px rgba(0,0,0,0.12)",
//             },
//           }}
//         >
//           {/* <Typography
//             sx={{
//               whiteSpace: "pre-wrap",
//               wordBreak: "break-word",
//               fontSize: "0.95rem",
//               lineHeight: 1.6,
//               fontWeight: isUser ? 500 : 400,
//             }}
//           >
//             {message}
//           </Typography> */}
//           <ReactMarkdown
//   components={{
//     p: ({node, ...props}) => (
//       <Typography
//         {...props}
//         sx={{
//           fontSize: "0.95rem",
//           lineHeight: 1.6,
//           fontWeight: isUser ? 500 : 400,
//           mb: 1
//         }}
//       />
//     ),
//   }}
// >
//   {message}
// </ReactMarkdown>

//         </Paper>

//         {/* Timestamp */}
//         <Typography
//           variant="caption"
//           sx={{
//             display: "block",
//             mt: 0.75,
//             color: "#94a3b8",
//             textAlign: isUser ? "right" : "left",
//             px: 1,
//             fontSize: "0.7rem",
//             fontWeight: 500,
//           }}
//         >
//           {formatTime(timestamp)}
//         </Typography>
//       </Box>

//       {/* User Avatar - Right Side */}
//       {isUser && (
//         <Avatar 
//           sx={{ 
//             background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//             width: 36, 
//             height: 36,
//             boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
//             flexShrink: 0,
//           }}
//         >
//           <PersonIcon sx={{ fontSize: 20 }} />
//         </Avatar>
//       )}
//     </Box>
//   );
// };

// export default ChatMessage;

// src/components/Chatbot/ChatMessage.js
import React from 'react';
import { Box, Typography, Paper, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ReactMarkdown from "react-markdown";

const formatTime = (t) => {
  if (!t) return "";
  try {
    return new Date(t).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    // If t is already formatted (e.g., "09:11 AM"), new Date() might fail.
    // In that case, just return t as is.
    return t;
  }
};

const ChatMessage = ({ message, sender, timestamp }) => {
  const isUser = sender === "user";

  // // ✅ SAFETY CHECK: Ensure message is always a string.
  // // This prevents ReactMarkdown from crashing if message is null/undefined/object
  // let safeMessage = typeof message === 'string' ? message : "";

  // if (!isUser) {
  //     // Remove backend tags if they leaked through
  //     safeMessage = safeMessage.replace(/^(GREETING|QUERY|QUERY_PROCESSING)\s*/i, "");
  //     // Remove JSON artifacts
  //     safeMessage = safeMessage.replace(/\{.*"answer_status".*\}/gs, "");
  // }

  // const formatTime = (t) => {
  //   if (!t) return "";
  //   return new Date(t).toLocaleTimeString("en-US", {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });
  // };

  // --- SAFE CLEANING LOGIC START ---
  const getDisplayMessage = () => {
    // 1. Safety Check: If message is null/undefined, return empty string
    if (!message) return "";

    // 2. Ensure it's a string
    let text = typeof message === 'string' ? message : String(message);

    // 3. Clean ONLY if it's from the bot
    if (!isUser) {
        // Fix 1: Catch "_PROCESSING", "PROCESSING", "QUERY", or "GREETING"
        text = text.replace(/^(_?PROCESSING|QUERY(_PROCESSING)?|GREETING|QUERY)\s*/i, "");

        // Fix 2: Remove the JSON object content first
        text = text.replace(/\{[\s\S]*?"answer_status"[\s\S]*?\}/gi, "");
        
        // Fix 3: Remove Markdown artifacts
        text = text.replace(/```json[\s\S]*?```/gi, "");
        text = text.replace(/```json/gi, ""); 
        text = text.replace(/```/g, ""); 
    }

    return text.trim();
  };

  const safeMessage = getDisplayMessage();
  // --- SAFE CLEANING LOGIC END ---

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        alignItems: "flex-end",
        mb: 2.5,
        gap: 1.5,
        px: 2,
        width: "100%",
      }}
    >
      {/* Assistant Avatar */}
      {!isUser && (
        <Avatar 
          sx={{ 
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            width: 36, 
            height: 36,
            boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
            flexShrink: 0,
          }}
        >
          <SmartToyIcon sx={{ fontSize: 20 }} />
        </Avatar>
      )}

      {/* Message Bubble */}
      <Box sx={{ maxWidth: "70%", display: "flex", flexDirection: "column" }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            background: isUser
              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              : "#ffffff",
            color: isUser ? "white" : "#1e293b",
            borderRadius: isUser
              ? "16px 16px 4px 16px"
              : "16px 16px 16px 4px",
            border: isUser ? "none" : "1px solid #e5e7eb",
            boxShadow: isUser 
              ? "0 4px 12px rgba(102, 126, 234, 0.25)" 
              : "0 1px 3px rgba(0,0,0,0.08)",
            width: "fit-content",
            maxWidth: "100%",
            overflowWrap: "break-word",
            transition: "all 0.2s ease",
            "&:hover": {
              boxShadow: isUser 
                ? "0 6px 16px rgba(102, 126, 234, 0.35)" 
                : "0 2px 8px rgba(0,0,0,0.12)",
            },
          }}
        >
          {safeMessage ? (
            <ReactMarkdown
              components={{
                p: ({node, ...props}) => (
                  <Typography
                    {...props}
                    sx={{
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      fontWeight: isUser ? 500 : 400,
                      mb: 0 // Remove bottom margin for paragraphs inside bubble
                    }}
                  />
                ),
                a: ({node, ...props}) => (
                  <a {...props} style={{ color: isUser ? '#fff' : '#2563eb', textDecoration: 'underline' }} />
                ),
                code: ({node, inline, ...props}) => (
                  <code 
                    {...props} 
                    style={{ 
                      backgroundColor: isUser ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
                      padding: '2px 4px',
                      borderRadius: '4px',
                      fontFamily: 'monospace'
                    }} 
                  />
                )
              }}
            >
              {safeMessage}
            </ReactMarkdown>
          ) : (
            // Fallback for empty/null messages
            <Typography sx={{ fontStyle: 'italic', opacity: 0.7 }}>
              (Empty message)
            </Typography>
          )}
        </Paper>

        {/* Timestamp */}
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 0.75,
            color: "#94a3b8",
            textAlign: isUser ? "right" : "left",
            px: 1,
            fontSize: "0.7rem",
            fontWeight: 500,
          }}
        >
          {formatTime(timestamp)}
        </Typography>
      </Box>

      {/* User Avatar */}
      {isUser && (
        <Avatar 
          sx={{ 
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            width: 36, 
            height: 36,
            boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
            flexShrink: 0,
          }}
        >
          <PersonIcon sx={{ fontSize: 20 }} />
        </Avatar>
      )}
    </Box>
  );
};

export default ChatMessage;