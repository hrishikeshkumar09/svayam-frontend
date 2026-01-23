// src/components/DashboardStats.js
import React from 'react';
import { Grid, Paper, Box, Typography, Stack, alpha } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';

const StatCard = ({ title, value, icon, iconColor, valueColor, emptyMessage, subtitle }) => {
  const isZero = value === 0 || value === '$0.000';
  
  return (
    <Grid item xs={12} sm={6} md={3}>
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
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
          <Box 
            sx={{ 
              width: 36,
              height: 36,
              borderRadius: '10px',
              bgcolor: alpha(iconColor || '#667eea', 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: iconColor,
              transition: 'all 0.2s ease',
            }}
          >
            {icon}
          </Box>
        </Stack>
        
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
              color: valueColor || '#0f172a',
              fontSize: 32,
              lineHeight: 1,
              mb: 0.5
            }}
          >
            {value}
          </Typography>
          
          {subtitle && (
            <Typography 
              sx={{ 
                fontSize: 11, 
                color: '#6b7280',
                fontWeight: 500
              }}
            >
              {subtitle}
            </Typography>
          )}
          
          {isZero && emptyMessage && (
            <Typography 
              sx={{ 
                fontSize: 11, 
                color: '#10b981',
                mt: 0.5,
                fontWeight: 500
              }}
            >
              {emptyMessage}
            </Typography>
          )}
        </Box>
      </Paper>
    </Grid>
  );
};

const DashboardStats = ({ stats }) => {
  // Calculate average rating if feedback exists
  const avgRating = stats.feedbackCount > 0 
    ? (stats.totalRating / stats.feedbackCount).toFixed(1) 
    : 'N/A';
  
  return (
    <Box sx={{ mb: 4 }}>
      {/* Primary Stats Row */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <StatCard
          title="Open"
          value={stats.open}
          icon={<ErrorOutlineIcon sx={{ fontSize: 20 }} />}
          iconColor="#f59e0b"
          emptyMessage="🎉 All caught up!"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={<HourglassEmptyIcon sx={{ fontSize: 20 }} />}
          iconColor="#3b82f6"
        />
        <StatCard
          title="Resolved"
          value={stats.resolved}
          icon={<CheckCircleOutlineIcon sx={{ fontSize: 20 }} />}
          iconColor="#10b981"
        />
        <StatCard
          title="Closed"
          value={stats.closed}
          icon={<CloseIcon sx={{ fontSize: 20 }} />}
          iconColor="#6b7280"
        />
      </Grid>

      {/* Secondary Stats Row */}
      <Grid container spacing={2.5}>
        <StatCard
          title="Total Conversations"
          value={stats.total}
          icon={<ChatBubbleIcon sx={{ fontSize: 20 }} />}
          iconColor="#8b5cf6"
          subtitle="All time"
        />
        <StatCard
          title="AI Assisted"
          value={stats.aiAssisted}
          icon={<FlashOnIcon sx={{ fontSize: 20 }} />}
          iconColor="#ec4899"
          subtitle={`${stats.aiAssistRate}% of total`}
        />
        <StatCard
          title="Avg Rating"
          value={avgRating}
          icon={<StarIcon sx={{ fontSize: 20 }} />}
          iconColor="#fbbf24"
          valueColor={avgRating >= 4 ? '#10b981' : avgRating >= 3 ? '#f59e0b' : '#ef4444'}
          subtitle={stats.feedbackCount > 0 ? `${stats.feedbackCount} reviews` : 'No reviews yet'}
        />
        <StatCard
          title="AI Costs"
          value={`$${stats.aiCosts.toFixed(2)}`}
          icon={<AttachMoneyIcon sx={{ fontSize: 20 }} />}
          iconColor="#ef4444"
          valueColor="#ef4444"
          subtitle="This month"
        />
      </Grid>
    </Box>
  );
};

export default DashboardStats;