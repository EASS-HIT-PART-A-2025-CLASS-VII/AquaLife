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
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { AquariumService } from '../services/aquariumService';
import { FishService } from '../services/fishService';
import { AquaLayoutCreate } from '../types/aquarium';

const Design: React.FC = () => {
  const { user } = useAuth();
  const [layout, setLayout] = useState<AquaLayoutCreate>({
    owner_email: user?.email ?? '',
    tank_name: '',
    tank_length: 0,
    tank_width: 0,
    tank_height: 0,
    water_type: 'freshwater',
    fish_data: [],
    comments: '',
  });
  const [fishCatalog, setFishCatalog] = useState<any[]>([]);
  const [openFishDialog, setOpenFishDialog] = useState(false);
  const [selectedFish, setSelectedFish] = useState<any>(null);
  const [layouts, setLayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFishCatalog();
    loadUserLayouts();
  }, [user?.email]);

  const loadFishCatalog = async () => {
    try {
      const fish = await FishService.getAllFish();
      setFishCatalog(fish);
    } catch (error) {
      console.error('Error loading fish catalog:', error);
    }
  };

  const loadUserLayouts = async () => {
    if (!user?.email) return;
    try {
      const userLayouts = await AquariumService.getLayoutsByOwner(user.email);
      setLayouts(userLayouts);
    } catch (error) {
      console.error('Error loading user layouts:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLayout(prev => ({
      ...prev,
      [name]: name.includes('tank_') ? Number(value) : value
    }));
  };

  const handleWaterTypeChange = (e: any) => {
    setLayout(prev => ({
      ...prev,
      water_type: e.target.value
    }));
  };

  const handleFishSelect = (fish: any) => {
    setSelectedFish(fish);
    setOpenFishDialog(true);
  };

  const handleAddFish = () => {
    if (!selectedFish) return;
    
    setLayout(prev => ({
      ...prev,
      fish_data: [
        ...prev.fish_data,
        {
          name: selectedFish.name,
          quantity: 1
        }
      ]
    }));
    setOpenFishDialog(false);
    setSelectedFish(null);
  };

  const handleSaveLayout = async () => {
    try {
      setLoading(true);
      await AquariumService.createLayout(layout);
      await loadUserLayouts();
      setLayout({
        owner_email: user?.email ?? '',
        tank_name: '',
        tank_length: 0,
        tank_width: 0,
        tank_height: 0,
        water_type: 'freshwater',
        fish_data: [],
        comments: '',
      });
    } catch (error) {
      console.error('Error saving layout:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadLayout = (layout: any) => {
    setLayout({
      owner_email: layout.owner_email,
      tank_name: layout.tank_name,
      tank_length: layout.tank_length,
      tank_width: layout.tank_width,
      tank_height: layout.tank_height,
      water_type: layout.water_type,
      fish_data: layout.fish_data,
      comments: layout.comments,
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Design Your Aquarium
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Layout Form */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Aquarium Details
              </Typography>
              <FormControl fullWidth>
                <TextField
                  fullWidth
                  label="Tank Name"
                  name="tank_name"
                  value={layout.tank_name}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  fullWidth
                  type="number"
                  label="Length (cm)"
                  name="tank_length"
                  value={layout.tank_length}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  fullWidth
                  type="number"
                  label="Width (cm)"
                  name="tank_width"
                  value={layout.tank_width}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  fullWidth
                  type="number"
                  label="Height (cm)"
                  name="tank_height"
                  value={layout.tank_height}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Water Type</InputLabel>
                <Select
                  value={layout.water_type}
                  label="Water Type"
                  onChange={handleWaterTypeChange}
                >
                  <MenuItem value="freshwater">Freshwater</MenuItem>
                  <MenuItem value="saltwater">Saltwater</MenuItem>
                  <MenuItem value="brackish">Brackish</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Comments"
                  name="comments"
                  value={layout.comments}
                  onChange={handleInputChange}
                />
              </FormControl>
            </Paper>
          </Box>

          {/* Fish Catalog */}
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Fish Catalog
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                {fishCatalog.map((fish) => (
                  <Box key={fish.id}>
                    <Card onClick={() => handleFishSelect(fish)}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={fish.image_url ?? '/default-fish.png'}
                        alt={fish.name}
                      />
                      <CardContent>
                        <Typography variant="subtitle1">{fish.name}</Typography>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Selected Fish */}
        <Box>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Selected Fish
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
              {layout.fish_data.map((fish) => (
                <Box key={`${fish.name}-${fish.quantity}`}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1">
                        {fish.name} (Quantity: {fish.quantity})
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>

        {/* Action Buttons */}
        <Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveLayout}
              disabled={loading}
            >
              Save Layout
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setOpenFishDialog(true)}
            >
              Add Fish
            </Button>
          </Box>
        </Box>

        {/* Saved Layouts */}
        <Box>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Your Saved Layouts
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
              {layouts.map((savedLayout) => (
                <Box key={savedLayout.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{savedLayout.tank_name}</Typography>
                      <Typography variant="body2">
                        {savedLayout.tank_length}x{savedLayout.tank_width}x{savedLayout.tank_height} inches
                      </Typography>
                      <Typography variant="body2">
                        {savedLayout.water_type}
                      </Typography>
                      <Button
                        variant="text"
                        onClick={() => handleLoadLayout(savedLayout)}
                      >
                        Load Layout
                      </Button>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Fish Selection Dialog */}
      <Dialog open={openFishDialog} onClose={() => setOpenFishDialog(false)}>
        <DialogTitle>Add Fish</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Fish</InputLabel>
            <Select
              value={selectedFish?.name ?? ''}
              label="Fish"
              onChange={(e) => {
                const selectedFish = fishCatalog.find(f => f.name === e.target.value);
                if (selectedFish) {
                  setSelectedFish(selectedFish);
                }
              }}
            >
              {fishCatalog.map((fish) => (
                <MenuItem key={fish.name} value={fish.name}>
                  {fish.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            type="number"
            label="Quantity"
            value={selectedFish?.quantity ?? 1}
            onChange={(e) => {
              if (selectedFish) {
                setSelectedFish((prev: typeof selectedFish) => ({
                  ...prev,
                  quantity: Number(e.target.value)
                }));
              }
            }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFishDialog(false)}>Cancel</Button>
          <Button onClick={handleAddFish} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Design; 