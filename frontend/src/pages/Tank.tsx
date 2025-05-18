import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  SelectChangeEvent,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAuth } from '../contexts/AuthContext';
import { TankMaintenanceService } from '../services/tankMaintenanceService';
import { AquariumService } from '../services/aquariumService';
import { TankMaintenanceCreate, TankMaintenance } from '../types/tankMaintenance';

interface AquariumLayout {
  id: number;
  tank_name: string;
  owner_email: string;
  created_at: string;
  updated_at: string;
}

const Tank: React.FC = () => {
  const { user } = useAuth();
  const [maintenance, setMaintenance] = useState<TankMaintenanceCreate>({
    layout_id: 0,
    owner_email: user?.email ?? '',
    maintenance_date: new Date(),
    maintenance_type: '',
    description: '',
    notes: '',
    completed: 0,
  });
  const [layouts, setLayouts] = useState<AquariumLayout[]>([]);
  const [maintenanceEntries, setMaintenanceEntries] = useState<TankMaintenance[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.email) {
      loadUserLayouts();
      loadMaintenanceEntries();
    }
  }, [user?.email]);

  const loadUserLayouts = async () => {
    try {
      const userLayouts = await AquariumService.getLayoutsByOwner(user?.email ?? '');
      setLayouts(userLayouts);
    } catch (error) {
      console.error('Error loading user layouts:', error);
    }
  };

  const loadMaintenanceEntries = async () => {
    try {
      const entries = await TankMaintenanceService.getByOwner(user?.email ?? '');
      setMaintenanceEntries(entries);
    } catch (error) {
      console.error('Error loading maintenance entries:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMaintenance((prev: TankMaintenanceCreate) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLayoutChange = (e: SelectChangeEvent<number>) => {
    setMaintenance((prev: TankMaintenanceCreate) => ({
      ...prev,
      layout_id: Number(e.target.value)
    }));
  };

  const handleMaintenanceTypeChange = (e: SelectChangeEvent<string>) => {
    setMaintenance((prev: TankMaintenanceCreate) => ({
      ...prev,
      maintenance_type: e.target.value
    }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setMaintenance((prev: TankMaintenanceCreate) => ({
        ...prev,
        maintenance_date: date
      }));
    }
  };

  const handleSaveMaintenance = async () => {
    try {
      setLoading(true);
      await TankMaintenanceService.create(maintenance);
      await loadMaintenanceEntries();
      setMaintenance({
        layout_id: 0,
        owner_email: user?.email ?? '',
        maintenance_date: new Date(),
        maintenance_type: '',
        description: '',
        notes: '',
        completed: 0,
      });
    } catch (error) {
      console.error('Error saving maintenance entry:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tank Maintenance
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Maintenance Form */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Add Maintenance Entry
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Select Aquarium</InputLabel>
                <Select
                  value={maintenance.layout_id}
                  label="Select Aquarium"
                  onChange={handleLayoutChange}
                >
                  {layouts.map((layout) => (
                    <MenuItem key={layout.id} value={layout.id}>
                      {layout.tank_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Maintenance Type</InputLabel>
                <Select
                  value={maintenance.maintenance_type}
                  label="Maintenance Type"
                  onChange={handleMaintenanceTypeChange}
                >
                  <MenuItem value="Water Change">Water Change</MenuItem>
                  <MenuItem value="Filter Cleaning">Filter Cleaning</MenuItem>
                  <MenuItem value="Feeding">Feeding</MenuItem>
                  <MenuItem value="Water Testing">Water Testing</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Maintenance Date"
                  value={maintenance.maintenance_date}
                  onChange={handleDateChange}
                />
              </LocalizationProvider>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={maintenance.description}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                multiline
                rows={4}
                value={maintenance.notes}
                onChange={handleInputChange}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveMaintenance}
                disabled={loading}
              >
                Save Maintenance Entry
              </Button>
            </Box>
          </Paper>
        </Box>

        {/* Maintenance History */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Maintenance History
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {maintenanceEntries.map((entry) => (
                <Box key={entry.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">
                        {entry.maintenance_type}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Date: {new Date(entry.maintenance_date).toLocaleString()}
                      </Typography>
                      <Typography variant="body2">
                        Description: {entry.description}
                      </Typography>
                      {entry.notes && (
                        <Typography variant="body2">
                          Notes: {entry.notes}
                        </Typography>
                      )}
                      <Typography variant="body2">
                        Status: {entry.completed ? 'Completed' : 'Pending'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Tank; 