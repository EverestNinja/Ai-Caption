import React from 'react';
import { 
  Box, Typography, Switch, Slider, 
  FormControlLabel
} from '@mui/material';
import { useFeedback } from '../context/FeedbackContext';
import { useTheme } from '../context/ThemeContext';
import { usePositiveMessage } from '../context/PositiveMessageContext';

// Transition constant for consistent styling across the app
const TRANSITION_TIMING = '0.3s ease';

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
  const { messagesEnabled, setMessagesEnabled } = usePositiveMessage();

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Switch 
              checked={soundsEnabled}
              onChange={toggleSounds}
              color="primary"
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
          }
          label={
            <Typography 
              variant="body2" 
              sx={{
                color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
                transition: `color ${TRANSITION_TIMING}`,
              }}
            >
              Sound Effects
            </Typography>
          }
        />
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Switch 
              checked={animationsEnabled}
              onChange={toggleAnimations}
              color="primary"
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
          }
          label={
            <Typography 
              variant="body2" 
              sx={{
                color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
                transition: `color ${TRANSITION_TIMING}`,
              }}
            >
              Button Animations
            </Typography>
          }
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Switch 
              checked={messagesEnabled}
              onChange={(e) => setMessagesEnabled(e.target.checked)}
              color="primary"
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
          }
          label={
            <Typography 
              variant="body2" 
              sx={{
                color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
                transition: `color ${TRANSITION_TIMING}`,
              }}
            >
              Sparks & Compliments
            </Typography>
          }
        />
      </Box>
      
      <Box sx={{ mb: 1 }}>
        <Typography 
          variant="body2" 
          gutterBottom
          sx={{
            color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
            transition: `color ${TRANSITION_TIMING}`,
          }}
        >
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
          sx={{
            color: '#405DE6',
            '& .MuiSlider-thumb': {
              color: isDarkMode ? '#405DE6' : '#405DE6',
              transition: `color ${TRANSITION_TIMING}`,
            },
            '& .MuiSlider-track': {
              color: isDarkMode ? '#405DE6' : '#405DE6',
              transition: `color ${TRANSITION_TIMING}`,
            },
            '& .MuiSlider-rail': {
              color: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              transition: `color ${TRANSITION_TIMING}`,
            },
            '& .Mui-disabled': {
              color: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default FeedbackSettings;