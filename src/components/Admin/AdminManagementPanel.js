// // src/components/Admin/AdminManagementPanel.js
// import React, { useState } from 'react';
// import {
//   Box,
//   Typography,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   InputAdornment
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import EditIcon from '@mui/icons-material/Edit';
// import SearchIcon from '@mui/icons-material/Search';

// const AdminManagementPanel = ({ users, onAddUser, onUpdateUser, onDeleteUser }) => {
//   const [openAdd, setOpenAdd] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
//   const [formUser, setFormUser] = useState({ name: '', email: '', role: 'agent' });
//   const [searchTerm, setSearchTerm] = useState('');

//   const handleOpenAdd = () => { 
//     setFormUser({ name: '', email: '', role: 'agent' }); 
//     setEditingUser(null); 
//     setOpenAdd(true); 
//   };
  
//   const handleCloseAdd = () => { 
//     setOpenAdd(false); 
//     setEditingUser(null); 
//   };

//   const handleSaveUser = () => {
//     if (editingUser) {
//       onUpdateUser(editingUser.id, { ...editingUser, ...formUser });
//     } else {
//       onAddUser(formUser);
//     }
//     handleCloseAdd();
//   };

//   const handleEdit = (user) => {
//     setEditingUser(user);
//     setFormUser({ name: user.name, email: user.email, role: user.role || 'agent' });
//     setOpenAdd(true);
//   };

//   const filteredUsers = users.filter(u => 
//     u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     u.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//       {/* Header */}
//       <Box sx={{ 
//         p: 2.5, 
//         borderBottom: '1px solid #e2e8f0', 
//         display: 'flex', 
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         flexShrink: 0
//       }}>
//         <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
//           User Management
//         </Typography>
//         <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
//           <TextField
//             size="small"
//             placeholder="Search users..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
//                 </InputAdornment>
//               ),
//             }}
//             sx={{ 
//               width: 200,
//               '& .MuiOutlinedInput-root': {
//                 fontSize: '0.875rem',
//                 '& fieldset': {
//                   borderColor: '#e2e8f0',
//                 },
//               }
//             }}
//           />
//           <Button 
//             variant="contained" 
//             startIcon={<AddIcon />} 
//             onClick={handleOpenAdd}
//             sx={{ whiteSpace: 'nowrap' }}
//           >
//             Add User
//           </Button>
//         </Box>
//       </Box>

//       {/* Table Container with Scroll */}
//       <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
//         <TableContainer>
//           <Table stickyHeader>
//             <TableHead>
//               <TableRow>
//                 <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 600 }}>Name</TableCell>
//                 <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 600 }}>Email</TableCell>
//                 <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 600 }}>Role</TableCell>
//                 <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 600 }} align="right">Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredUsers.map(u => (
//                 <TableRow key={u.id} hover>
//                   <TableCell>{u.name}</TableCell>
//                   <TableCell>{u.email}</TableCell>
//                   <TableCell>{u.role}</TableCell>
//                   <TableCell align="right">
//                     <IconButton size="small" onClick={() => handleEdit(u)}>
//                       <EditIcon fontSize="small" />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>

//       {/* Dialog */}
//       <Dialog open={openAdd} onClose={handleCloseAdd} fullWidth maxWidth="sm">
//         <DialogTitle>{editingUser ? 'Edit User' : 'Add User'}</DialogTitle>
//         <DialogContent>
//           <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
//             <TextField 
//               label="Name" 
//               value={formUser.name} 
//               onChange={e=>setFormUser({...formUser, name: e.target.value})} 
//               fullWidth 
//             />
//             <TextField 
//               label="Email" 
//               value={formUser.email} 
//               onChange={e=>setFormUser({...formUser, email: e.target.value})} 
//               fullWidth 
//             />
//             <TextField 
//               label="Role" 
//               value={formUser.role} 
//               onChange={e=>setFormUser({...formUser, role: e.target.value})} 
//               fullWidth 
//             />
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseAdd}>Cancel</Button>
//           <Button 
//             variant="contained" 
//             onClick={handleSaveUser} 
//             disabled={!formUser.name || !formUser.email}
//           >
//             {editingUser ? 'Save' : 'Add'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default AdminManagementPanel;

