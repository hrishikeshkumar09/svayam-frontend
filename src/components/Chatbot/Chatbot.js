// src/components/Chatbot/Chatbot.js
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  getMessages,
  sendMessage,
  submitFeedback,
  checkFeedback,
  sendMessageWithFiles,
  startConversation, // Import startConversation here
} from "../../services/api";
import ChatMessage from "./ChatMessage";
import { deleteConversation } from "../../services/api";
import brainBg from "../../images/17460917.png";

import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Chip,
  Paper,
  Fade,
  Menu,
  MenuItem,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ImageIcon from "@mui/icons-material/Image";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

// const removeDuplicates = (messages) => {
//   const seen = new Set();
//   return messages.filter((msg) => {
//     // Create a unique key for the message
//     // We use the first 50 chars of text + sender to identify duplicates
//     const contentKey = (msg.text || "").substring(0, 50).trim();
//     const key = `${msg.sender}-${contentKey}`;

//     if (seen.has(key)) {
//       return false; // It's a duplicate, skip it
//     }
//     seen.add(key);
//     return true;
//   });
// };

// ==========================================
// INLINE FEEDBACK COMPONENT (Appears from Assistant)
// ==========================================
const InlineFeedback = ({ onSubmit, onDismiss, onContinue }) => {
  const [step, setStep] = useState("ask"); // "ask" or "rate"
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleContinueChat = () => {
    onContinue();
  };

  const handleProceedToRating = () => {
    setStep("rate");
  };

  const handleStarClick = async (star) => {
    setRating(star);
    setSubmitted(true);

    await onSubmit(star);

    setTimeout(() => {
      onDismiss();
    }, 2000);
  };

  // Step 1: Ask if user needs more help
  if (step === "ask") {
    return (
      <Fade in={true}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            mb: 2,
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <SmartToyIcon sx={{ fontSize: 18, color: "white" }} />
          </Box>

          <Box sx={{ maxWidth: "70%" }}>
            <Paper
              elevation={1}
              sx={{
                p: 2.5,
                borderRadius: "12px 12px 12px 2px",
                bgcolor: "#fff",
                border: "1px solid #e2e8f0",
              }}
            >
              <Typography sx={{ color: "#0f172a", mb: 2, lineHeight: 1.6 }}>
                Is there anything else I can help you with today? 😊
              </Typography>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  label="Yes, continue chatting"
                  onClick={handleContinueChat}
                  sx={{
                    bgcolor: "#eff6ff",
                    color: "#1e40af",
                    border: "1px solid #bfdbfe",
                    cursor: "pointer",
                    fontWeight: 500,
                    "&:hover": {
                      bgcolor: "#dbeafe",
                    },
                  }}
                />
                <Chip
                  label="No, I'm all set"
                  onClick={handleProceedToRating}
                  sx={{
                    bgcolor: "#f0fdf4",
                    color: "#16a34a",
                    border: "1px solid #bbf7d0",
                    cursor: "pointer",
                    fontWeight: 500,
                    "&:hover": {
                      bgcolor: "#dcfce7",
                    },
                  }}
                />
              </Box>
            </Paper>

            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 0.5,
                color: "text.secondary",
                px: 1,
              }}
            >
              {new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </Box>
        </Box>
      </Fade>
    );
  }

  // Step 2: Thank you message after rating
  if (submitted) {
    return (
      <Fade in={submitted}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            mb: 2,
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <SmartToyIcon sx={{ fontSize: 18, color: "white" }} />
          </Box>

          <Paper
            elevation={1}
            sx={{
              p: 2,
              borderRadius: "12px 12px 12px 2px",
              bgcolor: "#f0fdf4",
              border: "1px solid #86efac",
              maxWidth: "70%",
            }}
          >
            <Typography sx={{ color: "#16a34a", fontWeight: 600, mb: 0.5 }}>
              ✨ Thank you for your feedback!
            </Typography>
            <Typography variant="caption" sx={{ color: "#15803d" }}>
              Your rating helps me improve
            </Typography>
          </Paper>
        </Box>
      </Fade>
    );
  }

  // Step 3: Rating interface
  return (
    <Fade in={true}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          mb: 2,
          gap: 1,
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <SmartToyIcon sx={{ fontSize: 18, color: "white" }} />
        </Box>

        <Box sx={{ maxWidth: "70%" }}>
          <Paper
            elevation={1}
            sx={{
              p: 2.5,
              borderRadius: "12px 12px 12px 2px",
              bgcolor: "#fff",
              border: "1px solid #e2e8f0",
            }}
          >
            <Typography sx={{ color: "#0f172a", mb: 0.5, lineHeight: 1.6 }}>
              Could you please rate your experience with this assistant? ⭐
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#64748b", display: "block", mb: 2 }}
            >
              Your feedback helps us improve!
            </Typography>

            <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <IconButton
                  key={star}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  sx={{
                    p: 0.5,
                    transition: "all 0.2s",
                    "&:hover": {
                      transform: "scale(1.15)",
                      bgcolor: "transparent",
                    },
                  }}
                >
                  {star <= (hoveredRating || rating) ? (
                    <StarIcon sx={{ fontSize: 32, color: "#fbbf24" }} />
                  ) : (
                    <StarBorderIcon sx={{ fontSize: 32, color: "#d1d5db" }} />
                  )}
                </IconButton>
              ))}
            </Box>
          </Paper>

          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 0.5,
              color: "text.secondary",
              px: 1,
            }}
          >
            {new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
};

