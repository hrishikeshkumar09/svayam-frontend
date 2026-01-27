// src/components/Chatbot/ChatMessage.js
import React from "react";
import { deepPurple, indigo } from "@mui/material/colors";
import { Box, Typography, Paper, Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ReactMarkdown from "react-markdown";
import { Chip } from "@mui/material";

// Time Formatting Helper
const formatTime = (t) => {
  if (!t) return "";
  try {
    let dateStr = t;
    if (
      typeof t === "string" &&
      t.includes("T") &&
      !t.endsWith("Z") &&
      !t.includes("+")
    ) {
      dateStr += "Z";
    }
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return t;
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch (e) {
    return t;
  }
};
const isResolutionPrompt = (text = "") =>
  /is your issue resolved\??/i.test(text.trim());

const ChatMessage = ({ message, sender, timestamp, onResolved }) => {
  const isUser = sender === "user";

  const getDisplayMessage = () => {
    // 1. Safety Check: If message is null/undefined, return empty string
    if (!message) return "";

    let safeMessage = "";

    // 2. Ensure it's a string
    let text = typeof message === "string" ? message : String(message);

    // 3. Clean ONLY if it's from the bot
    if (!isUser) {
      const artifactMatch = text.match(/FOUND([A-Z0-9])/);

      if (artifactMatch) {
        // Found it!
        // We take everything starting AFTER "FOUND" (index + 5).
        // We return immediately to avoid any further regex modifying the content.
        return text.substring(artifactMatch.index + 5).trim();
      } else {
        // ⚠️ FALLBACK: "FOUND" was not detected.
        // We must manually remove the JSON object if it exists.
        text = text.replace(/\{[\s\S]*?"answer_status"[\s\S]*?\}/gi, "");
      }

      // 1. Remove Processing/Query tags
      text = text.replace(
        /^(_?PROCESSING|QUERY(_PROCESSING)?|GREETING|QUERY)\s*/i,
        "",
      );

      // 2. Remove Markdown Code Block Wrappers
      text = text.replace(/```json[\s\S]*?```/gi, "");
      text = text.replace(/```json/gi, "");
      text = text.replace(/```/g, "");

      // // 3. Remove stray closing braces from JSON
      // text = text.replace(/\s*\}\s*$/, "");

      // --- STEP C: FORMATTING ---
      text = text.trim();

      // Basic sentence deduplication for non-FOUND messages (optional safety)
      //text = text.replace(/([^\.]+\.)\s*\1/g, "$1");
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
          alignItems: isUser ? "flex-end" : "flex-start",
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
                p: ({ node, ...props }) => (
                  <Typography
                    {...props}
                    sx={{
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      fontWeight: isUser ? 500 : 400,
                      mb: 0, // Remove bottom margin for paragraphs inside bubble
                    }}
                  />
                ),
                a: ({ node, ...props }) => (
                  <a
                    {...props}
                    style={{
                      color: isUser ? "#fff" : "#2563eb",
                      textDecoration: "underline",
                    }}
                  />
                ),
                code: ({ node, inline, ...props }) => (
                  <code
                    {...props}
                    style={{
                      backgroundColor: isUser
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(0,0,0,0.05)",
                      padding: "2px 4px",
                      borderRadius: "4px",
                      fontFamily: "monospace",
                    }}
                  />
                ),
              }}
            >
              {safeMessage}
            </ReactMarkdown>
          ) : (
            // Fallback for empty/null messages
            <Typography sx={{ fontStyle: "italic", opacity: 0.7 }}>
              (Empty message)
            </Typography>
          )}
        </Paper>
        {/* Resolution Actions */}
        {!isUser && isResolutionPrompt(safeMessage) && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              mt: 1,
              ml: 1,
            }}
          >
            <Chip
              label="Resolved"
              color="success"
              size="small"
              onClick={() => {
                console.log("Resolved clicked");
                onResolved?.(true);
              }}
              sx={{ fontWeight: 600 }}
            />
          </Box>
        )}

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
