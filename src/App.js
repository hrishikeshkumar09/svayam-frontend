// src/App.js
import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { getAdminConversations } from "./services/api";
import {
  Box,
  CssBaseline,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Paper,
  Avatar,
  CircularProgress,
  Menu,
  MenuItem,
  Divider,
  alpha,
  Breadcrumbs,
  Link,
  Button,
  Stack,
  Card,
  CardContent,
  Dialog
} from "@mui/material";

// --- RECHARTS IMPORTS (Your Analytics Graphs) ---
import { 
  ComposedChart, AreaChart, Area, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Line, ReferenceLine
} from 'recharts';
import { PieChart, Pie } from "recharts";

// --- ICONS ---
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import StarIcon from '@mui/icons-material/Star';
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ChatIcon from "@mui/icons-material/Chat";
import RefreshIcon from '@mui/icons-material/Refresh';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArticleIcon from '@mui/icons-material/Article';

// --- NEW ICONS FOR AI STATS ---
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SpeedIcon from '@mui/icons-material/Speed';
import PsychologyIcon from '@mui/icons-material/Psychology';

// --- COMPONENTS ---
import EngineerTicketDetail from "./components/EngineerTicketDetail";
import Chatbot from "./components/Chatbot/Chatbot";
import UserSidebar from "./components/UserSidebar";
import UserManagement from './components/Admin/UserManagement'; // Teammate's Component
import KnowledgeBaseManagement from "./components/Admin/KnowledgeBaseManagement";
import RecentConversationList from "./components/Admin/RecentConversationList";
import AdminSidebar from "./components/AdminSidebar";
import AdminChatView from "./components/Admin/AdminChatView";
import LoginPage from "./components/LoginPage";
import FeedbackManagement from "./components/Admin/FeedbackManagement"; // Teammate's Component
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import customLogo from "./images/searching.png";
// import dogLoading from './images/my-dog.gif';

// --- API SERVICES ---
import {
  loginUser,
  getAllUsers,
  logoutUserApi,
  getUserConversations,
  startConversation,
  deleteConversation,
  getUserProjects // Teammate's Project API
} from "./services/api";

import { getAnalytics } from './services/apiAnalytics'; // Your Analytics API

const appBarHeight = 64;

// --- STATS CARD COMPONENT (Your Enhanced Version) ---
const StatCard = ({ title, value, icon, gradient, color }) => (
  <Card sx={{ 
    height: '100%', 
    minHeight: '160px',
    minWidth: '240px', 
    borderRadius: 3, 
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.2s',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(0,0,0,0.12)' }
  }}>
    <Box sx={{
      position: 'absolute',
      top: 0, left: 0, width: '100%', height: '6px',
      background: color || gradient || "#667eea"
    }} />
    <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box>
        <Typography variant="h4" fontWeight="800" sx={{ color: '#1e293b', mb: 0.5 }}>
          {value}
        </Typography>
        <Typography variant="body2" fontWeight="600" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ 
        width: 64, height: 64,
        borderRadius: '50%', 
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        bgcolor: alpha(color || "#667eea", 0.1), 
        color: color || "#667eea"
      }}>
        {icon}
      </Box>
    </CardContent>
  </Card>
);

