import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  Water as WaterIcon,
  Build as BuildIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AquariumService } from '../services/aquariumService';
import { TankMaintenanceService } from '../services/tankMaintenanceService';
import { TankMaintenance } from '../types/tankMaintenance';

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAquariums: 0,
    totalMaintenance: 0,
    pendingMaintenance: 0
  });

  useEffect(() => {
    if (user?.email) {
      loadStats();
    }
  }, [user?.email]);

  const loadStats = async () => {
    try {
      const [layouts, maintenance] = await Promise.all([
        AquariumService.getLayoutsByOwner(user?.email || ''),
        TankMaintenanceService.getByOwner(user?.email || '') as Promise<TankMaintenance[]>
      ]);

      setStats({
        totalAquariums: layouts.length,
        totalMaintenance: maintenance.length,
        pendingMaintenance: maintenance.filter((m: TankMaintenance) => m.completed === 0).length
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={logout}
        >
          Logout
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(12, 1fr)' }, gap: 3 }}>
        {/* User Info Card */}
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 4' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              User Information
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary={user?.first_name} secondary="Name" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText primary={user?.email} secondary="Email" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText primary={user?.role} secondary="Role" />
              </ListItem>
            </List>
          </Paper>
        </Box>

        {/* Quick Stats */}
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 8' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Stats
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <WaterIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">{stats.totalAquariums}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Aquariums
                  </Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <BuildIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">{stats.totalMaintenance}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Maintenance Tasks
                  </Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AddIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">{stats.pendingMaintenance}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Pending Tasks
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Paper>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ gridColumn: '1 / -1' }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/design')}
              >
                Design New Aquarium
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/tank')}
              >
                Add Maintenance
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
} 