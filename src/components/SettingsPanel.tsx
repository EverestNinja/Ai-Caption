import React from 'react';
import { Box, Typography, Switch, FormControlLabel, Paper } from '@mui/material';
import { useTheme } from '../context/ThemeContext';
import { usePositiveMessage } from '../context/PositiveMessageContext';

const SettingsPanel: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { setMessagesEnabled } = usePositiveMessage();
  
  // Get current preference from localStorage
  const [messagesEnabled, setLocalMessagesEnabled] = React.useState(() => {
    const storedValue = localStorage.getItem('positiveMessagesEnabled');
    return storedValue === null ? true : storedValue === 'true';
  });
  
  const handleToggleMessages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setLocalMessagesEnabled(newValue);
    setMessagesEnabled(newValue);
  };
  
  return (
    <Paper 
      elevation={2} 
      sx={{
        p: 3,
        borderRadius: 2,
        background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2,
          color: isDarkMode ? '#fff' : '#000'
        }}
      >
        Experience Settings
      </Typography>
      
      <FormControlLabel
        control={
          <Switch
            checked={messagesEnabled}
            onChange={handleToggleMessages}
            color="primary"
          />
        }
        label={
          <Typography variant="body2" color={isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'}>
            Show Positive Messages
          </Typography>
        }
      />
    </Paper>
  );
};

export default SettingsPanel;