function App() {
  // --- Auth & User State ---
  const [userData, setUserData] = useState(null);
  const [mockUser, setMockUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // --- PROJECT State (Teammate's Logic) ---
  const [projectOptions, setProjectOptions] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);

  // --- Conversation State ---
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);

  // --- Admin State ---
  const [users, setUsers] = useState([]);
  const [selectedAdminTab, setSelectedAdminTab] = useState("dashboard");
  const [selectedConversationForAdmin, setSelectedConversationForAdmin] = useState(null);

  // --- Analytics State (Your Logic) ---
  const [llmStats, setLlmStats] = useState({
    total_requests: 0,
    total_tokens: 0,
    total_cost: 0,
    avg_latency: 0,
    daily_trends: [] 
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  // --- Derived State ---
  const currentConversation = useMemo(
    () => conversations.find((c) => c.conversation_uuid === currentConversationId),
    [conversations, currentConversationId]
  );

  const loggedInUser = useMemo(() => {
    if (userData) {
      return {
        userDetails: userData.userDetails,
        role: userData.userRoles?.includes("admin") ? "admin" : "user",
        sessionId: userData.sessionId,
      };
    }
    if (mockUser) return mockUser;
    return null;
  }, [userData, mockUser]);

  const currentUserRole = useMemo(() => {
    if (isLoadingUser) return "loading";
    if (!loggedInUser) return "guest";
    return loggedInUser.role;
  }, [isLoadingUser, loggedInUser]);

  const stats = useMemo(() => {
    const total = conversations.length;
    const open = conversations.filter(c => !c.isResolved).length;
    const resolved = conversations.filter(c => c.isResolved).length;
    return { open, resolved, total };
  }, [conversations]);

  // --- Helper to load projects and set default (Teammate's Logic) ---
  const loadProjectsForUser = async (email) => {
    try {
      const projects = await getUserProjects(email);
      setProjectOptions(projects);

      if (projects && projects.length > 0) {
        if (!currentProject || !projects.find(p => p.project_uuid === currentProject)) {
           const defaultId = projects[0].project_uuid;
           setCurrentProject(defaultId);
           fetchAndSetConversations(email, defaultId);
        } else {
           fetchAndSetConversations(email, currentProject);
        }
      } else {
        setConversations([]);
        setCurrentProject(null);
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
      setProjectOptions([]);
    }
  };

  // --- Authentication check on mount ---
  useEffect(() => {
    (async () => {
      try {
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
          const token = localStorage.getItem("token");
          const userInfoStr = localStorage.getItem("user_info");

          if (token && userInfoStr) {
            try {
              const userInfo = JSON.parse(userInfoStr);
              const sessionId = localStorage.getItem("session_id") || crypto.randomUUID();

              await getUserConversations(null); // Verify token

              const restoredUser = {
                userDetails: userInfo.email,
                role: userInfo.role,
                sessionId: sessionId,
              };

              setMockUser(restoredUser);
              localStorage.setItem("session_id", sessionId);
              await loadProjectsForUser(userInfo.email);

            } catch (err) {
              console.warn("Session restoration failed:", err);
              handleLogoutLocal();
            }
          } else {
            setIsLoadingConversations(false);
          }
          setUserData(null);
          setIsLoadingUser(false);
          return;
        }

        // Production Auth
        const response = await fetch("/.auth/me");
        const data = await response.json();
        const principal = data.clientPrincipal;

        if (principal) {
          const sessionId = localStorage.getItem("session_id") || crypto.randomUUID();
          localStorage.setItem("session_id", sessionId);
          setUserData({ ...principal, sessionId });
          await loadProjectsForUser(principal.userDetails);
        } else {
          setUserData(null);
          setIsLoadingConversations(false);
        }
      } catch (err) {
        setUserData(null);
        setIsLoadingConversations(false);
      } finally {
        setIsLoadingUser(false);
      }
    })();
  }, []);

  // --- Watch for Project Changes ---


  // --- Fetch Analytics (Your Logic) ---
  useEffect(() => {
    if (currentUserRole === 'admin' && selectedAdminTab === 'dashboard') {
      const fetchStats = async () => {
        try {
          const data = await getAnalytics();
          setLlmStats(data);
        } catch (error) {
          console.error("Failed to fetch LLM stats:", error);
        }
      };
      fetchStats();
    }
  }, [currentUserRole, selectedAdminTab]);

  const CACHE_KEY = (email, projectId) => `conversation_cache_${email}_${projectId}`;

  const handleMockLogin = async (email, password) => {
    try {
      setIsLoadingConversations(true);
      const data = await loginUser(email, password);

      // Save access_token for Analytics (Your Fix)
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
      }

      const newMockUser = {
        userDetails: data.user.email,
        role: data.user.role,
        sessionId: crypto.randomUUID(),
      };

      localStorage.setItem("user_info", JSON.stringify({
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
      }));
      localStorage.setItem("session_id", newMockUser.sessionId);

      setMockUser(newMockUser);
      await loadProjectsForUser(data.user.email);

    } catch (err) {
      console.error("Login failed:", err);
      setIsLoadingConversations(false);
      throw err;
    }
  };

  const handleLogoutLocal = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token"); // Clear analytics token
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_info");
    localStorage.removeItem("session_id");
    setMockUser(null);
    setConversations([]);
    setCurrentConversationId(null);
    setCurrentProject(null);
    setIsLoadingConversations(false);
  };

  const handleLogout = async () => {
    try {
      if (mockUser) {
        await logoutUserApi().catch(() => {});
        handleLogoutLocal();
        return;
      }
      if (userData) {
        localStorage.removeItem("session_id");
        window.location.href = "/.auth/logout";
      }
    } catch (err) {
      alert("Logout failed. Try again.");
    }
  };

