import { ReactNode, useEffect, useState } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import Footer from './Footer/Footer';
import { useTheme } from '../context/ThemeContext';
import Sidebar from './Sidebar/Sidebar';

const TRANSITION_TIMING = '0.3s ease';
const TRANSITION_PROPERTIES = 'background-color, color, border-color, margin, padding';
const SIDEBAR_WIDTH_COLLAPSED = 52; // 3.25rem in pixels

interface LayoutProps {
  children: ReactNode;
  sidebarOpen?: boolean;
  toggleSidebar?: () => void;
}

const Layout = ({ children, sidebarOpen, toggleSidebar }: LayoutProps) => {
  const { isDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery('(max-width:768px)');

  useEffect(() => {
    setMounted(true);
    
    // Fix iOS height issue
    const handleResize = () => {
      // Set a CSS variable with the viewport height
      document.documentElement.style.setProperty(
        '--vh', 
        `${window.innerHeight * 0.01}px`
      );
    };
    
    handleResize(); // Call once on mount
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  if (!mounted) {
    return (
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          width: '100%',
          backgroundColor: 'transparent',
          margin: 0,
          padding: 0,
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: {
          xs: 'calc(var(--vh, 1vh) * 100)',
          sm: '100vh'
        },
        width: '100%',
        backgroundColor: isDarkMode ? '#121212' : '#EDF1FD',
        color: isDarkMode ? '#ffffff' : '#121212',
        transition: `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`,
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        overflowX: 'hidden',
        position: 'relative',
        maxWidth: '100vw',
      }}
    >
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Box 
        component="main"
        sx={{ 
          flex: 1,
          width: { 
            xs: '100%',
            sm: isMobile ? '100%' : `calc(100% - ${SIDEBAR_WIDTH_COLLAPSED}px)` 
          },
          marginLeft: { 
            xs: '0',
            sm: isMobile ? '0' : `${SIDEBAR_WIDTH_COLLAPSED}px` 
          },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          padding: 0,
          position: 'relative',
          boxSizing: 'border-box',
          overflowX: 'hidden',
          minHeight: {
            xs: 'calc(var(--vh, 1vh) * 100)',
            sm: '100vh'
          },
          backgroundColor: 'inherit',
          color: 'inherit',
          transition: `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <Box sx={{ 
          flex: 1, 
          width: '100%',
          position: 'relative',
          backgroundColor: 'inherit',
          color: 'inherit',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout; 