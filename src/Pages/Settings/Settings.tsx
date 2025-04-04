import React from 'react';
import { Box, Container, Typography, IconButton } from '@mui/material';
import { MdArrowBack } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import SettingsPanel from '../../components/SettingsPanel';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: isDarkMode 
        ? 'linear-gradient(135deg, #121212, #1e1e2d)' 
        : 'linear-gradient(135deg, #f5f7fa, #f8f9fa)',
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
        }}
      >
        <MdArrowBack />
      </IconButton>
      
      <Container maxWidth="md">
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            color: isDarkMode ? '#fff' : '#000',
            textAlign: 'center',
            fontWeight: 600
          }}
        >
          Settings
        </Typography>
        
        <SettingsPanel />
      </Container>
    </Box>
  );
};

export default SettingsPage;