const fetchAndSetConversations = useCallback((userEmail, projectId) => {
  if (!projectId) return;
  
  const key = CACHE_KEY(userEmail, projectId);
  
  setIsLoadingConversations(true);

  getUserConversations(projectId)
    .then((response) => {
      let conversationsList = Array.isArray(response) ? response : response?.conversations || [];
      
      // ✅ Read cached data to preserve messages
      const cachedData = localStorage.getItem(key);
      const cachedConversations = cachedData ? JSON.parse(cachedData) : [];
      
      const mapped = conversationsList.map((c) => {
        // ✅ Find cached version with messages
        const cached = cachedConversations.find(conv => conv.conversation_uuid === c.conversation_uuid);
        
        return {
          conversation_uuid: c.conversation_uuid,
          topic: c.topic || cached?.topic || "New Chat",
          startDate: c.created_at || cached?.startDate || new Date().toISOString(),
          isResolved: c.is_resolved ?? cached?.isResolved ?? false,
          user: userEmail,
          messages: cached?.messages || [], // ✅ Restore cached messages
          messagesLoaded: cached?.messagesLoaded || false,
          isNew: false,
        };
      });

      setConversations(mapped);
      
      // Preserve current conversation if it exists
      setCurrentConversationId((prevId) => {
        const exists = mapped.find(c => c.conversation_uuid === prevId);
        return exists ? prevId : null;
      });
      
      // ✅ Save back to cache (in case of new conversations from backend)
      localStorage.setItem(key, JSON.stringify(mapped));
    })
    .catch((err) => console.error("❌ Failed to load conversations:", err))
    .finally(() => setIsLoadingConversations(false));
}, []);
useEffect(() => {
  if (loggedInUser?.userDetails && currentProject) {
    fetchAndSetConversations(loggedInUser.userDetails, currentProject);
  }
}, [currentProject, loggedInUser?.userDetails, fetchAndSetConversations]);



const loadAdminConversations = async () => {
  try {
    const data = await getAdminConversations();   // <-- Cosmos DB conversations
    console.log("Admin Conversations:", data);
    setConversations(data);
  } catch (err) {
    console.error("Failed to load admin conversations:", err);
  }
};

const handleNewChat = async () => {
  if (!currentProject) {
    alert("Please select a project first.");
    return;
  }
  
  try {
    const data = await startConversation(currentProject);
    const newConv = {
      conversation_uuid: data.conversation_uuid,
      topic: data.topic || "New Chat",
      startDate: data.created_at || new Date().toISOString(),
      isResolved: data.is_resolved ?? false,
      user: loggedInUser?.userDetails,
      messages: [],
      messagesLoaded: true,
      isNew: false,
      project: currentProject
    };
    
    setConversations((prev) => {
      const updated = [newConv, ...prev];
      
      // ✅ Update cache
      const key = CACHE_KEY(loggedInUser.userDetails, currentProject);
      localStorage.setItem(key, JSON.stringify(updated));
      
      return updated;
    });
    
    setCurrentConversationId(newConv.conversation_uuid);
    
  } catch (err) {
    console.error("Failed to create new chat:", err);
    alert("Could not start a new chat. Please try again.");
  }
};



  // --- MISSING LOGIC ADDED BACK: Handle Chat from Home Screen ---
