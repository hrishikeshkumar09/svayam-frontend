// src/components/Admin/AdminChatView.js
import React from 'react';
import { Box, Typography, Paper, IconButton, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ReactMarkdown from 'react-markdown'; // Import Markdown

const AdminChatView = ({ conversation, onClose }) => {
  if (!conversation) return null;

  return (
    <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f8fafc' }}>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">{conversation.topic}</Typography>
          <Typography variant="caption" color="text.secondary">
            User: {conversation.user} • Date: {conversation.startDate}
            {conversation.isResolved && <Chip label="Resolved" size="small" color="success" sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} />}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Messages List */}
      <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto', bgcolor: '#fff', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {conversation.messages && conversation.messages.length > 0 ? (
          conversation.messages.map((msg, index) => {
            const isAi = msg.sender === 'ai';
            return (
              <Box key={index} sx={{ display: 'flex', justifyContent: isAi ? 'flex-start' : 'flex-end', mb: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: isAi ? 'row' : 'row-reverse', maxWidth: '85%', gap: 1 }}>
                  <AvatarIcon isAi={isAi} />
                  <Paper elevation={0} sx={{ 
                    p: 2, 
                    bgcolor: isAi ? '#f1f5f9' : '#e0f2fe', 
                    color: isAi ? '#1e293b' : '#0f172a',
                    borderRadius: 2,
                    borderTopLeftRadius: isAi ? 0 : 2,
                    borderTopRightRadius: isAi ? 2 : 0,
                    // Style Markdown content specifically
                    '& p': { m: 0, lineHeight: 1.6 },
                    '& ul, & ol': { mt: 1, mb: 1, pl: 2 },
                    '& li': { mb: 0.5 },
                    '& strong': { fontWeight: 600 },
                    '& code': { bgcolor: 'rgba(0,0,0,0.06)', p: '2px 4px', borderRadius: 1, fontFamily: 'monospace', fontSize: '0.9em' }
                  }}>
                    {/* --- Render Markdown Here --- */}
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </Paper>
                </Box>
              </Box>
            );
          })
        ) : (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>No messages in this conversation.</Typography>
        )}
      </Box>
    </Paper>
  );
};

const AvatarIcon = ({ isAi }) => (
  <Box sx={{ 
    width: 32, height: 32, borderRadius: '50%', 
    bgcolor: isAi ? 'primary.main' : 'secondary.main', 
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', flexShrink: 0, mt: 0.5
  }}>
    {isAi ? <SmartToyIcon sx={{ fontSize: 18 }} /> : <PersonIcon sx={{ fontSize: 18 }} />}
  </Box>
);

export default AdminChatView;