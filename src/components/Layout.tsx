import { ReactNode } from 'react';
import { Box } from '@mui/material';
import Footer from './Footer/Footer';
import { useTheme } from '../context/ThemeContext';

const TRANSITION_TIMING = '0.3s ease';
const TRANSITION_PROPERTIES = 'background-color, color, border-color';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isDarkMode } = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: isDarkMode ? '#121212' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#121212',
        transition: `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`,
        position: 'relative',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        overflowX: 'hidden'
      }}
    >
      <Box 
        sx={{ 
          flex: 1,
          width: '100%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
          overflowX: 'hidden'
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout; 