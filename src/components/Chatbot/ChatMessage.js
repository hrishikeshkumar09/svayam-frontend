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
import { deepPurple, indigo } from '@mui/material/colors';
import { Box, Typography, Paper, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ReactMarkdown from "react-markdown";

// const formatTime = (t) => {
//   if (!t) return "";
//   try {
//     return new Date(t).toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   } catch (e) {
//     // If t is already formatted (e.g., "09:11 AM"), new Date() might fail.
//     // In that case, just return t as is.
//     return t;
//   }
// };

// Time Formatting Helper
const formatTime = (t) => {
  if (!t) return "";
  try {
    let dateStr = t;
    if (typeof t === 'string' && t.includes('T') && !t.endsWith('Z') && !t.includes('+')) {
        dateStr += 'Z'; 
    }
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return t;
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch (e) {
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

    let safeMessage = "";

    // 2. Ensure it's a string
    let text = typeof message === 'string' ? message : String(message);

    // 3. Clean ONLY if it's from the bot
    if (!isUser) {

        let references = "";
        
        // Search for "References:" or "Sources:" allowing for emojis (📚, 📁), bolding (**), or newlines before it.
        // We use a broader match to catch the specific icon used in your screenshots.
        const refRegex = /(\n|\r\n)?\s*.{0,5}\s*(\*\*|__)?(References|Sources)(\*\*|__)?\s*:\s*[\s\S]*$/i;
        const refMatch = text.match(refRegex);
        
        if (refMatch) {
            references = refMatch[0]; // Save the whole references block
            text = text.substring(0, refMatch.index).trim(); // Remove it from main text for now
        }

        // --- 2. EXPLICIT LOOP CUT (FOUND) ---
        // If "FOUND" followed by a Capital Letter exists, cut it immediately.
        const foundMatch = text.match(/(\.|!|\?)?\s*FOUND\s*([A-Z])/);
        if (foundMatch) {
            text = text.substring(0, foundMatch.index + (foundMatch[1] ? 1 : 0)).trim(); 
        }

        // --- 3. ECHO CUT (Question? Answer) ---
        // If the text starts with "Question?Answer", remove the question.
        // We look for a '?' followed immediately by a Capital Letter within the first 300 chars.
        const echoMatch = text.match(/^[\s\S]{0,300}?\?(\s*[A-Z])/);
        if (echoMatch) {
             // Keep the letter (Group 1), discard the '?' and text before it.
             const keepIndex = echoMatch.index + echoMatch[0].length - echoMatch[1].length;
             text = text.substring(keepIndex).trim();
        }

        // --- 4. IMPLICIT LOOP CUT (Repetition Check) ---
        // This fixes the "First sentence repeating at the last" issue.
        // Logic: Take the first 60 chars (approx one sentence). If they appear again later, cut there.
        if (text.length > 150) { // Only run on long messages
             const startFingerprint = text.substring(0, 60);
             // Search for this fingerprint starting from index 60
             const repeatIndex = text.indexOf(startFingerprint, 60);
             
             if (repeatIndex !== -1) {
                 // We found the start text repeated later! Cut everything after.
                 text = text.substring(0, repeatIndex).trim();
             }
        }


        // Fix 1: Catch "_PROCESSING", "PROCESSING", "QUERY", or "GREETING"
        text = text.replace(/^(_?PROCESSING|QUERY(_PROCESSING)?|GREETING|QUERY)\s*/i, "");
        text = text.replace(/\.FOUND/g, ". ");
        // Fix 2: Remove the JSON object content first
        text = text.replace(/\{[\s\S]*?"answer_status"[\s\S]*?\}/gi, "");
        
        // Fix 3: Remove Markdown artifacts
        text = text.replace(/```json[\s\S]*?```/gi, "");
        text = text.replace(/```json/gi, ""); 
        text = text.replace(/```/g, "");
        text = text.replace(/\.FOUND/g, ". ");

        // --- ✅ FIX 4: Deduplicate Repeated Sentences ---
        // This catches "Sentence.Sentence." or "Sentence. Sentence."
        // It looks for a sequence of characters ending in a dot, followed immediately by itself.
        //text = text.replace(/([^\.]+\.)\s*\1/g, "$1");
        
        // if (foundMatch) {
        //     const splitIndex = foundMatch.index;
        //     // Get the text AFTER "FOUND" to see if it's a duplicate
        //     const afterFound = text.substring(splitIndex + foundMatch[0].length - 1); // -1 to keep the start letter
            
        //     // If the message STARTS with the same text as what's AFTER "FOUND", it's a loop.
        //     // We check the first 20 chars to be safe.
        //     if (afterFound.length > 10 && text.startsWith(afterFound.substring(0, 20))) {
        //         // CUT IT OFF: Keep only the text before "FOUND"
        //         text = text.substring(0, splitIndex + 1).trim(); 
        //     }
        // }

        // 3. Sentence Deduplication (Cleanup for other small repetitions)
         
        // const sentences = text.split(/(?<=\.)\s+/g); 
        // const uniqueSentences = new Set();
        // const cleanSentences = [];

        // sentences.forEach(s => {
        //      const trimmed = s.trim();
        //      if (trimmed && !uniqueSentences.has(trimmed)) {
        //          uniqueSentences.add(trimmed);
        //          cleanSentences.push(trimmed);
        //      }
        // });

        // text = cleanSentences.join(" ");

        // --- STEP C: RESTORE REFERENCES ---
        if (references) {
            // Append the saved references back to the clean text
            text = text + "\n\n" + references.trim();
        }
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
        position: "relative",
        zIndex: 2,
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
      {/* Message Bubble Wrapper */}
      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: "column",
          // ✅ FIX 1: Constraint width here, on the wrapper
          maxWidth: "80%", 
          // Align items to match the side (user=right, bot=left)
          alignItems: isUser ? "flex-end" : "flex-start" 
        }}
      ></Box>
      <Box sx={{ maxWidth: "75%", display: "flex", flexDirection: "column" }}>
        <Paper
          elevation={1}
          sx={{
            // p: 2,
            // background: isUser
            //   ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            //   : "#ffffff",
            // color: isUser ? "white" : "#1e293b",
            // borderRadius: isUser
            //   ? "16px 16px 4px 16px"
            //   : "16px 16px 16px 4px",
            // border: isUser ? "none" : "1px solid #e5e7eb",
            // boxShadow: isUser 
            //   ? "0 4px 12px rgba(102, 126, 234, 0.25)" 
            //   : "0 1px 3px rgba(0,0,0,0.08)",
            // width: "fit-content",
            // maxWidth: "100%",
            // overflowWrap: "break-word",
            // transition: "all 0.2s ease",
            // "&:hover": {
            //   boxShadow: isUser 
            //     ? "0 6px 16px rgba(102, 126, 234, 0.35)" 
            //     : "0 2px 8px rgba(0,0,0,0.12)",
            // },
            p: 2,
            // ✅ FIX 2: "fit-content" stops it from squishing short text
            width: "auto", 
            // ✅ FIX 3: Allow it to grow wider (85% of screen)
            maxWidth: "100%",
            //maxWidth: "75%",
            borderRadius: 3,
            // ✅ FIX 2: Solid Colors (Not Transparent)
            // User = Indigo, AI = Pure White
            bgcolor: isUser ? indigo[600] : "#ffffff", 
            color: isUser ? "#fff" : "#1e293b",
            borderTopRightRadius: isUser ? 0 : 12,
            borderTopLeftRadius: !isUser ? 0 : 12,
            // ✅ FIX 3: Add border to separate white card from white background
            border: isUser ? "none" : "1px solid #e2e8f0",
            boxShadow: isUser ? "none" : "0 2px 4px rgba(0,0,0,0.05)",
            wordBreak: "break-word",
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