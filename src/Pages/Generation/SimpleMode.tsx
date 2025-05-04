import React from 'react';
import { 
  Box, Typography, TextField, Button, Grid, 
  InputAdornment, CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaMagic, FaBuilding, FaCoffee, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface SimpleModeProps {
  formState: any;
  handleChange: (field: string, value: any) => void;
  handleGenerate: () => void;
  isDarkMode: boolean;
  isGenerating: boolean;
}

const SimpleMode: React.FC<SimpleModeProps> = ({ 
  formState, 
  handleChange, 
  handleGenerate, 
  isDarkMode, 
  isGenerating 
}) => {
  const navigate = useNavigate();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };
  
  return (
    <Box 
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Typography 
        component={motion.h2}
        variants={itemVariants}
        variant="h5" 
        sx={{ 
          textAlign: 'center', 
          fontWeight: 700,
          mb: 4,
          color: isDarkMode ? '#fff' : '#2d3748',
          letterSpacing: '-0.5px',
          fontSize: { xs: '1.5rem', sm: '1.75rem' }
        }}
      >
        Enter Your Details
      </Typography>

      <Grid 
        container 
        spacing={3}
        component={motion.div}
        variants={itemVariants}
      >
        {/* First Row */}
        <Grid item xs={12} sm={6}>
          {/* Business Type */}
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 1.5, 
                fontWeight: 600,
                color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.95rem',
              }}
            >
              Business Type
              <Typography 
                component="span" 
                color="error" 
                sx={{ ml: 0.5, fontSize: '1.2rem' }}
              >
                *
              </Typography>
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your business type"
              value={formState.businessType || ''}
              onChange={(e) => handleChange('businessType', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaBuilding color={isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(156, 39, 176, 0.5)'} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(243,229,245,0.5)',
                  backdropFilter: 'blur(4px)',
                  '& fieldset': { 
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(156, 39, 176, 0.1)',
                    borderWidth: '1px',
                    borderRadius: '12px',
                  },
                  '&:hover fieldset': { 
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(156, 39, 176, 0.3)' 
                  },
                  '&.Mui-focused fieldset': { 
                    borderColor: '#9C27B0',
                    borderWidth: '2px',
                  },
                  borderRadius: '12px',
                  padding: '4px 14px',
                },
                '& .MuiInputBase-input': {
                  color: isDarkMode ? '#fff' : '#000',
                  py: 1.5,
                },
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          {/* Product/Service */}
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 1.5, 
                fontWeight: 600,
                color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                fontSize: '0.95rem',
              }}
            >
              Product/Service
            </Typography>
            <TextField
              fullWidth
              placeholder="Coffee, Clothing, Yoga Classes..."
              value={formState.product || ''}
              onChange={(e) => handleChange('product', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaCoffee color={isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(156, 39, 176, 0.5)'} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(243,229,245,0.5)',
                  backdropFilter: 'blur(4px)',
                  '& fieldset': { 
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(156, 39, 176, 0.1)',
                    borderWidth: '1px',
                    borderRadius: '12px',
                  },
                  '&:hover fieldset': { 
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(156, 39, 176, 0.3)' 
                  },
                  '&.Mui-focused fieldset': { 
                    borderColor: '#9C27B0',
                    borderWidth: '2px',
                  },
                  borderRadius: '12px',
                  padding: '4px 14px',
                },
                '& .MuiInputBase-input': {
                  color: isDarkMode ? '#fff' : '#000',
                  py: 1.5,
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Additional Details - Full Width */}
      <Box 
        component={motion.div}
        variants={itemVariants}
        sx={{ mb: 4 }}
      >
        <Typography 
          variant="subtitle1" 
          sx={{ 
            mb: 1.5, 
            fontWeight: 600,
            color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
            fontSize: '0.95rem',
          }}
        >
          Additional Details
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Any other details about your business, promotion, or offering..."
          value={formState.additionalDetails || ''}
          onChange={(e) => handleChange('additionalDetails', e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5, mr: 1 }}>
                <FaInfoCircle color={isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(156, 39, 176, 0.5)'} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(243,229,245,0.5)',
              backdropFilter: 'blur(4px)',
              '& fieldset': { 
                borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(156, 39, 176, 0.1)',
                borderWidth: '1px',
                borderRadius: '12px',
              },
              '&:hover fieldset': { 
                borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(156, 39, 176, 0.3)' 
              },
              '&.Mui-focused fieldset': { 
                borderColor: '#9C27B0',
                borderWidth: '2px',
              },
              borderRadius: '12px',
              padding: '12px 14px',
            },
            '& .MuiInputBase-input': {
              color: isDarkMode ? '#fff' : '#000',
            },
          }}
        />
      </Box>

      {/* Action Buttons */}
      <Box 
        component={motion.div}
        variants={itemVariants}
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2, 
          mt: 3
        }}
      >
        <Button
          component={motion.button}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          variant="outlined"
          startIcon={<FaArrowLeft />}
          onClick={() => navigate('/flyer')}
          sx={{
            flex: 1,
            py: 1.8,
            background: 'transparent',
            color: isDarkMode ? 'rgba(255,255,255,0.9)' : '#673ab7',
            border: `2px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(103, 58, 183, 0.5)'}`,
            borderRadius: '12px',
            fontWeight: 600,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(103, 58, 183, 0.05)',
              borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(103, 58, 183, 0.7)',
            },
          }}
        >
          Skip to Flyer
        </Button>
        <Button
          component={motion.button}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          variant="contained"
          startIcon={isGenerating ? null : <FaMagic />}
          onClick={handleGenerate}
          disabled={isGenerating}
          sx={{
            flex: 1,
            py: 1.8,
            background: isDarkMode 
              ? 'linear-gradient(135deg, rgba(103, 58, 183, 0.9), rgba(156, 39, 176, 0.8))' 
              : 'linear-gradient(135deg, #9c27b0, #673ab7)',
            color: 'white',
            borderRadius: '12px',
            fontWeight: 600,
            transition: 'all 0.3s ease',
            boxShadow: isDarkMode 
              ? '0 8px 20px rgba(0, 0, 0, 0.3)' 
              : '0 8px 20px rgba(156, 39, 176, 0.3)',
            '&:hover': {
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(123, 78, 203, 0.9), rgba(176, 59, 196, 0.8))'
                : 'linear-gradient(135deg, #ba27d0, #7a3abf)',
              boxShadow: isDarkMode 
                ? '0 10px 25px rgba(0, 0, 0, 0.4)' 
                : '0 10px 25px rgba(156, 39, 176, 0.4)',
            },
            '&.Mui-disabled': {
              background: isDarkMode 
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(156, 39, 176, 0.3)',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.7)',
            },
          }}
        >
          {isGenerating ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CircularProgress size={20} color="inherit" thickness={5} />
              <span>Generating...</span>
            </Box>
          ) : (
            'Generate Caption'
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default SimpleMode; 