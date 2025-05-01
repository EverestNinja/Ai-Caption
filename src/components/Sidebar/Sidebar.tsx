import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  IconButton,
  useTheme as useMuiTheme,
  useMediaQuery,
  Tooltip,
  ListItemText,
  Typography,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  FaHome,
  FaMagic, 
  FaImage, 
  FaSave, 
  FaBars,
  FaChevronLeft,
  FaSignOutAlt,
  FaSignInAlt
} from 'react-icons/fa';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { getAuth } from 'firebase/auth';
import GlocapLogo from '../../assets/Glocap.png';
import { BsSunFill, BsMoonFill } from 'react-icons/bs';

const COLLAPSED_WIDTH = 64;
const EXPANDED_WIDTH = 240;

interface NavItem {
  title: string;
  path: string;
  icon: React.ReactElement;
  requiresAuth?: boolean;
}

const Sidebar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(!isMobile);
  const auth = getAuth();
  
  // Add state for snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Update isCollapsed when screen size changes
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(false);
    }
  }, [isMobile]);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleAuth = async () => {
    if (auth.currentUser) {
      // Logout logic
      try {
        await auth.signOut();
        navigate('/');
        
        // Show success message
        setSnackbarMessage('You have been logged out successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error signing out:', error);
        
        // Show error message
        setSnackbarMessage('Error signing out. Please try again.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } else {
      // Login navigation
      navigate('/login');
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const navItems: NavItem[] = [
    { title: 'Home', path: '/', icon: <FaHome size={16} /> },
    { title: 'Caption Generator', path: '/caption', icon: <FaMagic size={16} /> },
    { title: 'Flyer Generator', path: '/flyer', icon: <IoDocumentTextOutline size={16} /> },
    { title: 'Saved Items', path: '/saved', icon: <FaSave size={16} /> },
    { title: 'Publish', path: '/publish', icon: <FaImage size={16} /> },
  ];

  const drawerContent = (
    <>
      {/* Top Section */}
      <Box 
        sx={{ 
          pt: 2,
          pb: isCollapsed ? 1 : 2,
          px: isCollapsed ? 0 : 2,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          gap: isCollapsed ? 1 : 0,
          flexWrap: isCollapsed ? 'wrap' : 'nowrap',
          margin: 0,
        }}
      >
        {/* Logo Section */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          flexDirection: isCollapsed ? 'column' : 'row',
          gap: 1.5 
        }}>
          {/* Circle Button or Logo */}
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: isCollapsed ? '50%' : '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: isCollapsed 
                ? (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'white')
                : '#4285F4',
              boxShadow: isDarkMode 
                ? '0px 1px 3px rgba(0, 0, 0, 0.2)'
                : '0px 1px 3px rgba(0, 0, 0, 0.1)',
              color: isCollapsed 
                ? (isDarkMode ? 'rgba(255, 255, 255, 0.9)' : '#6E7BB3')
                : 'white',
            }}
          >
            {isCollapsed ? (
              <FaBars size={14} onClick={handleDrawerToggle} style={{ cursor: 'pointer' }} />
            ) : (
              <Box
                component="img"
                src={GlocapLogo}
                alt="Logo"
                sx={{
                  width: 20,
                  height: 'auto',
                  objectFit: 'contain',
                }}
              />
            )}
          </Box>
          
          {/* Logo in collapsed mode */}
          {isCollapsed && (
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#4285F4',
                boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Box
                component="img"
                src={GlocapLogo}
                alt="Logo"
                sx={{
                  width: 20,
                  height: 'auto',
                  objectFit: 'contain',
                }}
              />
            </Box>
          )}
          
          {/* App Title - Only visible when expanded */}
          {!isCollapsed && (
            <Typography 
              variant="subtitle1" 
              sx={{
                fontWeight: 600,
                color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : '#333',
              }}
            >
              GloCap
            </Typography>
          )}
        </Box>
        
        {/* Collapse button - Only visible when expanded */}
        {!isCollapsed && (
          <IconButton 
            onClick={handleDrawerToggle}
            sx={{
              width: 24,
              height: 24,
              color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#6E7BB3',
            }}
          >
            <FaChevronLeft size={14} />
          </IconButton>
        )}
      </Box>

      {/* Navigation Items */}
      <List 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: isCollapsed ? 'center' : 'flex-start',
          px: isCollapsed ? 0 : 2,
          py: 0,
          gap: 1,
          margin: 0,
          '& .MuiListItem-root': {
            margin: 0,
            padding: isCollapsed ? '4px 0' : '4px 12px',
          }
        }}
      >
        {navItems.map((item) => {
          if (item.requiresAuth && !auth.currentUser) return null;

          const isActive = location.pathname === item.path;
          
          return (
            <Tooltip 
              key={item.path} 
              title={isCollapsed ? item.title : ""}
              placement="right"
              arrow
            >
              <ListItem
                onClick={() => handleNavigation(item.path)}
                sx={{
                  width: '100%',
                  padding: isCollapsed ? 0 : '8px 12px',
                  margin: 0,
                  borderRadius: isCollapsed ? '4px' : '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  bgcolor: isActive 
                    ? isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'white'
                    : 'transparent',
                  border: isActive 
                    ? isDarkMode 
                        ? '1px solid rgba(255, 255, 255, 0.1)'
                        : '1px solid rgba(0, 0, 0, 0.05)' 
                    : 'none',
                  boxShadow: isActive 
                    ? isDarkMode 
                        ? '0px 1px 3px rgba(0, 0, 0, 0.2)'
                        : '0px 1px 3px rgba(0, 0, 0, 0.1)'
                    : 'none',
                  '&:hover': {
                    bgcolor: isActive 
                      ? isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'white'
                      : isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.5)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: isCollapsed ? 32 : 24,
                    height: isCollapsed ? 32 : 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isActive
                      ? isDarkMode ? '#FFFFFF' : '#4285F4'
                      : isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#6E7BB3',
                    minWidth: isCollapsed ? 32 : 24,
                  }}
                >
                  {item.icon}
                </Box>
                
                {!isCollapsed && (
                  <ListItemText
                    primary={item.title}
                    sx={{
                      ml: 1.5,
                      '& .MuiTypography-root': {
                        fontSize: '14px',
                        fontWeight: isActive ? 500 : 400,
                        color: isActive
                          ? isDarkMode ? '#FFFFFF' : '#4285F4'
                          : isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#6E7BB3',
                      }
                    }}
                  />
                )}
              </ListItem>
            </Tooltip>
          );
        })}
      </List>

      {/* Bottom Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          pb: 3,
          mt: 2,
          borderTop: isDarkMode 
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(0, 0, 0, 0.1)',
          pt: isCollapsed ? 0 : 2,
        }}
      >
        {/* Theme Toggle Section */}
        {isCollapsed ? (
          // Vertical toggle for collapsed mode
          <Box 
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              mt: 4,
              mb: 2,
            }}
          >
            {/* Moon Icon */}
            <Box
              sx={{
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isDarkMode ? '#FFFFFF' : '#6E7BB3',
              }}
            >
              <BsMoonFill size={14} />
            </Box>

            {/* Toggle Switch - Oval Track */}
            <Box
              onClick={toggleTheme}
              sx={{
                width: 22,
                height: 44,
                borderRadius: 30,
                position: 'relative',
                cursor: 'pointer',
                bgcolor: '#D1D5DB',
                padding: '2px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Circular Thumb */}
              <Box
                sx={{
                  position: 'absolute',
                  top: isDarkMode ? '4px' : 'calc(100% - 22px)',
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  bgcolor: 'white',
                  transition: 'top 0.3s',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}
              />
            </Box>

            {/* Sun Icon */}
            <Box
              sx={{
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isDarkMode ? '#6E7BB3' : '#FFB020',
              }}
            >
              <BsSunFill size={16} />
            </Box>
          </Box>
        ) : (
          // Horizontal toggle for expanded mode
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              px: 2,
              py: 1.5,
              borderRadius: '8px',
            }}
          >
            <Typography variant="body2" sx={{ 
              color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#6E7BB3',
              fontSize: '13px',
            }}>
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </Typography>
            
            <Box
              onClick={toggleTheme}
              sx={{
                width: 44,
                height: 22,
                bgcolor: '#D1D5DB',
                borderRadius: 30,
                position: 'relative',
                cursor: 'pointer',
                padding: '2px',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: isDarkMode ? 'calc(100% - 22px)' : '4px',
                  top: '2px',
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  bgcolor: 'white',
                  transition: 'left 0.3s',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}
              />
            </Box>
          </Box>
        )}

        {/* Profile Section */}
        <Box
          sx={{
            width: isCollapsed ? 'auto' : '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            gap: 1.5,
            mt: 1,
            px: isCollapsed ? 0 : 2,
          }}
        >
          {auth.currentUser ? (
            // Show profile when logged in
            <>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <img 
                  src={auth.currentUser?.photoURL || "https://randomuser.me/api/portraits/men/32.jpg"} 
                  alt={auth.currentUser?.displayName || "User"} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
              
              {!isCollapsed && auth.currentUser && (
                <Box sx={{ overflow: 'hidden' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                    {auth.currentUser.displayName || 'User Name'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6E7BB3' }}>
                    {auth.currentUser.email || 'user@example.com'}
                  </Typography>
                </Box>
              )}
            </>
          ) : (
            // Show login button when not logged in
            isCollapsed ? (
              <Tooltip title="Login" placement="right" arrow>
                <IconButton
                  onClick={handleAuth}
                  sx={{
                    color: '#6E7BB3',
                    width: 36,
                    height: 36,
                    borderRadius: '8px',
                    '&:hover': {
                      color: '#4285F4',
                      bgcolor: 'rgba(66, 133, 244, 0.05)',
                    },
                  }}
                >
                  <FaSignInAlt size={14} />
                </IconButton>
              </Tooltip>
            ) : (
              <Button
                startIcon={<FaSignInAlt size={14} />}
                onClick={handleAuth}
                variant="outlined"
                sx={{
                  py: 1,
                  px: 2,
                  borderRadius: '8px',
                  textTransform: 'none',
                  color: '#4285F4',
                  borderColor: 'rgba(66, 133, 244, 0.3)',
                  '&:hover': {
                    borderColor: '#4285F4',
                    bgcolor: 'rgba(66, 133, 244, 0.05)',
                  },
                }}
              >
                Login
              </Button>
            )
          )}
        </Box>
        
        {/* Auth Button (Logout/Login) */}
        {auth.currentUser && (
          <Box
            sx={{
              width: isCollapsed ? 'auto' : '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              mt: 1,
              px: isCollapsed ? 0 : 2,
            }}
          >
            {isCollapsed ? (
              <Tooltip title="Logout" placement="right" arrow>
                <IconButton
                  onClick={handleAuth}
                  sx={{
                    color: '#6E7BB3',
                    width: 32,
                    height: 32,
                    '&:hover': {
                      color: '#E53E3E',
                      bgcolor: 'rgba(229, 62, 62, 0.05)',
                    },
                  }}
                >
                  <FaSignOutAlt size={14} />
                </IconButton>
              </Tooltip>
            ) : (
              <Box
                onClick={handleAuth}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  py: 1,
                  px: 2,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  width: '100%',
                  color: '#6E7BB3',
                  '&:hover': {
                    color: '#E53E3E',
                    bgcolor: 'rgba(229, 62, 62, 0.05)',
                  },
                }}
              >
                <FaSignOutAlt size={14} />
                <Typography variant="body2">Logout</Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </>
  );

  return (
    <>
      {/* Mobile Hamburger - Only show in mobile */}
      {isMobile && (
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 1200,
            width: 40,
            height: 40,
            borderRadius: '12px',
            bgcolor: isDarkMode ? 'rgba(26, 26, 46, 0.9)' : 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '&:hover': {
              bgcolor: isDarkMode ? 'rgba(26, 26, 46, 0.95)' : 'rgba(255,255,255,0.95)',
            },
          }}
        >
          <FaBars size={16} color={isDarkMode ? '#fff' : '#000'} />
        </IconButton>
      )}

      {/* Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        anchor="left"
        sx={{
          display: isMobile ? (mobileOpen ? 'block' : 'none') : 'block',
          width: isMobile ? EXPANDED_WIDTH : (isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH),
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isMobile ? EXPANDED_WIDTH : (isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH),
            maxWidth: isMobile ? '100%' : 'none',
            boxSizing: 'border-box',
            bgcolor: isDarkMode ? '#1A1A2E' : '#EDF1FD',
            border: 'none',
            overflowX: 'hidden',
            margin: 0,
            padding: 0,
            boxShadow: isMobile ? '4px 0 24px rgba(0,0,0,0.15)' : 'none',
          },
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
          },
        }}
      >
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            margin: 0,
            padding: 0,
          }}
        >
          {drawerContent}
        </Box>
      </Drawer>

      {/* Logout Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity}
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            bgcolor: snackbarSeverity === 'success' ? (isDarkMode ? '#1E4620' : '#EDF7ED') : (isDarkMode ? '#5F2120' : '#FDEDED'),
            color: isDarkMode ? 'white' : 'inherit',
            '& .MuiAlert-icon': {
              color: isDarkMode ? 'white' : undefined
            }
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Sidebar; 