import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Typography,
  styled,
  ListItemButton
} from '@mui/material';
import { 
  Palette as DesignIcon,
  WaterDrop as TankIcon
} from '@mui/icons-material';

const StyledSidebar = styled(Box)(({ theme }) => ({
  width: 240,
  height: '100vh',
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
}));

const StyledListItem = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    {
      text: 'Design',
      icon: <DesignIcon />,
      path: '/design'
    },
    {
      text: 'Tank',
      icon: <TankIcon />,
      path: '/tank'
    }
  ];

  return (
    <StyledSidebar>
      <Typography variant="h6" sx={{ mb: 2 }}>
        AquaLife Dashboard
      </Typography>
      <List>
        {menuItems.map((item) => (
          <Link 
            to={item.path} 
            key={item.text}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <StyledListItem
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </StyledListItem>
          </Link>
        ))}
      </List>
    </StyledSidebar>
  );
};

export default Sidebar; 