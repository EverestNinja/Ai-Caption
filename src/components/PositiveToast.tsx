import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTrophy, FaStar } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

interface PositiveToastProps {
  message: string;
  type: 'compliment' | 'achievement';
  onClose: () => void;
}

const PositiveToast: React.FC<PositiveToastProps> = ({ message, type, onClose }) => {
  const { isDarkMode } = useTheme();
  const [isVisible, setIsVisible] = useState(true);

  // Auto close after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow exit animation to complete
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  const isAchievement = type === 'achievement';
  
  return (
    <AnimatePresence>
      {isVisible && (
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 40
          }}
          sx={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2000,
            maxWidth: '90%',
            width: { xs: '90%', sm: '400px' },
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 2,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              background: isAchievement
                ? `linear-gradient(45deg, ${isDarkMode ? '#9333ea' : '#a855f7'}, ${isDarkMode ? '#e5b422' : '#fbbf24'})`
                : `linear-gradient(45deg, ${isDarkMode ? '#ec4899' : '#f472b6'}, ${isDarkMode ? '#f97316' : '#fb923c'})`,
              color: '#fff',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
              boxShadow: isAchievement 
                ? '0 10px 25px rgba(147, 51, 234, 0.3)' 
                : '0 10px 25px rgba(236, 72, 153, 0.3)',
            }}
          >
            <Box
              component={motion.div}
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, isAchievement ? 10 : 0, 0]
              }}
              transition={{ duration: 0.5, repeat: 0 }}
              sx={{ 
                fontSize: isAchievement ? 28 : 24,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isAchievement ? <FaTrophy /> : <FaStar />}
            </Box>
            
            <Typography 
              variant="body1"
              sx={{ 
                flex: 1,
                fontWeight: isAchievement ? 600 : 500,
                fontSize: isAchievement ? '1rem' : '0.95rem',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              {message}
            </Typography>
            
            <IconButton 
              size="small"
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              sx={{ 
                color: 'white',
                opacity: 0.8,
                '&:hover': { opacity: 1 }
              }}
            >
              <FaTimes />
            </IconButton>
          </Paper>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default PositiveToast;