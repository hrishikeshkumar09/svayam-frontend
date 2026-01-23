// ========================================
// src/components/Admin/FeedbackManagement.js
// ========================================

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  alpha,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

import { getFeedbackStats, listAllFeedback } from '../../services/api';

const FeedbackManagement = () => {
  const [stats, setStats] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedbackData();
  }, []);

  const loadFeedbackData = async () => {
    try {
      // Load stats
      const statsData = await getFeedbackStats();
      setStats(statsData);
      
      // Load feedback list
      const listData = await listAllFeedback(50, 0);
      setFeedbackList(listData.feedbacks);
      
      setLoading(false);
    } catch (error) {
      console.error("Failed to load feedback:", error);
      setLoading(false);
    }
  };

  const getRatingIcon = (rating) => {
    if (rating >= 4) return <SentimentVerySatisfiedIcon sx={{ color: '#10b981', fontSize: 20 }} />;
    if (rating === 3) return <SentimentSatisfiedIcon sx={{ color: '#f59e0b', fontSize: 20 }} />;
    return <SentimentVeryDissatisfiedIcon sx={{ color: '#ef4444', fontSize: 20 }} />;
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return '#10b981';
    if (rating === 3) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
          User Feedback
        </Typography>
        <Typography sx={{ color: '#64748b' }}>
          Monitor user satisfaction and improve assistant performance
        </Typography>
      </Box>

      {/* Statistics Cards */}
{/* Statistics Cards */}
{stats && (
  <Grid container spacing={3} sx={{ mb: 4 }}>

    {/* Total Feedback */}
    <Grid item xs={12} sm={6} md={3}>
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          bgcolor: "#ffffff",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e293b" }}>
          {stats.total}
        </Typography>
        <Typography sx={{ color: "#6b7280", mt: 1 }}>
          Total Feedback
        </Typography>
      </Paper>
    </Grid>

    {/* Average Rating */}
    <Grid item xs={12} sm={6} md={3}>
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          bgcolor: "#ffffff",
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e293b" }}>
            {stats.average}
          </Typography>
          <StarIcon sx={{ color: '#fbbf24', fontSize: 30 }} />
        </Box>
        <Typography sx={{ color: "#6b7280", mt: 1 }}>
          Average Rating
        </Typography>
      </Paper>
    </Grid>

    {/* Positive */}
    <Grid item xs={12} sm={6} md={3}>
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          bgcolor: "#ffffff",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#16a34a" }}>
          {stats.positive}
        </Typography>
        <Typography sx={{ color: "#6b7280", mt: 1 }}>
          Positive (4-5 ⭐)
        </Typography>
      </Paper>
    </Grid>

    {/* Negative */}
    <Grid item xs={12} sm={6} md={3}>
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          bgcolor: "#ffffff",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#dc2626" }}>
          {stats.negative}
        </Typography>
        <Typography sx={{ color: "#6b7280", mt: 1 }}>
          Negative (1-2 ⭐)
        </Typography>
      </Paper>
    </Grid>

  </Grid>
)}

      {/* Rating Distribution  */}
      {stats && stats.by_rating && (
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Typography variant="h6" sx={{ mb: 4, fontWeight: 600, color: '#0f172a' }}>
            Rating Distribution
          </Typography>
          
          <Box sx={{ maxWidth: 800 }}>
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.by_rating[rating] || 0;
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              
              return (
                <Box 
                  key={rating}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 3,
                    mb: 2.5,
                    '&:last-child': { mb: 0 }
                  }}
                >
                  {/* Rating with Star */}
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5,
                      minWidth: 50,
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: 15, color: '#0f172a' }}>
                      {rating}
                    </Typography>
                    <StarIcon sx={{ fontSize: 20, color: '#fbbf24' }} />
                  </Box>
                  
                  {/* Progress Bar */}
                  <Box
                    sx={{
                      flexGrow: 1,
                      height: 10,
                      bgcolor: '#e5e7eb',
                      borderRadius: 1,
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        width: `${percentage}%`,
                        bgcolor: getRatingColor(rating),
                        transition: 'width 0.6s ease',
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                  
                  {/* Count */}
                  <Typography 
                    sx={{ 
                      minWidth: 90,
                      fontWeight: 500,
                      fontSize: 14,
                      color: '#64748b',
                    }}
                  >
                    {count.toLocaleString()} {count === 1 ? 'user' : 'users'}
                  </Typography>
                </Box>
              );
            })}
          </Box>
          
          {/* Total Summary */}
          <Box 
            sx={{ 
              mt: 4, 
              pt: 3, 
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography sx={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>
              Total Ratings
            </Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#0f172a' }}>
              {stats.total.toLocaleString()} {stats.total === 1 ? 'rating' : 'ratings'}
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Feedback List */}
      <Paper sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <Box sx={{ p: 3, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Recent Feedback ({feedbackList.length})
          </Typography>
        </Box>

        {feedbackList.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>
              No feedback received yet
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: 14, mt: 1 }}>
              Feedback will appear here once users start rating their conversations
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, bgcolor: '#f8fafc' }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: '#f8fafc' }}>Conversation</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: '#f8fafc' }}>Rating</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: '#f8fafc' }}>Comment</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: '#f8fafc' }}>Messages</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: '#f8fafc' }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {feedbackList.map((fb) => (
                  <TableRow
                    key={fb.id}
                    sx={{
                      '&:hover': { bgcolor: '#f9fafb' },
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {fb.user_email}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{ maxWidth: 250, color: '#64748b' }}
                      >
                        {fb.conversation_topic}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getRatingIcon(fb.rating)}
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              sx={{
                                fontSize: 16,
                                color: i < fb.rating ? '#fbbf24' : '#d1d5db',
                              }}
                            />
                          ))}
                        </Box>
                        <Chip
                          label={fb.rating}
                          size="small"
                          sx={{
                            bgcolor: alpha(getRatingColor(fb.rating), 0.1),
                            color: getRatingColor(fb.rating),
                            fontWeight: 600,
                            fontSize: 12,
                          }}
                        />
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          color: fb.comment ? '#0f172a' : '#94a3b8',
                          fontStyle: fb.comment ? 'normal' : 'italic',
                          maxWidth: 300,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {fb.comment || 'No comment'}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Chip
                        label={`${fb.message_count} msgs`}
                        size="small"
                        sx={{
                          bgcolor: '#f1f5f9',
                          color: '#64748b',
                          fontSize: 11,
                        }}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {new Date(fb.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default FeedbackManagement;