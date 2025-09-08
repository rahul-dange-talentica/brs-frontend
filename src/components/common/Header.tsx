import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Container,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  LibraryBooks as LibraryBooksIcon,
  Search as SearchIcon,
  RateReview as RateReviewIcon,
  Favorite as FavoriteIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { NavigationItem, User, UserMenuItem } from '../../types/common';
import { useAuth } from '../../hooks';

interface HeaderProps {
  // Props are now optional since we use Redux state
  isAuthenticated?: boolean;
  user?: User | null;
  onLogout?: () => void;
}

// Navigation items for authenticated users
const authenticatedNavItems: NavigationItem[] = [
  { label: 'Home', path: '/', icon: HomeIcon, exact: true },
  { label: 'Search', path: '/search', icon: SearchIcon },
  { label: 'Browse Books', path: '/books', icon: LibraryBooksIcon },
  { label: 'My Reviews', path: '/my-reviews', icon: RateReviewIcon, requiresAuth: true },
  { label: 'Favorites', path: '/favorites', icon: FavoriteIcon, requiresAuth: true },
];

// Navigation items for guest users
const guestNavItems: NavigationItem[] = [
  { label: 'Home', path: '/', icon: HomeIcon, exact: true },
  { label: 'Search', path: '/search', icon: SearchIcon },
  { label: 'Browse Books', path: '/books', icon: LibraryBooksIcon },
];

// User menu items
const userMenuItems: UserMenuItem[] = [
  { label: 'Profile', path: '/profile', icon: PersonIcon },
  { label: 'Settings', path: '/settings', icon: SettingsIcon },
  { label: 'Logout', action: 'logout', icon: LogoutIcon, divider: true },
];

export const Header: React.FC<HeaderProps> = ({
  isAuthenticated: propIsAuthenticated,
  user: propUser,
  onLogout: propOnLogout,
}) => {
  const auth = useAuth();
  
  // Use Redux state with fallback to props for backward compatibility
  const isAuthenticated = propIsAuthenticated ?? auth.isAuthenticated;
  const user = propUser ?? auth.user;
  const onLogout = propOnLogout ?? auth.logout;
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = isAuthenticated ? authenticatedNavItems : guestNavItems;

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenuItemClick = async (item: UserMenuItem) => {
    if (item.action === 'logout') {
      await onLogout();
    }
    handleUserMenuClose();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActiveRoute = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const renderDesktopNavigation = () => (
    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
      {navItems.map((item) => {
        const isActive = isActiveRoute(item.path, item.exact);
        return (
          <Button
            key={item.path}
            component={Link}
            to={item.path}
            color="inherit"
            sx={{
              fontWeight: isActive ? 600 : 400,
              borderBottom: isActive ? '2px solid' : 'none',
              borderBottomColor: isActive ? 'secondary.main' : 'transparent',
              borderRadius: isActive ? 0 : 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
            startIcon={<item.icon />}
          >
            {item.label}
          </Button>
        );
      })}
    </Box>
  );

  const renderUserSection = () => {
    if (isAuthenticated && user) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            size="large"
            aria-label="user menu"
            aria-controls="user-menu"
            aria-haspopup="true"
            onClick={handleUserMenuOpen}
            color="inherit"
          >
            {user.avatar ? (
              <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
            ) : (
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {auth.getUserInitials()}
              </Avatar>
            )}
          </IconButton>
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            onClick={handleUserMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 200,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem disabled>
              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                {auth.getUserInitials()}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {auth.getUserDisplayName()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            {userMenuItems.map((item, index) => (
              <div key={item.label}>
                {item.divider && index > 0 && <Divider />}
                <MenuItem
                  onClick={() => handleUserMenuItemClick(item)}
                  component={item.path ? Link : 'div'}
                  to={item.path}
                >
                  <ListItemIcon>
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </MenuItem>
              </div>
            ))}
          </Menu>
        </Box>
      );
    }

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          color="inherit"
          component={Link}
          to="/login"
          sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
        >
          Sign In
        </Button>
        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to="/register"
          sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
        >
          Sign Up
        </Button>
      </Box>
    );
  };

  const renderMobileMenu = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={closeMobileMenu}
      PaperProps={{
        sx: {
          width: 280,
          maxWidth: '75vw',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          Menu
        </Typography>
        <IconButton onClick={closeMobileMenu}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => {
          const isActive = isActiveRoute(item.path, item.exact);
          return (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              onClick={closeMobileMenu}
              selected={isActive}
            >
              <ListItemIcon>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>

      {isAuthenticated && user ? (
        <>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                {auth.getUserInitials()}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {auth.getUserDisplayName()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            </Box>
          </Box>
          <List>
            {userMenuItems.map((item) => (
              <ListItemButton
                key={item.label}
                onClick={async () => {
                  await handleUserMenuItemClick(item);
                  closeMobileMenu();
                }}
                component={item.path ? Link : 'div'}
                to={item.path}
              >
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </>
      ) : (
        <>
          <Divider />
          <List>
            <ListItemButton component={Link} to="/login" onClick={closeMobileMenu}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Sign In" />
            </ListItemButton>
            <ListItemButton component={Link} to="/register" onClick={closeMobileMenu}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Sign Up" />
            </ListItemButton>
          </List>
        </>
      )}
    </Drawer>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        color="primary" 
        elevation={1}
        sx={{ zIndex: theme.zIndex.appBar }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 0 } }}>
            {/* Logo */}
            <Typography
              variant="h5"
              component={Link}
              to="/"
              sx={{
                flexGrow: { xs: 1, md: 0 },
                mr: { md: 4 },
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              📚 BookReview
            </Typography>

            {/* Desktop Navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {renderDesktopNavigation()}
            </Box>

            {/* User Section */}
            {renderUserSection()}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="menu"
                onClick={toggleMobileMenu}
                sx={{ ml: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Menu */}
      {renderMobileMenu()}
    </>
  );
};

export default Header;
