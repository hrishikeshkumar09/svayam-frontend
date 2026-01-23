// // src/components/Admin/ConversationCard.js
// import React from 'react';
// import { Paper, Typography, Stack, Avatar, Chip } from '@mui/material';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// const ConversationCard = ({ conversation = {}, users = [], onClick }) => {
//   const messages = conversation?.messages || [];
//   const lastMessage = messages.length ? messages[messages.length - 1] : null;
//   const user = users.find(u => u.name === conversation?.user) || null;

//   const handleClick = () => {
//     if (typeof onClick === 'function') onClick(conversation);
//   };

//   return (
//     <Paper
//       onClick={handleClick}
//       sx={{
//         p: 2,
//         mb: 2,
//         cursor: typeof onClick === 'function' ? 'pointer' : 'default',
//         '&:hover': { boxShadow: 6 },
//       }}
//       elevation={1}
//     >
//       <Stack direction="row" spacing={2} alignItems="center">
//         <Avatar>{user ? user.name?.[0] : (conversation?.user?.[0] || '?')}</Avatar>
//         <Stack sx={{ flex: 1 }}>
//           <Stack direction="row" justifyContent="space-between" alignItems="center">
//             <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
//               {conversation?.topic || 'Untitled conversation'}
//             </Typography>
//             <Chip
//               size="small"
//               icon={conversation?.isResolved ? <CheckCircleOutlineIcon /> : <HelpOutlineIcon />}
//               label={conversation?.isResolved ? 'Resolved' : 'Open'}
//             />
//           </Stack>

//           <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
//             {lastMessage?.text ? (lastMessage.text.length > 100 ? lastMessage.text.substring(0, 100) + '...' : lastMessage.text) : 'No messages yet.'}
//           </Typography>

//           <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
//             <Typography variant="caption" color="text.disabled">
//               {conversation?.startDate || '—'}
//             </Typography>
//             {conversation?.isResolved && (
//               <Typography variant="caption" color="text.disabled">
//                 • Resolved: {conversation?.resolvedDate || '—'}
//               </Typography>
//             )}
//           </Stack>
//         </Stack>
//       </Stack>
//     </Paper>
//   );
// };

// export default ConversationCard;


// src/components/Admin/ConversationCard.js
import React from 'react';
import { Paper, Typography, Stack, Avatar, Chip, Box } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ReactMarkdown from 'react-markdown'; 

const ConversationCard = ({ conversation = {}, users = [], onClick }) => {
  const messages = conversation?.messages || [];
  const lastMessage = messages.length ? messages[messages.length - 1] : null;
  
  const userObj = users.find(u => u.name === conversation?.user);
  const userName = userObj ? userObj.name : (conversation?.user || 'Unknown User');

  const handleClick = () => {
    if (typeof onClick === 'function') onClick(conversation);
  };

  return (
    <Paper
      onClick={handleClick}
      sx={{
        p: 2,
        mb: 2,
        cursor: typeof onClick === 'function' ? 'pointer' : 'default',
        '&:hover': { 
           boxShadow: 4,
           borderColor: 'primary.main',
           borderWidth: '1px',
           borderStyle: 'solid'
        },
        border: '1px solid transparent'
      }}
      elevation={1}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        {/* Avatar */}
        <Avatar sx={{ bgcolor: 'primary.light', color: 'white' }}>
          {userName.charAt(0).toUpperCase()}
        </Avatar>

        <Stack sx={{ flex: 1 }}>
          {/* Top Row: Topic + Status */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b' }}>
              {conversation?.topic || 'Untitled conversation'}
            </Typography>
            <Chip
              size="small"
              variant="outlined"
              color={conversation?.isResolved ? "success" : "warning"}
              icon={conversation?.isResolved ? <CheckCircleOutlineIcon /> : <HelpOutlineIcon />}
              label={conversation?.isResolved ? 'Resolved' : 'Open'}
            />
          </Stack>

          {/* Middle: Message Preview (With Markdown Support) */}
          <Box sx={{ 
            mt: 0.5, 
            mb: 1, 
            color: 'text.secondary',
            fontSize: '0.875rem',
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden',
            // Style the markdown children to look like normal text
            '& p': { margin: 0 }, 
            '& strong': { color: '#334155', fontWeight: 600 } 
          }}>
            {lastMessage?.text ? (
                <ReactMarkdown 
                    components={{
                        // Override paragraph to avoid extra margins breaking the layout
                        p: ({node, ...props}) => <span {...props} /> 
                    }}
                >
                    {lastMessage.text}
                </ReactMarkdown>
            ) : (
                'No messages yet.'
            )}
          </Box>

          {/* Bottom Row: User & Date */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {userName}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              — {conversation?.startDate || '—'}
            </Typography>
            
            {conversation?.isResolved && conversation?.resolvedDate && (
              <Typography variant="caption" color="text.disabled">
                • Resolved: {conversation.resolvedDate}
              </Typography>
            )}
          </Stack>

        </Stack>
      </Stack>
    </Paper>
  );
};

export default ConversationCard;