// src/components/Admin/AdminManagementPanel.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Breadcrumbs,
  Link,
  CircularProgress,
  alpha,
} from '@mui/material';

import PeopleIcon from '@mui/icons-material/People';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ChatIcon from '@mui/icons-material/Chat';
import RefreshIcon from '@mui/icons-material/Refresh';
import StarIcon from '@mui/icons-material/Star';

// Import your existing components
import UserManagement from './UserManagement';
import KnowledgeBaseManagement from './KnowledgeBaseManagement';
import FeedbackManagement from './FeedbackManagement';
import RecentConversationList from './RecentConversationList';
import EngineerTicketDetail from '../EngineerTicketDetail';
import { getAdminRecentConversations } from '../../services/api';import { 
  getAllUsers, 
  getFeedbackStats 
} from '../../services/api';

// ========================================
// STATS CARD COMPONENT
// ========================================

const quickCardStyle = (color, bgColor, shadowColor) => ({
  cursor: "pointer",
  p: 2.5,
  borderRadius: 3,
  background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
  border: "1px solid #e2e8f0",
  boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
  display: "flex",
  alignItems: "center",
  gap: 2,
  transition: "all 0.2s ease",
  "&:hover": {
    boxShadow: `0 8px 24px ${shadowColor}`,
    transform: "translateY(-4px)",
    borderColor: color,
  },
});

const CardIconBox = ({ icon, color }) => (
  <Box
    sx={{
      width: 48,
      height: 48,
      borderRadius: "999px",
      bgcolor: color.replace("1)", "0.1)"),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color,
    }}
  >
    {icon}
  </Box>
);

