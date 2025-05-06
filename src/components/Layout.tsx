import { ReactNode, useEffect, useState, useRef } from 'react';
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
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/.test(navigator.userAgent);
  const mainRef = useRef<HTMLDivElement>(null);
  
  // Fix for iOS elastic scrolling
  const handleTouchMove = (e: TouchEvent) => {
    if (sidebarOpen && isMobile) {
      if (!(e.target as Element).closest('nav') && !(e.target as Element).closest('.mobile-hamburger')) {
        e.preventDefault();
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    
    // Fix iOS/mobile height issue
    const handleResize = () => {
      // Set a CSS variable with the viewport height
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    handleResize(); // Call once on mount
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    // Enhanced scrolling fix for iOS
    if (isIOS || isAndroid) {
      // Handle iOS overscroll behavior
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      
      // Fix for main content scrolling
      if (mainRef.current) {
        // Use setProperty instead of direct assignment to fix TypeScript error
        mainRef.current.style.setProperty('-webkit-overflow-scrolling', 'touch');
        mainRef.current.style.setProperty('overscroll-behavior', 'none');
      }
      
      // Force redraw on orientation change to fix layout issues
      const handleOrientationChange = () => {
        setTimeout(() => {
          // Fix for iOS rendering issues after orientation change
          if (mainRef.current) {
            mainRef.current.style.display = 'none';
            // Force reflow
            mainRef.current.offsetHeight;
            mainRef.current.style.display = '';
          }
        }, 200);
      };
      
      window.addEventListener('orientationchange', handleOrientationChange);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleResize);
        window.removeEventListener('orientationchange', handleOrientationChange);
        document.removeEventListener('touchmove', handleTouchMove);
      };
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [isIOS, isAndroid, isMobile, sidebarOpen]);

  // Prevent body scrolling when sidebar is open on mobile
  useEffect(() => {
    if (isMobile) {
      if (sidebarOpen) {
        document.body.classList.add('menu-open');
      } else {
        document.body.classList.remove('menu-open');
      }
    }
    
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [sidebarOpen, isMobile]);

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
        ref={mainRef}
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
          maxWidth: '100vw',
          // Add iOS-specific padding for safe areas
          paddingTop: isIOS ? 'env(safe-area-inset-top, 0px)' : 0,
          paddingBottom: isIOS ? 'env(safe-area-inset-bottom, 0px)' : 0,
          // Prevent momentum scrolling when sidebar is open
          overscrollBehavior: sidebarOpen && isMobile ? 'none' : 'auto',
          // Disable pointer events on main content when sidebar is open on mobile
          pointerEvents: (sidebarOpen && isMobile) ? 'none' : 'auto'
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
        }}>
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout; 