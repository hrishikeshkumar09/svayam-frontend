// ========================================
// src/components/Admin/UserManagement.js
// ========================================

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  alpha,
  Breadcrumbs,
  Link,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import { createUser, updateUser, deleteUser } from '../../services/api';

const UserManagement = ({ users, onUsersChange }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user',
    name: '',
  });
  const [loading, setLoading] = useState(false);

  const handleOpenCreate = () => {
    setDialogMode('create');
    setFormData({
      email: '',
      password: '',
      role: 'user',
      name: '',
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (user) => {
    setDialogMode('edit');
    setSelectedUser(user);
    setFormData({
      email: user.email,
      password: '', // Don't show existing password
      role: user.role,
      name: user.name || '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setFormData({
      email: '',
      password: '',
      role: 'user',
      name: '',
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (dialogMode === 'create') {
        await createUser(formData);
      } else {
        // For edit, only send changed fields
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password; // Don't update password if empty
        }
        await updateUser(selectedUser.email, updateData);
      }
      
      onUsersChange(); // Reload users
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to save user:', error);
      alert(error.message || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (email) => {
    if (!window.confirm(`Are you sure you want to delete user: ${email}?`)) {
      return;
    }

    try {
      await deleteUser(email);
      onUsersChange(); // Reload users
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert(error.message || 'Failed to delete user');
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return '#ef4444';
      case 'engineer':
        return '#3b82f6';
      default:
        return '#10b981';
    }
  };

  const getRoleIcon = (role) => {
    return role === 'admin' ? (
      <AdminPanelSettingsIcon sx={{ fontSize: 16 }} />
    ) : (
      <PersonIcon sx={{ fontSize: 16 }} />
    );
  };

  return (
    <Box sx={{ p: 3 }}>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ fontSize: 13, color: '#94a3b8', mb: 1 }}>
          <Link underline="hover" color="inherit" sx={{ cursor: 'pointer' }}>
            Admin
          </Link>
          <Typography sx={{ fontSize: 13, color: '#0f172a', fontWeight: 500 }}>
            Users
          </Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
              User Management
            </Typography>
            <Typography sx={{ color: '#64748b' }}>
              Add, update, and manage user accounts and roles
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{
              bgcolor: '#667eea',
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(102,126,234,0.3)',
              '&:hover': {
                bgcolor: '#5568d3',
              },
            }}
          >
            Add User
          </Button>
        </Box>
      </Box>

      {/* Stats Summary */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {users.length}
            </Typography>
            <Typography sx={{ opacity: 0.9 }}>ID</Typography>
          </Box>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {users.filter(u => u.role === 'admin').length}
            </Typography>
            <Typography sx={{ opacity: 0.9 }}>Admins</Typography>
          </Box>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {users.filter(u => u.role === 'user').length}
            </Typography>
            <Typography sx={{ opacity: 0.9 }}>Users</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Users Table */}
      <Paper
        sx={{
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          overflow: 'auto'

        }}
      >
        <Box sx={{ p: 3, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            All Users ({users.length})
          </Typography>
        </Box>

        {users.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>
              No users found
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: 14, mt: 1 }}>
              Click "Add User" to create your first user
            </Typography>
          </Box>
        ) : (
<TableContainer sx={{ flexGrow: 1, overflowY: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, bgcolor: '#f8fafc' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: '#f8fafc' }}>Full Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: '#f8fafc' }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: '#f8fafc' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: '#f8fafc' }} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.email}
                    sx={{
                      '&:hover': { bgcolor: '#f9fafb' },
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {user.email}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        {user.name || '-'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        icon={getRoleIcon(user.role)}
                        label={user.role.toUpperCase()}
                        size="small"
                        sx={{
                          bgcolor: alpha(getRoleColor(user.role), 0.1),
                          color: getRoleColor(user.role),
                          fontWeight: 600,
                          fontSize: 11,
                          textTransform: 'uppercase',
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label="Active"
                        size="small"
                        sx={{
                          bgcolor: alpha('#10b981', 0.1),
                          color: '#10b981',
                          fontWeight: 600,
                          fontSize: 11,
                        }}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEdit(user)}
                        sx={{
                          color: '#3b82f6',
                          '&:hover': { bgcolor: alpha('#3b82f6', 0.1) },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={() => handleDelete(user.email)}
                        sx={{
                          color: '#ef4444',
                          ml: 1,
                          '&:hover': { bgcolor: alpha('#ef4444', 0.1) },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Create/Edit User Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {dialogMode === 'create' ? 'Create New User' : 'Edit User'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {dialogMode === 'create'
              ? 'Add a new user to the system'
              : 'Update user information and role'}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={dialogMode === 'edit'} // Can't change email when editing
              fullWidth
              required
            />

            <TextField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              required={dialogMode === 'create'}
              helperText={
                dialogMode === 'edit'
                  ? 'Leave blank to keep current password'
                  : 'Minimum 6 characters'
              }
            />

            <TextField
              label="Role"
              name="role"
              select
              value={formData.role}
              onChange={handleInputChange}
              fullWidth
              required
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="engineer">Engineer</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !formData.email || (dialogMode === 'create' && !formData.password)}
            sx={{
              bgcolor: '#667eea',
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#5568d3',
              },
            }}
          >
            {loading ? 'Saving...' : dialogMode === 'create' ? 'Create User' : 'Update User'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;