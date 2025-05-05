import React from 'react';
import { Paper, Button, Typography, Box, useMediaQuery } from '@mui/material';
import { AutoFixHigh, Settings } from '@mui/icons-material';

interface ModeToggleProps {
  captionMode: 'simple' | 'custom';
  handleModeChange: (mode: 'simple' | 'custom') => void;
  isDarkMode: boolean;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ 
  captionMode, 
  handleModeChange, 
  isDarkMode 
}) => {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Box 
      sx={{ 
        width: '100%', 
        mb: 3,
        mt: 1,
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Paper 
        elevation={0}
        sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          backgroundColor: isDarkMode ? 'rgba(30, 30, 45, 0.4)' : 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          boxShadow: isDarkMode 
            ? '0 8px 20px rgba(0, 0, 0, 0.2)' 
            : '0 8px 20px rgba(0, 0, 0, 0.05)',
          border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)'}`,
          position: 'relative',
          padding: '8px',
          width: '100%',
          maxWidth: '550px',
          margin: '0 auto',
        }}
      >
        <Button
          onClick={() => handleModeChange('simple')}
          sx={{
            flex: 1,
            py: { xs: 1.5, sm: 2 },
            px: { xs: 1, sm: 2 },
            mr: 1,
            borderRadius: '12px',
            background: captionMode === 'simple' 
              ? isDarkMode 
                ? 'linear-gradient(135deg, rgba(103, 58, 183, 0.8), rgba(156, 39, 176, 0.7))' 
                : 'linear-gradient(135deg, #9c27b0, #673ab7)'
              : 'transparent',
            color: captionMode === 'simple' 
              ? '#ffffff' 
              : isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
            fontWeight: captionMode === 'simple' ? 700 : 500,
            '&:hover': {
              background: captionMode === 'simple' 
                ? isDarkMode 
                  ? 'linear-gradient(135deg, rgba(103, 58, 183, 0.9), rgba(156, 39, 176, 0.8))' 
                  : 'linear-gradient(135deg, #9c27b0, #673ab7)'
                : isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
              transform: captionMode === 'simple' ? 'none' : 'scale(1.02)',
            },
            transition: 'background 0.15s ease, transform 0.15s ease',
            boxShadow: captionMode === 'simple' 
              ? '0 8px 16px rgba(0, 0, 0, 0.15)' 
              : 'none',
            zIndex: captionMode === 'simple' ? 2 : 1,
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 1 : 1.5
          }}>
            <AutoFixHigh sx={{ fontSize: isMobile ? 18 : 20 }} />
            <Typography 
              variant="button" 
              sx={{ 
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                letterSpacing: '0.5px',
                fontWeight: captionMode === 'simple' ? 700 : 500,
              }}
            >
              Simple Mode
            </Typography>
          </Box>
        </Button>
        
        <Button
          onClick={() => handleModeChange('custom')}
          sx={{
            flex: 1,
            py: { xs: 1.5, sm: 2 },
            px: { xs: 1, sm: 2 },
            ml: 1,
            borderRadius: '12px',
            background: captionMode === 'custom' 
              ? isDarkMode 
                ? 'linear-gradient(135deg, rgba(103, 58, 183, 0.8), rgba(156, 39, 176, 0.7))' 
                : 'linear-gradient(135deg, #9c27b0, #673ab7)'
              : 'transparent',
            color: captionMode === 'custom' 
              ? '#ffffff' 
              : isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
            fontWeight: captionMode === 'custom' ? 700 : 500,
            '&:hover': {
              background: captionMode === 'custom' 
                ? isDarkMode 
                  ? 'linear-gradient(135deg, rgba(103, 58, 183, 0.9), rgba(156, 39, 176, 0.8))' 
                  : 'linear-gradient(135deg, #9c27b0, #673ab7)'
                : isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
              transform: captionMode === 'custom' ? 'none' : 'scale(1.02)',
            },
            transition: 'background 0.15s ease, transform 0.15s ease',
            boxShadow: captionMode === 'custom' 
              ? '0 8px 16px rgba(0, 0, 0, 0.15)' 
              : 'none',
            zIndex: captionMode === 'custom' ? 2 : 1,
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 1 : 1.5
          }}>
            <Settings sx={{ fontSize: isMobile ? 18 : 20 }} />
            <Typography 
              variant="button" 
              sx={{ 
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                letterSpacing: '0.5px',
                fontWeight: captionMode === 'custom' ? 700 : 500,
              }}
            >
              Custom Mode
            </Typography>
          </Box>
        </Button>
      </Paper>
    </Box>
  );
};

export default ModeToggle; 