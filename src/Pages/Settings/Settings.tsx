import { useEffect } from 'react';
import { Box, Container, Typography, IconButton, useMediaQuery, Paper, Switch } from '@mui/material';
import { MdArrowBack } from 'react-icons/md';
import { BsSunFill, BsMoonFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import SettingsPanel from '../../components/SettingsPanel';
import Footer from '../../components/Footer/Footer';
import { motion } from 'framer-motion';

// Transition constants for consistent styling across the app
const TRANSITION_TIMING = '0.3s ease';
const TRANSITION_PROPERTIES = 'background-color, color, border-color, box-shadow, transform, opacity';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const isMobile = useMediaQuery('(max-width:600px)');
  
  useEffect(() => {
    // Apply theme to document body with synchronized transition
    document.body.style.transition = `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`;
    document.body.style.backgroundColor = isDarkMode ? '#121212' : '#ffffff';
    document.body.style.color = isDarkMode ? '#ffffff' : '#121212';
  }, [isDarkMode]);
  
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: isDarkMode 
        ? 'linear-gradient(135deg, #121212, #1e1e2d)' 
        : 'linear-gradient(135deg, #f5f7fa, #f8f9fa)',
      transition: `background-color ${TRANSITION_TIMING}`,
      position: 'relative',
      pt: 10,
      pb: 5
    }}>
      {/* Back Button */}
      <IconButton
        onClick={() => navigate(-1)}
        sx={{
          position: 'fixed',
          top: 20,
          left: 20,
          color: isDarkMode ? '#ffffff' : '#121212',
          bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
          zIndex: 1100,
          '&:hover': {
            bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          },
          transition: TRANSITION_TIMING,
        }}
      >
        <MdArrowBack />
      </IconButton>
      
      {/* Theme Toggle Button */}
      <Paper
        elevation={3}
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          borderRadius: '50px',
          p: { xs: '2px', sm: '4px' },
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 0.5, sm: 1 },
          background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
          color: isDarkMode ? '#fff' : '#000',
          backdropFilter: 'blur(10px)',
          zIndex: 1100,
          '&:hover': {
            background: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
          },
          transition: `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`,
        }}
      >
        <IconButton 
          size="small" 
          onClick={toggleTheme}
          sx={{ 
            color: isDarkMode ? 'rgba(255,255,255,0.5)' : '#FDB813',
            transform: `scale(${!isDarkMode ? 1.2 : 1})`,
            transition: TRANSITION_TIMING,
          }}
        >
          <BsSunFill />
        </IconButton>
        <Switch
          checked={isDarkMode}
          onChange={toggleTheme}
          sx={{
            '& .MuiSwitch-switchBase': {
              color: isDarkMode ? '#405DE6' : '#757575',
              transition: TRANSITION_TIMING,
              '&.Mui-checked': {
                color: '#405DE6',
              },
              '&.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#405DE6 !important',
              },
            },
            '& .MuiSwitch-track': {
              backgroundColor: isDarkMode ? '#ffffff40 !important' : '#00000040 !important',
              opacity: '1 !important',
            },
          }}
        />
        <IconButton 
          size="small"
          onClick={toggleTheme}
          sx={{ 
            color: isDarkMode ? '#ffffff' : 'rgba(0,0,0,0.3)',
            transform: `scale(${isDarkMode ? 1.2 : 1})`,
            transition: TRANSITION_TIMING,
          }}
        >
          <BsMoonFill />
        </IconButton>
      </Paper>
      
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: { xs: 3, sm: 4 },
          }}
        >
          <Box
            component={motion.div}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            sx={{
              mb: { xs: 1, sm: 1.5 },
              p: { xs: 1, sm: 1.5 },
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconButton
              sx={{
                color: '#ffffff',
                '&:hover': { backgroundColor: 'transparent' }
              }}
            >
              <Box component="span" sx={{ fontSize: isMobile ? 20 : 28, fontWeight: 'bold' }}>⚙️</Box>
            </IconButton>
          </Box>
          
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.25rem' },
              fontWeight: 700,
              mb: 1,
              textAlign: 'center',
              color: isDarkMode ? '#fff' : '#000',
              transition: `color ${TRANSITION_TIMING}`,
            }}
          >
            Settings
          </Typography>
          
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '0.9rem', sm: '1.1rem' },
              color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
              mb: 2,
              textAlign: 'center',
              transition: `color ${TRANSITION_TIMING}`,
            }}
          >
            Customize your experience to match your preferences
          </Typography>
        </Box>
        
        <SettingsPanel />
      </Container>
      
      {/* Footer */}
      <Box sx={{ 
        position: 'relative',
        zIndex: 1,
        mt: 'auto',
        background: isDarkMode 
          ? 'linear-gradient(to top, rgba(30, 30, 40, 0.9), transparent)'
          : 'linear-gradient(to top, rgba(245, 247, 250, 0.9), transparent)',
        paddingTop: 5,
        transition: `background ${TRANSITION_TIMING}`,
      }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default SettingsPage;