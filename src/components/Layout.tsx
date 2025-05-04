import { ReactNode, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Footer from './Footer/Footer';
import { useTheme } from '../context/ThemeContext';
import Sidebar from './Sidebar/Sidebar';

const TRANSITION_TIMING = '0.3s ease';
const TRANSITION_PROPERTIES = 'background-color, color, border-color, margin, padding';
const SIDEBAR_WIDTH_COLLAPSED = 52; // 3.25rem in pixels
const SIDEBAR_PADDING = 32; // 2rem in pixels

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
        minHeight: '100vh',
        width: '100%',
        backgroundColor: isDarkMode ? '#121212' : '#EDF1FD',
        color: isDarkMode ? '#ffffff' : '#121212',
        transition: `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`,
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      <Sidebar />
      <Box 
        component="main"
        sx={{ 
          flex: 1,
          width: { 
            xs: `calc(100% - ${SIDEBAR_WIDTH_COLLAPSED}px)`,
            sm: `calc(100% - ${SIDEBAR_WIDTH_COLLAPSED}px)` 
          },
          marginLeft: { 
            xs: `${SIDEBAR_WIDTH_COLLAPSED}px`,
            sm: `${SIDEBAR_WIDTH_COLLAPSED}px` 
          },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          padding: 0,
          position: 'relative',
          boxSizing: 'border-box',
          overflowX: 'hidden',
          minHeight: '100vh',
          backgroundColor: 'inherit',
          color: 'inherit',
          transition: `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`,
        }}
      >
        <Box sx={{ 
          flex: 1, 
          width: '100%',
          position: 'relative',
          backgroundColor: 'inherit',
          color: 'inherit'
        }}>
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout; 