// ==========================================
// MAIN CHATBOT COMPONENT
// ==========================================
const Chatbot = ({
  currentConversation,
  onConversationUpdate,
  // Add these props to handle new chat creation from within Chatbot
  onNewChatCreated,
  selectedProject,
  onSaveMessages,
}) => {
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [homeInput, setHomeInput] = useState("");

  // Upload menu + file states
  const [uploadMenuAnchor, setUploadMenuAnchor] = useState(null);
  const uploadMenuOpen = Boolean(uploadMenuAnchor);
  const [resolvedConversations, setResolvedConversations] = useState({});
  const isResolved = !!(
    currentConversation?.conversation_uuid &&
    resolvedConversations[currentConversation.conversation_uuid]
  );

  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Attachments: [{ id, file, previewUrl, kind, name }]
  const [attachments, setAttachments] = useState([]);

  // Feedback state
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [hasAskedFeedback, setHasAskedFeedback] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const hasProcessedHomeMessage = useRef(false);

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, showFeedback]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Detect user typing
  const handleInputChange = (e) => {
    if (isResolved) return;
    setChatInput(e.target.value);
    setIsTyping(true);

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  // ==========================================
  // CHECK IF WE SHOULD SHOW FEEDBACK
  // ==========================================

  useEffect(() => {
    if (
      hasAskedFeedback ||
      feedbackSubmitted ||
      !currentConversation?.conversation_uuid ||
      chatLoading
    ) {
      return;
    }

    const aiMessages = messages.filter((m) => m.sender === "assistant");
    const lastAiMessage = aiMessages[aiMessages.length - 1];

    // Scenario 1: If last AI message says information not available
    if (
      lastAiMessage?.text?.toLowerCase().includes("information not available") // Removed "in the documents" to make it broader
    ) {
      const timer = setTimeout(() => {
        checkExistingFeedback();
      }, 2000);
      return () => clearTimeout(timer);
    }

    // Scenario 2: MODIFIED FOR TESTING
    // Trigger after 1 AI message and 2 seconds of silence
    if (aiMessages.length >= 1 && !isTyping) {
      const timer = setTimeout(() => {
        console.log("Triggering Feedback Check..."); // Added log
        checkExistingFeedback();
      }, 2000); // Reduced from 10000 to 2000

      return () => clearTimeout(timer);
    }
  }, [
    messages,
    chatLoading,
    isTyping,
    hasAskedFeedback,
    feedbackSubmitted,
    currentConversation?.conversation_uuid,
  ]);
  const checkExistingFeedback = useCallback(async () => {
    try {
      const result = await checkFeedback(currentConversation.conversation_uuid);

      if (!result.exists) {
        setShowFeedback(true);
        setHasAskedFeedback(true);
      } else {
        setHasAskedFeedback(true);
      }
    } catch (error) {
      console.error("Failed to check feedback:", error);
      setHasAskedFeedback(true);
    }
  });

  const handleFeedbackSubmit = async (rating) => {
    try {
      await submitFeedback(currentConversation.conversation_uuid, {
        rating,
        message_count: messages.length,
      });

      setFeedbackSubmitted(true);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      alert(error.message || "Failed to submit feedback. Please try again.");
    }
  };

  const handleCloseFeedback = () => {
    setShowFeedback(false);
    setHasAskedFeedback(true);
  };

  // ==========================================
  // LOAD MESSAGES WHEN CONVERSATION CHANGES
  // ==========================================
  // useEffect(() => {
  //   if (!currentConversation) {
  //     setMessages([]);
  //     setLoadingMessages(false);
  //     return;
  //   }

  //   if (currentConversation.isNew) {
  //     setMessages([]);
  //     setLoadingMessages(false);
  //     return;
  //   }

  //   // ✅ If messages already in conversation object, use them
  //   if (currentConversation.messagesLoaded && currentConversation.messages) {
  //     setMessages(currentConversation.messages);
  //     setLoadingMessages(false);
  //     return;
  //   }

  //   // Otherwise fetch from API
  //   loadConversationMessages(currentConversation.conversation_uuid);
  // }, [currentConversation?.conversation_uuid]);

  // useEffect(() => {
  //   // 1. Reset if no conversation
  //   if (!currentConversation) {
  //     setMessages([]);
  //     setLoadingMessages(false);
  //     return;
  //   }

  //   // 2. SAFETY LOCK: If we already have messages for THIS conversation, stop here.
  //   // This prevents the "wipe" when App.js updates the 'isNew' flag or other metadata.
  //   if (messages.length > 0 && currentConversation.conversation_uuid === messages[0]?.conversation_uuid) {
  //       setLoadingMessages(false);
  //       return;
  //   }

  //   // 2. Handle New/Draft Chat
  //   if (currentConversation.isNew) {

  //     // ✅ FIX: If there is a pending message from Home, DO NOT clear the screen.
  //     // We let 'handleSend' initialize the chat instead.
  //     if (window.firstMessageFromHome) {
  //        setLoadingMessages(false);
  //        return;
  //     }

  //     setMessages([]);
  //     setLoadingMessages(false);
  //     return;
  //   }

  //   // 3. CACHE HIT: Use data from Parent immediately
  //   if (currentConversation.messagesLoaded && currentConversation.messages) {
  //     setMessages(currentConversation.messages);
  //     setLoadingMessages(false);
  //     return;
  //   }

  //   // 4. CACHE MISS: Fetch from API (With Race Condition Fix)
  //   let isMounted = true; // <--- FLAG TO TRACK MOUNT STATUS

  //   const fetchMessages = async () => {
  //     setLoadingMessages(true);
  //     try {
  //       const loadedMessages = await getMessages(currentConversation.conversation_uuid);

  //       // CHECK FLAG BEFORE UPDATING STATE
  //       if (isMounted) {
  //           const formatted = loadedMessages.map((msg) => ({
  //             sender: msg.role,
  //             text: msg.content,
  //             timestamp: msg.timestamp || new Date().toISOString(),
  //           }));

  //           setMessages(formatted);

  //           // Update parent cache
  //           if (onSaveMessages) {
  //             onSaveMessages(currentConversation.conversation_uuid, formatted);
  //           }
  //       }
  //     } catch (err) {
  //       if (isMounted) {
  //           console.error("Failed to load messages:", err);
  //           setMessages([]);
  //       }
  //     } finally {
  //       if (isMounted) setLoadingMessages(false);
  //     }
  //   };

  //   fetchMessages();

  //   // CLEANUP FUNCTION
  //   return () => {
  //     isMounted = false; // <--- CANCEL UPDATE IF USER SWITCHES CHATS
  //   };

  // }, [currentConversation?.conversation_uuid, currentConversation?.messagesLoaded]);

  useEffect(() => {
    // 1. Reset if no conversation
    if (!currentConversation) {
      setMessages([]);
      setLoadingMessages(false);
      return;
    }

    // 2. Handle New/Draft Chat
    if (currentConversation.isNew) {
      setMessages([]);
      setLoadingMessages(false);
      return;
    }

    // 3. CACHE HIT: Use data from Parent immediately
    if (currentConversation.messagesLoaded && currentConversation.messages) {
      setMessages(currentConversation.messages);
      setLoadingMessages(false);
      return;
      // const uniqueMsgs = removeDuplicates(currentConversation.messages);
      // setMessages(uniqueMsgs);
      // setLoadingMessages(false);
      // return;
    }

    // 4. CACHE MISS: Fetch from API (With Race Condition Fix)
    let isMounted = true; // <--- FLAG TO TRACK MOUNT STATUS

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const loadedMessages = await getMessages(
          currentConversation.conversation_uuid,
        );

        // CHECK FLAG BEFORE UPDATING STATE
        if (isMounted) {
          const formatted = loadedMessages.map((msg) => ({
            sender: msg.role,
            text: msg.content,
            timestamp: msg.timestamp || new Date().toISOString(),
          }));

          setMessages(formatted);

          // Update parent cache
          if (onSaveMessages) {
            onSaveMessages(currentConversation.conversation_uuid, formatted);
          }
          // // ✅ FIX: Run deduplication here too
          // const uniqueFormatted = removeDuplicates(formatted);

          // setMessages(uniqueFormatted);

          // if (onSaveMessages) {
          //   onSaveMessages(currentConversation.conversation_uuid, uniqueFormatted);
          // }
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load messages:", err);
          setMessages([]);
        }
      } finally {
        if (isMounted) setLoadingMessages(false);
      }
    };

    fetchMessages();

    // CLEANUP FUNCTION
    return () => {
      isMounted = false; // <--- CANCEL UPDATE IF USER SWITCHES CHATS
    };
  }, [
    currentConversation?.conversation_uuid,
    currentConversation?.messagesLoaded,
  ]);

  async function loadConversationMessages(conversationUuid) {
    setLoadingMessages(true);
    try {
      const loadedMessages = await getMessages(conversationUuid);

      const formatted = loadedMessages.map((msg) => ({
        sender: msg.role,
        text: msg.content,
        timestamp: msg.timestamp || new Date().toISOString(),
      }));

      setMessages(formatted);

      // ✅ SAVE to conversation object in App.js
      if (onSaveMessages) {
        onSaveMessages(conversationUuid, formatted);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
      setMessages([]);

      if (err.message?.includes("401")) {
        alert("Session expired. Please login again.");
      }
    } finally {
      setLoadingMessages(false);
    }
  }
  // ==========================================
  // SEND MESSAGE (WITH OPTIONAL FILES)
  // ==========================================
  // async function handleSend(passedText) {
  //     const textRaw = passedText ?? chatInput;
  //     const text = (textRaw || "").trim();

  //     if (!text && attachments.length === 0) return;
  //     if (chatLoading) return;

  //     let convId = currentConversation?.conversation_uuid;

  //     if (!convId || currentConversation?.isNew) {
  //       try {
  //         if (!selectedProject) {
  //           alert("Please select a project first.");
  //           return;
  //         }
  //         const newConvData = await startConversation(selectedProject);
  //         convId = newConvData.conversation_uuid;

  //         if (onNewChatCreated) {
  //           onNewChatCreated(newConvData);
  //         }
  //       } catch (err) {
  //         console.error("Failed to start new conversation:", err);
  //         alert("Could not start chat. Please check your connection.");
  //         return;
  //       }
  //     }

  //     let displayText = text;
  //     if (attachments.length > 0) {
  //       const filesLabel = attachments.map((a) => `📎 ${a.name}`).join("\n");
  //       displayText = text ? `${text}\n\n${filesLabel}` : filesLabel;
  //     }

  //     const tempId = Date.now();
  //     const userMessage = {
  //       sender: "user",
  //       text: displayText,
  //       timestamp: new Date().toISOString(),
  //       tempId
  //       //conversation_uuid: convId // ✅ ADD THIS: Locks the message to this chat
  //     };

  //     setMessages((prev) => [...prev, userMessage]);

  //     const filesToSend = attachments.map((a) => a.file);

  //     setChatInput("");
  //     attachments.forEach((a) => {
  //       if (a.previewUrl) {
  //         URL.revokeObjectURL(a.previewUrl);
  //       }
  //     });
  //     setAttachments([]);

  //     setChatLoading(true);
  //     setIsTyping(false);

  //     try {
  //       let response;

  //       if (filesToSend.length > 0) {
  //         response = await sendMessageWithFiles(convId, text, filesToSend);
  //       } else {
  //         response = await sendMessage(convId, text);
  //       }

  //       const assistantMessage = {
  //         sender: response.role || "assistant",
  //         text: response.content,
  //         timestamp: response.timestamp || new Date().toISOString(),
  //       };

  //       setMessages((prev) => {
  //         const updatedMessages = [...prev, assistantMessage];

  //         // ✅ SAVE updated messages to conversation
  //         if (onSaveMessages) {
  //           onSaveMessages(convId, updatedMessages);
  //         }

  //         return updatedMessages;
  //         // // ✅ FIX: Deduplicate when appending the new AI response
  //         // const updatedMessages = removeDuplicates([...prev, assistantMessage]);

  //         // if (onSaveMessages) {
  //         //   onSaveMessages(convId, updatedMessages);
  //         // }
  //         // return updatedMessages;
  //       });

  //       if (onConversationUpdate) {
  //         onConversationUpdate(convId);
  //       }

  //     } catch (err) {
  //       console.error("Chat error:", err);
  //       setMessages((prev) => prev.filter((m) => m.tempId !== tempId));
  //       setChatInput(text);
  //       alert(err.message || "Failed to send message. Please try again.");
  //     } finally {
  //       setChatLoading(false);
  //     }
  //   }

  async function handleSend(passedText) {
    if (isResolved) {
      console.warn("❌ Chat is resolved. Sending blocked.");
      return;
    }
    const textRaw = passedText ?? chatInput;
    const text = (textRaw || "").trim();

    if (!text && attachments.length === 0) return;
    if (chatLoading) return;

    let convId = currentConversation?.conversation_uuid;

    if (!convId || currentConversation?.isNew) {
      try {
        if (!selectedProject) {
          alert("Please select a project first.");
          return;
        }
        const newConvData = await startConversation(selectedProject);
        convId = newConvData.conversation_uuid;

        if (onNewChatCreated) {
          onNewChatCreated(newConvData);
        }
      } catch (err) {
        console.error("Failed to start new conversation:", err);
        alert("Could not start chat. Please check your connection.");
        return;
      }
    }

    let displayText = text;
    if (attachments.length > 0) {
      const filesLabel = attachments.map((a) => `📎 ${a.name}`).join("\n");
      displayText = text ? `${text}\n\n${filesLabel}` : filesLabel;
    }

    const tempId = Date.now();
    const userMessage = {
      sender: "user",
      text: displayText,
      timestamp: new Date().toISOString(),
      tempId,
      //conversation_uuid: convId // ✅ ADD THIS: Locks the message to this chat
    };

    setMessages((prev) => [...prev, userMessage]);

    const filesToSend = attachments.map((a) => a.file);

    setChatInput("");
    attachments.forEach((a) => {
      if (a.previewUrl) {
        URL.revokeObjectURL(a.previewUrl);
      }
    });
    setAttachments([]);

    setChatLoading(true);
    setIsTyping(false);

    try {
      let response;

      if (filesToSend.length > 0) {
        response = await sendMessageWithFiles(convId, text, filesToSend);
      } else {
        response = await sendMessage(convId, text);
      }

      const assistantMessage = {
        sender: response.role || "assistant",
        text: response.content,
        timestamp: response.timestamp || new Date().toISOString(),
      };

      setMessages((prev) => {
        const updatedMessages = [...prev, assistantMessage];

        // ✅ SAVE updated messages to conversation
        if (onSaveMessages) {
          onSaveMessages(convId, updatedMessages);
        }

        return updatedMessages;
      });

      if (onConversationUpdate) {
        onConversationUpdate(convId);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => prev.filter((m) => m.tempId !== tempId));
      setChatInput(text);
      alert(err.message || "Failed to send message. Please try again.");
    } finally {
      setChatLoading(false);
    }
  }

  // Handle first message from home screen
  useEffect(() => {
    if (
      window.firstMessageFromHome &&
      // Trigger if we have a conversation OR if we are in "No Conversation" mode (to create one)
      (currentConversation?.conversation_uuid || !currentConversation) &&
      !hasProcessedHomeMessage.current
    ) {
      const msg = window.firstMessageFromHome;
      window.firstMessageFromHome = null;
      hasProcessedHomeMessage.current = true;

      // Small delay to ensure state is ready
      setTimeout(() => {
        handleSend(msg);
      }, 100);
    }
  }, [currentConversation]);

  const handleKeyDown = (e) => {
    if (isResolved) return;
    if (e.key === "Enter" && !e.shiftKey && !chatLoading) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleHomeScreenEnter = () => {
    if (!homeInput.trim()) return;

    // 1. Store the message so the chat interface can pick it up and send it
    window.firstMessageFromHome = homeInput.trim();

    // 2. Dispatch the event. App.js is listening for this!
    // App.js will create the conversation, set currentConversationId, and switch the view.
    window.dispatchEvent(
      new CustomEvent("createNewChatFromHome", { detail: homeInput.trim() }),
    );

    // 3. Clear the input
    setHomeInput("");
  };
  // ==========================================
  // UPLOAD MENU & FILE CHANGE HANDLERS
  // ==========================================
  const handleUploadMenuOpen = (event) => {
    if (isResolved) return;
    setUploadMenuAnchor(event.currentTarget);
  };

  const handleUploadMenuClose = () => setUploadMenuAnchor(null);

  const handleImageUpload = () => {
    handleUploadMenuClose();
    setTimeout(() => imageInputRef.current?.click(), 150);
  };

  const handleFileUpload = () => {
    handleUploadMenuClose();
    setTimeout(() => fileInputRef.current?.click(), 150);
  };

  const addAttachment = (file, preferredKind) => {
    const isImage = file.type.startsWith("image/");
    const kind = preferredKind || (isImage ? "image" : "file");
    const previewUrl = isImage ? URL.createObjectURL(file) : null;

    const id =
      file.name +
      "-" +
      file.lastModified +
      "-" +
      Math.random().toString(36).slice(2);

    setAttachments((prev) => [
      ...prev,
      {
        id,
        file,
        previewUrl,
        kind,
        name: file.name,
      },
    ]);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    addAttachment(file, "image");
    e.target.value = "";
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    addAttachment(file, "file");
    e.target.value = "";
  };

  const handleRemoveAttachment = (id) => {
    setAttachments((prev) => {
      const target = prev.find((a) => a.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((a) => a.id !== id);
    });
  };

  const handleConversationResolved = (resolved = true) => {
    if (!currentConversation?.conversation_uuid) return;

    setResolvedConversations((prev) => ({
      ...prev,
      [currentConversation.conversation_uuid]: resolved,
    }));
  };

  // ==========================================
  // HOME SCREEN (NO CONVERSATION SELECTED or NEW CHAT)
  // ==========================================
  // Show Home Screen if:
  // 1. No conversation selected
  // 2. OR Selected conversation is "New" (Draft) AND has no messages yet
  //const showHomeScreen = !currentConversation

  // if (showHomeScreen) {
  //   return (
  //     <Box
  //       sx={{
  //         flexGrow: 1,
  //         display: "flex",
  //         flexDirection: "column",
  //         alignItems: "center",
  //         justifyContent: "center",
  //         height: "100%",
  //         bgcolor: "#f3f4f6", // updated color
  //         px: 3,
  //         pt: 2,
  //       }}
  //     >
  //       <Typography
  //         variant="h5"
  //         sx={{
  //           fontWeight: 700,
  //           color: "#1e293b",
  //           textAlign: "center",
  //           mb: 1,
  //           letterSpacing: "-0.3px",
  //           fontSize: "1.55rem",
  //         }}
  //       >
  //         Hi! Ready to get things done?
  //       </Typography>

  //       <Typography
  //         sx={{
  //           color: "#64748b", // updated color
  //           fontSize: "0.95rem",
  //           textAlign: "center",
  //           maxWidth: 520,
  //           lineHeight: 1.5,
  //           mb: 3.5,
  //         }}
  //       >
  //         Select a project and start chatting to get assistance.
  //       </Typography>

  //       <Box sx={{ width: "100%", maxWidth: "680px" }}>
  //         <TextField
  //           fullWidth
  //           placeholder="Ask anything..."
  //           value={homeInput}
  //           onChange={(e) => setHomeInput(e.target.value)}
  //           onKeyDown={(e) => {
  //             if (e.key === "Enter" && !e.shiftKey) {
  //               e.preventDefault();
  //               handleHomeScreenEnter();
  //             }
  //           }}
  //           InputProps={{
  //             startAdornment: (
  //               <InputAdornment position="start">
  //                 <SearchIcon sx={{ color: "#94a3b8" }} />
  //               </InputAdornment>
  //             ),
  //             sx: {
  //               borderRadius: "14px",
  //               background: "#ffffff",
  //               fontSize: "0.95rem",
  //               boxShadow: "0 3px 10px rgba(0,0,0,0.05)", // updated shadow
  //               "& fieldset": { borderColor: "#e2e8f0" },
  //               "&:hover fieldset": { borderColor: "#cbd5e1" },
  //             },
  //           }}
  //         />
  //       </Box>
  //     </Box>
  //   );
  // }

  // ==========================================
  // HOME SCREEN (BRANDING ONLY - NO SEARCH)
  // ==========================================

  const showHomeScreen = !currentConversation;

  // if (showHomeScreen) {
  //   return (
  //     <Box
  //       sx={{
  //         flexGrow: 1,
  //         display: "flex",
  //         flexDirection: "column",
  //         alignItems: "center",
  //         justifyContent: "center",
  //         height: "100%",
  //         // Brain Background Image
  //         backgroundImage: `url(${brainBg})`, // Tech/Brain Network placeholder
  //         backgroundSize: "cover",
  //         backgroundPosition: "center",
  //         backgroundRepeat: "no-repeat",
  //         position: "relative",
  //       }}
  //     >
  //       {/* Dark Overlay to ensure text readability */}
  //       <Box
  //         sx={{
  //           position: "absolute",
  //           top: 0,
  //           left: 0,
  //           right: 0,
  //           bottom: 0,
  //           backgroundColor: "rgba(0, 0, 0, 0.6)", // Darkens the background
  //           zIndex: 1,
  //         }}
  //       />

  //       {/* Branding Text */}
  //       <Box sx={{ zIndex: 2, textAlign: "center" }}>
  //         <Typography
  //           variant="h2"
  //           sx={{
  //             fontWeight: 800,
  //             color: "#ffffff",
  //             letterSpacing: "4px",
  //             textTransform: "uppercase",
  //             fontSize: { xs: "2.5rem", md: "4rem" },
  //             textShadow: "0px 4px 20px rgba(0,0,0,0.5)",
  //             mb: 2,
  //           }}
  //         >
  //           SVAYAM AMS
  //         </Typography>

  //         <Typography
  //            variant="h6"
  //            sx={{
  //              color: "rgba(255,255,255,0.8)",
  //              fontWeight: 400,
  //              letterSpacing: "1px",
  //              maxWidth: "600px",
  //              mx: "auto",
  //            }}
  //         >
  //           AI-Powered Enterprise Assistance
  //         </Typography>

  //         {/* Optional: Visual Cue to use sidebar */}
  //         <Typography
  //            variant="caption"
  //            sx={{
  //              display: "block",
  //              mt: 6,
  //              color: "rgba(255,255,255,0.5)",
  //              textTransform: "uppercase",
  //              letterSpacing: "1.5px",
  //            }}
  //         >
  //           ← Click "New Chat" to begin
  //         </Typography>
  //       </Box>
  //     </Box>
  //   );
  // }

  if (showHomeScreen) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          //bgcolor: "#f8fafc", // Light grey background for the whole page
          bgcolor: "#ffffff",
          position: "relative",
        }}
      >
        {/* LOGO IMAGE */}
        <Box
          component="img"
          src={brainBg} // Or put your URL string here
          alt="Svayam Logo"
          sx={{
            width: "300px", // ✅ Controls the size of the logo
            height: "auto",
            mb: 4, // Spacing between logo and text
            opacity: 0.9,
          }}
        />

        {/* Branding Text */}
        <Box sx={{ zIndex: 2, textAlign: "center" }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "#1e293b", // Dark text since background is light now
              letterSpacing: "3px",
              textTransform: "uppercase",
              textShadow: "0px 2px 10px rgba(0,0,0,0.05)",
              mb: 1,
            }}
          >
            SVAYAM AMS
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "#64748b",
              fontWeight: 400,
              letterSpacing: "1px",
            }}
          >
            AI-Powered Enterprise Assistance
          </Typography>

          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 4,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              fontWeight: 600,
            }}
          >
            ← Click "New Chat" to begin
          </Typography>
        </Box>
      </Box>
    );
  }

  // ==========================================
  // MAIN CHAT INTERFACE
  // ==========================================
  return (
    // <Box
    //   sx={{
    //     flexGrow: 1,
    //     display: "flex",
    //     flexDirection: "column",
    //     height: "100%",
    //     bgcolor: "#ffffff",
    //   }}
    // >
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative", // Needed for the absolute background
        bgcolor: "#ffffff",
        overflow: "hidden", // Prevents scrollbar on the container itself
      }}
    >
      {/* ✅ BACKGROUND WATERMARK */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${brainBg})`, // Use the same logo
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "400px", // Size of the watermark
          opacity: 0.08, // ✅ Very faint (8% opacity) so text is readable
          pointerEvents: "none", // Allows clicks to pass through to messages
          zIndex: 0,
        }}
      />

      {/* HIDDEN FILE INPUTS */}
      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        style={{ display: "none" }}
        onChange={handleImageChange}
      />

      <input
        type="file"
        accept=".pdf,.doc,.docx,.txt,image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* MESSAGE DISPLAY AREA */}
      <Box sx={{ flexGrow: 1, p: 2, overflowY: "auto" }}>
        {loadingMessages ? (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <CircularProgress />
            <Typography sx={{ mt: 1, color: "text.secondary" }}>
              Loading conversation history...
            </Typography>
          </Box>
        ) : (
          <>
            {messages.map((m, i) => (
              <ChatMessage
                key={m.tempId || `${m.timestamp}-${i}`}
                message={m.text}
                sender={m.sender}
                onResolved={handleConversationResolved}
                timestamp={m.timestamp}
              />
            ))}

            {/* INLINE FEEDBACK - Shows in chat flow */}
            {showFeedback && !feedbackSubmitted && (
              <InlineFeedback
                onSubmit={handleFeedbackSubmit}
                onDismiss={handleCloseFeedback}
                onContinue={handleCloseFeedback}
              />
            )}
          </>
        )}

        {chatLoading && (
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <CircularProgress size={18} />
            <Typography sx={{ ml: 1, color: "text.secondary" }}>
              AI is thinking…
            </Typography>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* INPUT AREA */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          pb: 1,
        }}
      >
        <Box sx={{ width: "82%", maxWidth: "850px" }}>
          {/* ATTACHMENT PREVIEW ROW */}
          {attachments.length > 0 && (
            <Box
              sx={{
                mb: 1,
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              {attachments.map((att) => (
                <Box
                  key={att.id}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: 140,
                    borderRadius: 2,
                    border: "1px solid #e5e7eb",
                    bgcolor: "#f9fafb",
                    overflow: "hidden",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  }}
                >
                  <Box
                    sx={{
                      height: 80,
                      bgcolor: "#e5e7eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {att.kind === "image" && att.previewUrl ? (
                      <Box
                        component="img"
                        src={att.previewUrl}
                        alt={att.name}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <InsertDriveFileIcon
                        sx={{ fontSize: 40, color: "#6b7280" }}
                      />
                    )}
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      px: 1,
                      py: 0.5,
                      gap: 0.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.72rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 100,
                      }}
                      title={att.name}
                    >
                      {att.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveAttachment(att.id)}
                    >
                      <CloseIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          <TextField
            fullWidth
            size="small"
            placeholder="Ask me anything..."
            value={chatInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={chatLoading || loadingMessages || isResolved}
            multiline
            maxRows={4}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    onClick={handleUploadMenuOpen}
                    sx={{ color: "#6b7280" }}
                    disabled={chatLoading || loadingMessages || isResolved}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleSend()}
                    disabled={
                      isResolved ||
                      (!chatInput.trim() && attachments.length === 0) ||
                      chatLoading ||
                      loadingMessages
                    }
                    sx={{
                      backgroundColor:
                        (chatInput.trim() || attachments.length > 0) &&
                        !chatLoading
                          ? "#000"
                          : "transparent",
                      color:
                        (chatInput.trim() || attachments.length > 0) &&
                        !chatLoading
                          ? "#fff"
                          : "#9ca3af",
                      borderRadius: "50%",
                      width: 28,
                      height: 28,
                    }}
                  >
                    <SendIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              disableUnderline: true,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
                backgroundColor: "#fff",
                boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                border: "1px solid #d1d5db",
                "& fieldset": { border: "none" },
              },
            }}
          />

          {/* UPLOAD MENU */}
          <Menu
            anchorEl={uploadMenuAnchor}
            open={uploadMenuOpen}
            onClose={handleUploadMenuClose}
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
            transformOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            <MenuItem onClick={handleImageUpload}>
              <ImageIcon sx={{ mr: 1 }} /> Upload Image
            </MenuItem>

            <MenuItem onClick={handleFileUpload}>
              <AttachFileIcon sx={{ mr: 1 }} /> Upload File
            </MenuItem>

            <MenuItem
              onClick={() => {
                handleUploadMenuClose();
                setGalleryOpen(true);
              }}
            >
              <SearchIcon sx={{ mr: 1 }} /> Prompt Gallery
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* PROMPT GALLERY */}
      <Box
        sx={{
          position: "fixed",
          bottom: galleryOpen ? 0 : "-300px",
          left: 0,
          width: "100%",
          height: "260px",
          bgcolor: "#ffffff",
          borderTop: "1px solid #e5e7eb",
          boxShadow: "0 -4px 10px rgba(0,0,0,0.08)",
          transition: "all 0.3s ease",
          zIndex: 200,
          p: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontWeight: 600 }}>SAP Prompt Gallery</Typography>
          <IconButton size="small" onClick={() => setGalleryOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 1.5,
            mt: 2,
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {[
            "Explain SAP ABAP BAPI with an example.",
            "How to debug an SAP workflow issue?",
            "MM - How to fix PR to PO conversion error?",
            "What is IDoc error 51 and how to reprocess it?",
            "How to improve SELECT queries performance in ABAP?",
            "FI - How to troubleshoot FB60 posting error?",
            "Explain SAP SmartForms vs Adobe Forms.",
            "Steps to configure Output Determination in SAP.",
          ].map((prompt, idx) => (
            <Box
              key={idx}
              onClick={() => {
                setChatInput(prompt);
                setGalleryOpen(false);
              }}
              sx={{
                p: 1.5,
                bgcolor: "#f9fafb",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                cursor: "pointer",
                "&:hover": { bgcolor: "#eef2ff" },
              }}
            >
              <Typography fontSize="0.9rem">{prompt}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Chatbot;
