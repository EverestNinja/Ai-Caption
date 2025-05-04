import React from 'react';
import { Paper, Button } from '@mui/material';

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
  return (
    <Paper 
      elevation={0}
      sx={{
        borderRadius: '10px',
        overflow: 'hidden',
        display: 'flex',
        mb: 3,
        backgroundColor: isDarkMode ? 'rgba(146, 118, 205, 0.1)' : '#f8f8f8',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: `1px solid ${isDarkMode ? 'rgba(146, 118, 205, 0.2)' : '#e0e0e0'}`,
        position: 'relative',
        padding: '4px',
      }}
    >
      <Button
        onClick={() => handleModeChange('simple')}
        sx={{
          flex: 1,
          py: 1.5,
          borderRadius: '8px',
          backgroundColor: captionMode === 'simple' 
            ? isDarkMode 
              ? 'rgba(156, 39, 176, 0.7)' 
              : 'linear-gradient(to right, #a14eea, #327dff)'
            : 'transparent',
          color: captionMode === 'simple' 
            ? 'white' 
            : isDarkMode ? 'rgba(255,255,255,0.7)' : '#555',
          fontWeight: captionMode === 'simple' ? 'bold' : 500,
          '&:hover': {
            backgroundColor: captionMode === 'simple' 
              ? isDarkMode ? 'rgba(156, 39, 176, 0.8)' : 'linear-gradient(to right, #a14eea, #327dff)'
              : isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            transform: captionMode === 'simple' ? 'translateY(-2px)' : 'none',
            boxShadow: captionMode === 'simple' ? '0 6px 14px rgba(0, 0, 0, 0.25)' : 'none'
          },
          transition: 'all 0.3s ease',
          boxShadow: captionMode === 'simple' ? '0 4px 10px rgba(0, 0, 0, 0.15)' : 'none',
          transform: captionMode === 'simple' ? 'scale(1.02)' : 'scale(1)',
          zIndex: captionMode === 'simple' ? 2 : 1,
        }}
      >
        Simple Mode
      </Button>
      <Button
        onClick={() => handleModeChange('custom')}
        sx={{
          flex: 1,
          py: 1.5,
          borderRadius: '8px',
          backgroundColor: captionMode === 'custom' 
            ? isDarkMode 
              ? 'rgba(156, 39, 176, 0.7)' 
              : 'linear-gradient(to right, #a14eea, #327dff)'
            : 'transparent',
          color: captionMode === 'custom' 
            ? 'white' 
            : isDarkMode ? 'rgba(255,255,255,0.7)' : '#555',
          fontWeight: captionMode === 'custom' ? 'bold' : 500,
          '&:hover': {
            backgroundColor: captionMode === 'custom' 
              ? isDarkMode ? 'rgba(156, 39, 176, 0.8)' : 'linear-gradient(to right, #a14eea, #327dff)'
              : isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            transform: captionMode === 'custom' ? 'translateY(-2px)' : 'none',
            boxShadow: captionMode === 'custom' ? '0 6px 14px rgba(0, 0, 0, 0.25)' : 'none'
          },
          transition: 'all 0.3s ease',
          boxShadow: captionMode === 'custom' ? '0 4px 10px rgba(0, 0, 0, 0.15)' : 'none',
          transform: captionMode === 'custom' ? 'scale(1.02)' : 'scale(1)',
          zIndex: captionMode === 'custom' ? 2 : 1,
        }}
      >
        Custom Mode
      </Button>
    </Paper>
  );
};

export default ModeToggle; 