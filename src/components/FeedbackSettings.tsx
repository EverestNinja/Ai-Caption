import React from 'react';
import { 
  Box, Typography, Switch, Slider, 
  FormControlLabel, Paper
} from '@mui/material';
import { useFeedback } from '../context/FeedbackContext';
import { useTheme } from '../context/ThemeContext';

const FeedbackSettings: React.FC = () => {
  const { 
    soundsEnabled, 
    animationsEnabled, 
    soundVolume,
    toggleSounds,
    toggleAnimations,
    setSoundVolume
  } = useFeedback();
  
  const { isDarkMode } = useTheme();

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 2,
        background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Feedback Settings
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Switch 
              checked={soundsEnabled}
              onChange={toggleSounds}
              color="primary"
            />
          }
          label="Sound Effects"
        />
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Switch 
              checked={animationsEnabled}
              onChange={toggleAnimations}
              color="primary"
            />
          }
          label="Button Animations"
        />
      </Box>
      
      <Box sx={{ mb: 1 }}>
        <Typography variant="body2" gutterBottom>
          Sound Volume
        </Typography>
        <Slider
          value={soundVolume * 100}
          onChange={(_, value) => setSoundVolume(Number(value) / 100)}
          disabled={!soundsEnabled}
          min={0}
          max={100}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${Math.round(value)}%`}
        />
      </Box>
    </Paper>
  );
};

export default FeedbackSettings;