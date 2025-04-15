import React from 'react';
import { Fab, Tooltip } from '@mui/material';
import { FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import FeedbackButton from './FeedbackButton';

interface FloatingSettingsButtonProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const FloatingSettingsButton: React.FC<FloatingSettingsButtonProps> = ({ position = 'bottom-right' }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  // Define positions based on the prop
  const positionStyles = {
    'top-right': { top: { xs: 80, sm: 90 }, right: { xs: 16, sm: 24 } },
    'top-left': { top: { xs: 80, sm: 90 }, left: { xs: 16, sm: 24 } },
    'bottom-right': { bottom: { xs: 70, sm: 30 }, right: { xs: 16, sm: 24 } },
    'bottom-left': { bottom: { xs: 70, sm: 30 }, left: { xs: 16, sm: 24 } },
  };

  return (
    <Tooltip title="Settings" arrow placement="left">
      <FeedbackButton
        component={Fab}
        aria-label="Settings"
        isKeyAction={false}
        onClick={() => navigate('/settings')}
        size="medium"
        sx={{
          position: 'fixed',
          ...positionStyles[position],
          bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          color: isDarkMode ? '#fff' : '#000',
          '&:hover': {
            bgcolor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
          },
          zIndex: 1000,
          boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease',
        }}
      >
        <FiSettings size={22} />
      </FeedbackButton>
    </Tooltip>
  );
};

export default FloatingSettingsButton;