// const handleHomeScreenSend = async (text) => {
//   if (!text.trim()) return;
//   if (!currentProject) {
//     alert("Please select a project first.");
//     return;
//   }

//   try {
//     const data = await startConversation(currentProject);

//     const newConv = {
//       conversation_uuid: data.conversation_uuid,
//       topic: data.topic || "New Chat",
//       startDate: data.created_at || new Date().toISOString(),
//       isResolved: false,
//       user: loggedInUser?.userDetails,
//       messages: [],
//       messagesLoaded: false,
//       isNew: true, //loader fix
//       project: currentProject
//     };

//     setConversations((prev) => {
//       const updated = [newConv, ...prev];
      
//       // ✅ Update cache
//       const key = CACHE_KEY(loggedInUser.userDetails, currentProject);
//       localStorage.setItem(key, JSON.stringify(updated));
      
//       return updated;
//     });
    
//     setCurrentConversationId(newConv.conversation_uuid);
//     window.firstMessageFromHome = text;
    
//   } catch (err) {
//     console.error("Failed to create chat from home:", err);
//     alert("Could not start a new chat. Please try again.");
//   }
// };

// In src/App.js

const handleHomeScreenSend = async (text) => {
  if (!text.trim()) return;
  if (!currentProject) {
    alert("Please select a project first.");
    return;
  }

  try {
    // 1. Create conversation on server FIRST
    const data = await startConversation(currentProject);

    // 2. Create a robust local object
    const newConv = {
      conversation_uuid: data.conversation_uuid,
      topic: data.topic || "New Chat",
      startDate: data.created_at || new Date().toISOString(),
      isResolved: false,
      user: loggedInUser?.userDetails,
      messages: [],        // Start empty
      messagesLoaded: true, // ✅ IMPORTANT: Tell Chatbot "I have loaded messages (there are none)"
      isNew: true,          // ✅ IMPORTANT: Tell Chatbot "This is new, don't fetch history"
      project: currentProject
    };

    // 3. Update State & Cache IMMEDIATELY
    setConversations((prev) => {
      const updated = [newConv, ...prev];
      
      // Save to cache right now so it survives a reload
      if (loggedInUser?.userDetails && currentProject) {
        const key = CACHE_KEY(loggedInUser.userDetails, currentProject);
        localStorage.setItem(key, JSON.stringify(updated));
      }
      return updated;
    });

    // 4. Pass the text to Chatbot to send
    window.firstMessageFromHome = text;

    // 5. Switch the view
    setCurrentConversationId(newConv.conversation_uuid);

  } catch (err) {
    console.error("Failed to create chat from home:", err);
    alert("Could not start a new chat. Please try again.");
  }
};
  useEffect(() => {
    const newChatFromHome = (e) => {
      handleHomeScreenSend(e.detail);
    };

    window.addEventListener("createNewChatFromHome", newChatFromHome);
    return () => window.removeEventListener("createNewChatFromHome", newChatFromHome);
  }, [loggedInUser, currentProject]);
  // -------------------------------------------------------------

