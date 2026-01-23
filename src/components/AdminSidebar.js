// src/components/AdminSidebar.js
import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  alpha,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ChatIcon from '@mui/icons-material/Chat';
import StarIcon from '@mui/icons-material/Star';
const drawerWidth = 260;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: 'dashboard' },
  { text: 'Users', icon: <PeopleIcon />, path: 'users' },
  { text: 'Knowledge Base', icon: <LibraryBooksIcon />, path: 'knowledge-base' },
  { text: 'Conversations', icon: <ChatIcon />, path: 'conversations' },
  // { text: 'Feedback', icon: <StarIcon />, path: 'feedback' },
];

const AdminSidebar = ({ selectedTab, onTabChange, appBarHeight }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: '#ffffff',
          borderRight: '1px solid #e5e7eb',
          top: `${appBarHeight}px`,
          height: `calc(100vh - ${appBarHeight}px)`,
        },
      }}
    >
      <List sx={{ px: 2, py: 3 }}>
        {menuItems.map((item, index) => {
          const isSelected = selectedTab === item.path;
          return (
            <React.Fragment key={item.path}>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  selected={isSelected}
                  onClick={() => onTabChange(item.path)}
                  sx={{
                    borderRadius: 2,
                    color: isSelected ? '#667eea' : '#64748b',
                    bgcolor: isSelected ? alpha('#667eea', 0.1) : 'transparent',
                    border: '1px solid',
                    borderColor: isSelected ? alpha('#667eea', 0.3) : 'transparent',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: isSelected ? alpha('#667eea', 0.15) : alpha('#667eea', 0.05),
                      borderColor: alpha('#667eea', 0.2),
                      transform: 'translateX(4px)',
                    },
                    '&.Mui-selected': {
                      bgcolor: alpha('#667eea', 0.1),
                      '&:hover': {
                        bgcolor: alpha('#667eea', 0.15),
                      },
                    },
                    py: 1.5,
                    px: 2,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isSelected ? '#667eea' : '#94a3b8',
                      minWidth: 40,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.95rem',
                      fontWeight: isSelected ? 600 : 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
              
              {/* Add divider after Dashboard */}
              {item.path === 'dashboard' && (
                <Box 
                  sx={{ 
                    my: 1.5, 
                    mx: 2, 
                    borderBottom: '1px solid #f1f5f9' 
                  }} 
                />
              )}
            </React.Fragment>
          );
        })}
      </List>
    </Drawer>
  );
};

export default AdminSidebar;