import { ReactNode } from 'react';
import { Box } from '@mui/material';
import Footer from './Footer/Footer';
import { useTheme } from '../context/ThemeContext';
import Sidebar from './Sidebar/Sidebar';

const TRANSITION_TIMING = '0.3s ease';
const TRANSITION_PROPERTIES = 'background-color, color, border-color';
const SIDEBAR_WIDTH_COLLAPSED = 64;

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isDarkMode } = useTheme();

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
        gap: 0
      }}
    >
      <Sidebar />
      <Box 
        component="main"
        sx={{ 
          flex: 1,
          width: { xs: '100%', sm: `calc(100% - ${SIDEBAR_WIDTH_COLLAPSED}px)` },
          ml: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          margin: 0,
          padding: 0,
          position: 'relative',
          boxSizing: 'border-box',
          overflowX: 'hidden',
          minHeight: '100vh',
          '& > *': {
            width: '100%'
          }
        }}
      >
        <Box sx={{ 
          flex: 1, 
          width: '100%',
          margin: 0,
          padding: 0,
          position: 'relative'
        }}>
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout; 