const CardText = ({ title, desc }) => (
  <Box>
    <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#0f172a", mb: 0.5 }}>
      {title}
    </Typography>
    <Typography sx={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>
      {desc}
    </Typography>
  </Box>
);

const StatsCard = ({ title, value, icon, caption, iconColor = '#667eea' }) => {

  return (
    <Paper
      sx={{
        p: 2.5,
        textAlign: 'center',
        height: 150,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 3,
        background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            bgcolor: alpha(iconColor, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: iconColor,
          }}
        >
          {icon}
        </Box>
      </Box>

      <Box>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color: '#64748b',
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            mb: 1
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: '#0f172a',
            fontSize: 32,
            lineHeight: 1,
            mb: 0.5
          }}
        >
          {value}
        </Typography>

        {caption && (
          <Typography
            sx={{
              fontSize: 11,
              color: '#6b7280',
              fontWeight: 500
            }}
          >
            {caption}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

// ========================================
// MAIN ADMIN MANAGEMENT PANEL
// ========================================
const AdminManagementPanel = ({ 
  selectedAdminTab, 
  setSelectedAdminTab, 
  loggedInUser 
}) => {
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversationForAdmin, setSelectedConversationForAdmin] = useState(null);
  const [feedbackStats, setFeedbackStats] = useState({
    total: 0,
    average: 0,
  });

  useEffect(() => {
    loadUsers();
    loadConversations();
    loadFeedbackStats();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };
const loadConversations = async () => {
  try {
    const data = await getAdminRecentConversations();
    setConversations(data);
  } catch (error) {
    console.error("Failed to load admin conversations:", error);
  }

  const loadFeedbackStats = async () => {
    try {
      const stats = await getFeedbackStats();
      setFeedbackStats({
        total: stats.total || 0,
        average: stats.average || 0,
      });
    } catch (error) {
      console.error("Failed to load feedback stats:", error);
    }
  };

  const handleResolveConversationForAdmin = async (conversationId, notes) => {
    console.log('Resolve conversation:', conversationId, notes);
    setSelectedConversationForAdmin(null);
    loadConversations();
  };

  // ========================================
  // DASHBOARD VIEW
  // ========================================
  if (selectedAdminTab === "dashboard") {
    return (
      <Box sx={{ p: 3 }}>
        {/* Header row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#0f172a",
                letterSpacing: "-0.03em",
                mt: 0.5,
                fontSize: { xs: 20, md: 24 }
              }}
            >
              Welcome back, {loggedInUser?.email || 'Admin'}!
            </Typography>
            <Breadcrumbs
              sx={{
                fontSize: 13,
                color: '#94a3b8',
                mt: 1
              }}
            >
              <Link
                underline="hover"
                color="inherit"
                sx={{ cursor: 'pointer' }}
              >
                Admin
              </Link>
              <Typography
                sx={{
                  fontSize: 13,
                  color: '#0f172a',
                  fontWeight: 500
                }}
              >
                Dashboard
              </Typography>
            </Breadcrumbs>
          </Box>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => {
              loadUsers();
              loadConversations();
              loadFeedbackStats();
            }}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              borderColor: "#e2e8f0",
              color: "#64748b",
              fontWeight: 500,
              px: 2.5,
              "&:hover": {
                borderColor: "#667eea",
                bgcolor: alpha("#667eea", 0.05),
                color: "#667eea",
              },
            }}
          >
            Refresh Data
          </Button>
        </Box>

{/* ====================== KPI ROW (4 CARDS) ======================= */}
{/* ================== TOP 3 STAT CARDS ================== */}
<Grid container spacing={3} sx={{ mb: 4 }}>

  {/* Total Users */}
  <Grid item xs={12} sm={6} md={4}>
    <StatsCard
      title="Total Users"
      value={users.length}
      icon={<PeopleIcon sx={{ fontSize: 22 }} />}
      caption="All active accounts in the system"
      iconColor="#3b82f6"
    />
  </Grid>

  {/* AI Responses */}
  <Grid item xs={12} sm={6} md={4}>
    <StatsCard
      title="AI Responses"
      value="1.2k"
      icon={<SmartToyIcon sx={{ fontSize: 22 }} />}
      caption="Messages assisted by AI"
      iconColor="#6366f1"
    />
  </Grid>

  {/* User Feedback (Wide Card) */}
  <Grid item xs={12} md={4}>
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
        border: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        gap: 2,
        height: "100%",
      }}
    >
      <StarIcon sx={{ fontSize: 30, color: "#f59e0b" }} />
      <Box>
        <Typography sx={{ fontWeight: 600, fontSize: 16, color: "#0f172a" }}>
          User Feedback
        </Typography>
        <Typography sx={{ color: "#64748b", fontSize: 14 }}>
          Monitor ratings and improve AI performance.
        </Typography>
      </Box>
    </Paper>
  </Grid>

</Grid>


{/* ================== QUICK ACTIONS (4 CARDS ALIGNED) ================== */}
<Box sx={{ mb: 4 }}>
  <Typography 
    sx={{ 
      fontWeight: 600, 
      color: "#0f172a", 
      fontSize: 17,
      mb: 2.5,
      letterSpacing: '-0.01em'
    }}
  >
    Quick Actions
  </Typography>

  <Grid container spacing={3}>

    {/* Manage Users */}
    <Grid item xs={12} sm={6} lg={3}>
      <Paper sx={quickCardStyle("#2563eb", "rgba(59,130,246,0.1)", "rgba(59,130,246,0.15)")}
        onClick={() => setSelectedAdminTab("users")}
      >
        <CardIconBox icon={<PeopleIcon sx={{ fontSize: 24 }} />} color="#2563eb" />
        <CardText title="Manage Users" desc="Add, update, and assign roles to users." />
      </Paper>
    </Grid>

    {/* Knowledge Base */}
    <Grid item xs={12} sm={6} lg={3}>
      <Paper sx={quickCardStyle("#7c3aed", "rgba(139,92,246,0.1)", "rgba(139,92,246,0.15)")}
        onClick={() => setSelectedAdminTab("knowledge-base")}
      >
        <CardIconBox icon={<LibraryBooksIcon sx={{ fontSize: 24 }} />} color="#7c3aed" />
        <CardText title="Knowledge Base" desc="Upload and organize documents for AI." />
      </Paper>
    </Grid>

    {/* Conversations */}
    <Grid item xs={12} sm={6} lg={3}>
      <Paper sx={quickCardStyle("#059669", "rgba(16,185,129,0.1)", "rgba(16,185,129,0.15)")}
        onClick={() => setSelectedAdminTab("conversations")}
      >
        <CardIconBox icon={<ChatIcon sx={{ fontSize: 24 }} />} color="#059669" />
        <CardText title="Conversations" desc="Review and resolve AI-assisted tickets." />
      </Paper>
    </Grid>

    {/* Feedback */}
    <Grid item xs={12} sm={6} lg={3}>
      <Paper sx={quickCardStyle("#f59e0b", "rgba(251,191,36,0.1)", "rgba(251,191,36,0.15)")}
        onClick={() => setSelectedAdminTab("feedback")}
      >
        <CardIconBox icon={<StarIcon sx={{ fontSize: 24 }} />} color="#f59e0b" />
        <CardText title="Feedback" desc="Review ratings & improve AI performance." />
      </Paper>
    </Grid>

  </Grid>
</Box>

        {/* Recent conversations */}
        <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={{ fontWeight: 600, color: "#0f172a", fontSize: 17 }}>
            Recent Conversations
          </Typography>
          <Typography sx={{ fontSize: 12, color: "#6b7280" }}>
            Showing latest activity across your workspace
          </Typography>
        </Box>

        <Paper
          sx={{
            borderRadius: 3,
            boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
            overflow: 'hidden',
          }}
        >
          {conversations.length === 0 ? (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <CircularProgress size={40} sx={{ color: '#667eea' }} />
              <Typography sx={{ mt: 2, color: '#6b7280', fontSize: 14 }}>
                Loading conversations...
              </Typography>
            </Box>
          ) : (
            <RecentConversationList
              conversations={conversations}
              users={users}
              onConversationClick={setSelectedConversationForAdmin}
            />
          )}
        </Paper>

        {selectedConversationForAdmin && (
          <Paper sx={{ p: 3, mt: 3, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <EngineerTicketDetail
              ticket={{
                id: selectedConversationForAdmin.conversation_uuid,
                title: selectedConversationForAdmin.topic,
                description:
                  selectedConversationForAdmin.messages
                    ?.map((m) => `${m.sender}: ${m.text}`)
                    .join("\n\n") || "",
                status: selectedConversationForAdmin.isResolved ? "resolved" : "open",
                priority: selectedConversationForAdmin.priority || "Medium",
                user: selectedConversationForAdmin.user,
                createdAt: selectedConversationForAdmin.startDate,
                engineerNotes: selectedConversationForAdmin.resolutionNotes || "",
                llmSuggestion: "AI Chat conversation. Review messages above.",
                llmCost: 0,
                llmTokens: 0,
                llmModel: "",
              }}
              onBack={() => setSelectedConversationForAdmin(null)}
              onResolveTicket={handleResolveConversationForAdmin}
            />
          </Paper>
        )}
      </Box>
    );
  }

  // ========================================
  // USERS TAB
  // ========================================
  if (selectedAdminTab === "users") {
    return <UserManagement users={users} onUsersChange={loadUsers} />;
  }

  // ========================================
  // KNOWLEDGE BASE TAB
  // ========================================
  if (selectedAdminTab === "knowledge-base") {
    return <KnowledgeBaseManagement />;
  }

  // ========================================
  // FEEDBACK TAB
  // ========================================
  if (selectedAdminTab === "feedback") {
    return <FeedbackManagement />;
  }

  // ========================================
  // CONVERSATIONS TAB
  // ========================================
  if (selectedAdminTab === "conversations") {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 3 }}>
          All Conversations
        </Typography>
        <Typography sx={{ color: '#64748b', mb: 3 }}>
          Review and manage all user conversations
        </Typography>
        
        <Paper
          sx={{
            borderRadius: 3,
            boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
            overflow: 'hidden',
          }}
        >
          {conversations.length === 0 ? (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <Typography sx={{ color: '#6b7280' }}>
                No conversations found
              </Typography>
            </Box>
          ) : (
            <RecentConversationList
              conversations={conversations}
              users={users}
              onConversationClick={setSelectedConversationForAdmin}
            />
          )}
        </Paper>
      </Box>
    );
  }

  return null;
};

export default AdminManagementPanel;
