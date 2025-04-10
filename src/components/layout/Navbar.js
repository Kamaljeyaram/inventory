import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Badge, 
  Box, 
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { useThemeContext } from '../../utils/ThemeContext';
import { logger } from '../../utils/logger';

/**
 * Navbar component for the application header
 * Contains app title, theme toggle, notifications, and user menu
 * @param {Object} props - Component props
 * @param {Function} props.onLogout - Logout function
 * @returns {JSX.Element} Navbar component
 */
const Navbar = ({ onLogout }) => {
  // Theme context for dark/light mode toggle
  const { darkMode, toggleTheme } = useThemeContext();
  
  // User menu anchor element
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  
  /**
   * Open user menu
   * @param {Event} event - Click event
   */
  const handleMenuClick = (event) => {
    logger.debug('User menu opened');
    setAnchorEl(event.currentTarget);
  };
  
  /**
   * Close user menu
   */
  const handleMenuClose = () => {
    logger.debug('User menu closed');
    setAnchorEl(null);
  };
  
  /**
   * Handle theme toggle
   */
  const handleThemeToggle = () => {
    logger.info(`Theme switched to ${darkMode ? 'light' : 'dark'} mode`);
    toggleTheme();
  };
  
  /**
   * Handle user logout
   */
  const handleLogout = () => {
    logger.info('User logged out');
    handleMenuClose();
    onLogout();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Inventory Management System
        </Typography>
        <Box sx={{ display: 'flex' }}>
          {/* Theme toggle button */}
          <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <IconButton color="inherit" onClick={handleThemeToggle}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
          
          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          {/* User menu */}
          <Tooltip title="Account">
            <IconButton 
              color="inherit" 
              onClick={handleMenuClick}
              aria-controls={open ? 'user-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <AccountCircleIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        {/* User menu dropdown */}
        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          
          <MenuItem component={Link} to="/settings" onClick={handleMenuClose}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;