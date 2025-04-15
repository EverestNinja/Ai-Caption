import React from 'react';
import { Paper } from '@mui/material';
import { useTheme } from '../context/ThemeContext';
import FeedbackSettings from './FeedbackSettings';

// Transition constants for consistent styling across the app
const TRANSITION_TIMING = '0.3s ease';
const TRANSITION_PROPERTIES = 'background-color, color, border-color, box-shadow, transform, opacity';

const SettingsPanel: React.FC = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <Paper 
      elevation={2} 
      sx={{
        p: 3,
        borderRadius: 2,
        background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        transition: `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`,
      }}
    >
      <FeedbackSettings />
    </Paper>
  );
};

export default SettingsPanel;