const handleConversationUpdate = useCallback(async (conversationUuid) => {
  if (!currentProject || !loggedInUser?.userDetails) return;
  
  try {
    // Just update the topic if it changed (don't reload all conversations)
    const response = await getUserConversations(currentProject);
    let conversationsList = Array.isArray(response) ? response : response?.conversations || [];
    
    const key = CACHE_KEY(loggedInUser.userDetails, currentProject);
    const cachedData = localStorage.getItem(key);
    const cachedConversations = cachedData ? JSON.parse(cachedData) : [];
    
    setConversations(prev => {
      const updated = prev.map((conv) => {
        const serverConv = conversationsList.find(c => c.conversation_uuid === conv.conversation_uuid);
        const cached = cachedConversations.find(c => c.conversation_uuid === conv.conversation_uuid);
        
        if (!serverConv) return conv;
        
        return {
          ...conv,
          topic: serverConv.topic || conv.topic,
          isResolved: serverConv.is_resolved ?? conv.isResolved,
          // ✅ CRITICAL: Keep existing messages
          messages: conv.messages || cached?.messages || [],
          messagesLoaded: conv.messagesLoaded || cached?.messagesLoaded || false,
        };
      });
      
      // Update cache
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    });
    
  } catch (err) {
    console.error("Failed to update conversations:", err);
  }
}, [currentProject, loggedInUser]);
const saveMessagesToConversation = useCallback((conversationUuid, messages) => {
  setConversations(prev => {
    const updated = prev.map(conv => 
      conv.conversation_uuid === conversationUuid
        ? { ...conv, messages, messagesLoaded: true, isNew: false } //Updated for loader
        : conv
    );
    
    // ✅ CRITICAL: Update cache immediately
    if (loggedInUser?.userDetails && currentProject) {
      const key = CACHE_KEY(loggedInUser.userDetails, currentProject);
      localStorage.setItem(key, JSON.stringify(updated));
    }
    
    return updated;
  });
}, [loggedInUser, currentProject]);


const loadUsers = async () => {
  try {
    const data = await getAllUsers();
    console.log("loadUsers -> getAllUsers result:", data);
    setUsers(data);
  } catch (error) {
    console.error('Failed to load users:', error);
  }
};


  useEffect(() => {
    if (loggedInUser?.role === "admin") loadUsers();
  }, [loggedInUser]);

  // 👉 FETCH COSMOS DB CONVERSATIONS WHEN ADMIN OPENS THE TAB
useEffect(() => {
  if (loggedInUser?.role === "admin" && selectedAdminTab === "conversations") {
    loadAdminConversations();
  }
}, [loggedInUser, selectedAdminTab]);

  const handleResolveConversationForAdmin = (convUuid, resolutionNotes) => {
    setConversations((prev) =>
      prev.map((c) => c.conversation_uuid === convUuid ? { ...c, isResolved: true, resolutionNotes } : c)
    );
    setSelectedConversationForAdmin(null);
  };

