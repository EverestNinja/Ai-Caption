import { ReactNode, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Footer from './Footer/Footer';
import { useTheme } from '../context/ThemeContext';
import Sidebar from './Sidebar/Sidebar';
import MobileNav from './MobileNav/MobileNav';
import { useSidebar } from '../context/SidebarContext';

const TRANSITION_TIMING = '0.3s ease';
const TRANSITION_PROPERTIES = 'background-color, color, border-color, margin, padding, width, left';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { isExpanded, sidebarWidth, collapsedWidth } = useSidebar();
  
  // Calculate the actual width to use
  const actualWidth = isExpanded ? sidebarWidth : collapsedWidth;
  
  useEffect(() => {
    setMounted(true);
    
    // Fix height issue
    const handleResize = () => {
      // Set a CSS variable with the viewport height
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    handleResize(); // Call once on mount
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    // Add custom CSS variable for sidebar width
    document.documentElement.style.setProperty('--sidebar-width', `${actualWidth}px`);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [actualWidth]);

  // Update sidebar width CSS variable when it changes
  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', `${actualWidth}px`);
    
    // Explicitly set a data attribute on body for CSS targeting
    document.body.setAttribute('data-sidebar-expanded', isExpanded ? 'true' : 'false');
    
    // Debug
    console.log('Layout sidebar width:', actualWidth, 'Expanded:', isExpanded);
  }, [actualWidth, isExpanded]);

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
      data-sidebar-expanded={isExpanded ? 'true' : 'false'}
    >
      <Sidebar />
      <MobileNav />
      <Box 
        component="main"
        sx={{ 
          flex: 1,
          width: { 
            xs: '100%',
            md: `calc(100% - ${actualWidth}px)`
          },
          marginLeft: { 
            xs: 0,
            md: `${actualWidth}px`
          },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          padding: {
            xs: 0,
            md: 0
          },
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
          maxWidth: '100vw',
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
          WebkitOverflowScrolling: 'touch',
          maxWidth: '100vw',
          padding: {
            xs: 0,
            md: 0
          }
        }}>
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout; 