const handleDeleteConversation = async (uuid) => {
  try {
    await deleteConversation(uuid);
    
    setConversations((prev) => {
      const updated = prev.filter((c) => c.conversation_uuid !== uuid);
      
      // ✅ Update cache
      if (loggedInUser?.userDetails && currentProject) {
        const key = CACHE_KEY(loggedInUser.userDetails, currentProject);
        localStorage.setItem(key, JSON.stringify(updated));
      }
      
      return updated;
    });
    
    if (currentConversationId === uuid) {
      setCurrentConversationId(null);
    }
  } catch (err) {
    console.error("Failed to delete conversation:", err);
    alert("Could not delete conversation.");
  }
};


  // --- RENDER ---
  if (currentUserRole === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (currentUserRole === "guest") {
    return <LoginPage onLogin={handleMockLogin} />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#ffffff', boxShadow: "0 2px 12px rgba(0,0,0,0.08)", borderBottom: "1px solid #e5e7eb" }} elevation={0}>
        <Toolbar>
          {currentUserRole === 'user' && (
            <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ mr: 2 }}><MenuIcon /></IconButton>
          )}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <img src={customLogo} alt="Logo" style={{ height: 32 }} />
              <Typography variant="h6" color="primary" fontWeight="bold">SVAYAM-AMS</Typography>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Avatar sx={{ bgcolor: "transparent", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                  {loggedInUser.userDetails?.charAt(0)?.toUpperCase() || "U"}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Stack>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flexGrow: 1, mt: `${appBarHeight}px`, height: `calc(100vh - ${appBarHeight}px)` }}>
        {currentUserRole === 'user' ? (
          <>
            <UserSidebar 
              sidebarOpen={sidebarOpen}
              appBarHeight={appBarHeight}
              conversations={conversations} 
              onNewChat={handleNewChat} 
              onSelectConversation={setCurrentConversationId} 
              currentConversationId={currentConversationId}
              onDeleteConversation={handleDeleteConversation}
              isLoading={isLoadingConversations}
              // Teammate's Project Props
              projects={projectOptions}
              selectedProject={currentProject}
              onSelectProject={(pid) => { setCurrentProject(pid); setCurrentConversationId(null); }}
            />
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Chatbot 
                    currentConversation={currentConversation}
                    onConversationUpdate={handleConversationUpdate}
                     onSaveMessages={saveMessagesToConversation}
                    selectedProject={currentProject} 
                />
            </Box>
          </>
        ) : (
          <>
            <AdminSidebar selectedTab={selectedAdminTab} onTabChange={setSelectedAdminTab} appBarHeight={appBarHeight} />
            <Box component="main" sx={{ flexGrow: 1, p: 4, overflow: 'auto', bgcolor: '#f8fafc' }}>
              
              {selectedAdminTab === 'dashboard' && (
                 <Box maxWidth="lg" mx="auto">
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h4" fontWeight="800" sx={{ color: '#1e293b', mb: 1 }}>
                            Dashboard Overview
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Welcome back, {loggedInUser.userDetails}. Here's what's happening today.
                        </Typography>
                      </Box>
                      <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => window.location.reload()}>
                        Refresh
                      </Button>
                    </Box>

                    {/* --- ROW 1: General App Stats --- */}
                    <Typography variant="h6" sx={{ mb: 2, mt: 1, fontWeight: 600, color: '#64748b' }}>Application Stats</Typography>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                      <Grid item xs={12} sm={6} md={4}>
                        <StatCard title="Total Users" value={users.length} icon={<PeopleAltIcon fontSize="large" />} color="#3b82f6" />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <StatCard title="Open Conversations" value={stats.open} icon={<ConfirmationNumberIcon fontSize="large" />} color="#f59e0b" />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <StatCard title="Resolved" value={stats.resolved} icon={<CheckCircleIcon fontSize="large" />} color="#10b981" />
                      </Grid>
                    </Grid>

                    {/* --- ROW 2: AI / LangSmith Stats (Your Enhancements) --- */}
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#64748b' }}>AI Performance (Last 7 Days)</Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={3}>
                        <StatCard title="AI Interactions" value={llmStats.total_requests} icon={<ArticleIcon fontSize="large" />} color="#8b5cf6" />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <StatCard title="Tokens Used" value={llmStats.total_tokens.toLocaleString()} icon={<PsychologyIcon fontSize="large" />} color="#ec4899" />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <StatCard title="Est. Cost" value={`$${llmStats.total_cost}`} icon={<AttachMoneyIcon fontSize="large" />} color="#22c55e" />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <StatCard title="Avg Latency" value={`${llmStats.avg_latency}s`} icon={<SpeedIcon fontSize="large" />} color="#f97316" />
                      </Grid>
                    </Grid>

                    {/* --- ROW 3: Analytics Graphs (Stacked Full Width) --- */}
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#64748b', marginTop: 4 }}>Graphical Statistics</Typography>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                      {/* Graph 1: Traffic & Latency */}
                      <Grid item xs={12} md={6} width={600}>
                        <Paper sx={{ p: 3, borderRadius: 3, height: 450, width: 700, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#1e293b' }}>
                            Daily Traffic & Latency Trend
                          </Typography>
                          <ResponsiveContainer width="100%" height="85%">
                            <ComposedChart data={llmStats.daily_trends} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                              <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={(str) => str.slice(5)} axisLine={false} tickLine={false} dy={10} />
                              <YAxis yAxisId="left" orientation="left" stroke="#8b5cf6" tick={{fontSize: 12, fill: '#8b5cf6'}} axisLine={false} tickLine={false} width={40} />
                              <YAxis yAxisId="right" orientation="right" stroke="#f97316" tick={{fontSize: 12, fill: '#f97316'}} axisLine={false} tickLine={false} width={40} tickFormatter={(val) => `${val}s`} />
                              <RechartsTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} labelStyle={{ fontWeight: 600, color: '#1e293b' }} cursor={{ fill: '#f1f5f9' }} />
                              <Legend verticalAlign="top" height={36} iconType="circle" />
                              <Bar yAxisId="left" dataKey="requests" name="Requests" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={30} fillOpacity={0.9} />
                              <Line yAxisId="right" type="monotone" dataKey="avg_latency" name="Avg Latency" stroke="#f97316" strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: '#fff'}} activeDot={{r: 6, strokeWidth: 0}} />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </Paper>
                      </Grid>
                      {/* Graph 2: Tokens */}
                      <Grid item xs={12} md={6} width={700}>
                        <Paper sx={{ p: 3, borderRadius: 3, height: 450, with: 700, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#1e293b' }}>
                            Daily Token Usage
                          </Typography>
                          <ResponsiveContainer width="100%" height="85%">
                            <AreaChart data={llmStats.daily_trends} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                              <defs>
                                <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                              <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={(str) => str.slice(8)} axisLine={false} tickLine={false} dy={10} />
                              <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} width={35} tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value} />
                              <RechartsTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} labelStyle={{ fontWeight: 600, color: '#1e293b' }} />
                              <Legend verticalAlign="top" height={36} iconType="circle" />
                              <Area type="monotone" dataKey="tokens" name="Tokens" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorTokens)" dot={{r: 4, fill: '#ec4899', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </Paper>
                      </Grid>
                    </Grid>
                 </Box>
              )}

              {selectedAdminTab === 'users' && (
                 <Paper elevation={0} sx={{ bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, display: 'flex', flexDirection: 'column', width: '100%', height: 'calc(100vh - 140px)', overflow: 'auto'   }}>
                   {/* Keeping Teammate's UserManagement Component */}
                   <UserManagement users={users} onUsersChange={loadUsers} />
                 </Paper>
              )}
              
              {selectedAdminTab === 'knowledge-base' && (
                <Paper elevation={0} sx={{ bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden', width: '100%', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
                  <KnowledgeBaseManagement />
                </Paper>
              )}
              
              {selectedAdminTab === "feedback" && (
                <Paper sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", overflow: "hidden", p: 3 }}>
                  <FeedbackManagement />
                </Paper>
              )}
              
{selectedAdminTab === 'conversations' && (
  <>
    <Paper elevation={0} 
      sx={{ bgcolor: '#ffffff', border: '1px solid #e2e8f0',
      borderRadius: 2, overflow: 'hidden' }}>
      
      <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
          All Conversations
        </Typography>
      </Box>

      <Box sx={{ p: 3 }}>
        {conversations.length === 0 ? (
          <Typography color="text.secondary" align="center">
            No conversations found
          </Typography>
        ) : (
          <RecentConversationList
            conversations={conversations}
            users={users}
            onConversationClick={setSelectedConversationForAdmin}
          />
        )}
      </Box>
    </Paper>

    <Dialog open={Boolean(selectedConversationForAdmin)}
      onClose={() => setSelectedConversationForAdmin(null)}
      maxWidth="md" fullWidth PaperProps={{ sx: { height: '80vh', overflow: 'hidden', borderRadius: 3 } }}>
      
      {selectedConversationForAdmin && (
        <AdminChatView
          conversation={selectedConversationForAdmin}
          onClose={() => setSelectedConversationForAdmin(null)}
        />
      )}
    </Dialog>
  </>
)}

            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

export default App;