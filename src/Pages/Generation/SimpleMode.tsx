import React from 'react';
import { 
  Box, Typography, TextField, Button, Grid, 
  InputAdornment, CircularProgress
} from '@mui/material';
import { FaMagic, FaBuilding, FaCoffee, FaInfoCircle } from 'react-icons/fa';

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
  
  return (
    <Box>
      <Typography 
        variant="h5" 
        sx={{ 
          textAlign: 'center', 
          fontWeight: 700,
          mb: 3,
          color: isDarkMode ? '#fff' : '#2d3748',
          letterSpacing: '-0.5px',
          fontSize: { xs: '1.3rem', sm: '1.5rem' }
        }}
      >
        Enter Your Details
      </Typography>

      <Grid 
        container 
        spacing={2}
      >
        {/* First Row */}
        <Grid item xs={12} sm={6}>
          {/* Business Type */}
          <Box sx={{ mb: 2.5 }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 1, 
                fontWeight: 600,
                color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.85rem',
              }}
            >
              Business Type
              <Typography 
                component="span" 
                color="error" 
                sx={{ ml: 0.5, fontSize: '1.1rem' }}
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
                    borderRadius: '10px',
                  },
                  '&:hover fieldset': { 
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(156, 39, 176, 0.3)' 
                  },
                  '&.Mui-focused fieldset': { 
                    borderColor: '#9C27B0',
                    borderWidth: '2px',
                  },
                  borderRadius: '10px',
                  padding: '2px 12px',
                },
                '& .MuiInputBase-input': {
                  color: isDarkMode ? '#fff' : '#000',
                  py: 1.2,
                  fontSize: '0.9rem',
                },
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          {/* Product/Service */}
          <Box sx={{ mb: 2.5 }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 1, 
                fontWeight: 600,
                color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                fontSize: '0.85rem',
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
                    borderRadius: '10px',
                  },
                  '&:hover fieldset': { 
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(156, 39, 176, 0.3)' 
                  },
                  '&.Mui-focused fieldset': { 
                    borderColor: '#9C27B0',
                    borderWidth: '2px',
                  },
                  borderRadius: '10px',
                  padding: '2px 12px',
                },
                '& .MuiInputBase-input': {
                  color: isDarkMode ? '#fff' : '#000',
                  py: 1.2,
                  fontSize: '0.9rem',
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Additional Details - Full Width */}
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            mb: 1, 
            fontWeight: 600,
            color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
            fontSize: '0.85rem',
          }}
        >
          Additional Details
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Any other details about your business, promotion, or offering..."
          value={formState.additionalDetails || ''}
          onChange={(e) => handleChange('additionalDetails', e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.2, mr: 1 }}>
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
                borderRadius: '10px',
              },
              '&:hover fieldset': { 
                borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(156, 39, 176, 0.3)' 
              },
              '&.Mui-focused fieldset': { 
                borderColor: '#9C27B0',
                borderWidth: '2px',
              },
              borderRadius: '10px',
              padding: '10px 12px',
            },
            '& .MuiInputBase-input': {
              color: isDarkMode ? '#fff' : '#000',
              fontSize: '0.9rem',
            },
          }}
        />
      </Box>

      {/* Actions */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          mt: 1.5 
        }}
      >
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          sx={{
            bgcolor: isDarkMode ? 'rgba(156, 39, 176, 0.8)' : '#9C27B0',
            color: '#fff',
            py: 1.2,
            px: 3,
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontWeight: 600,
            '&:hover': {
              bgcolor: isDarkMode ? 'rgba(156, 39, 176, 0.9)' : '#7B1FA2',
            },
            minWidth: '180px',
            boxShadow: isDarkMode 
              ? '0 6px 12px rgba(0, 0, 0, 0.3)' 
              : '0 6px 12px rgba(0, 0, 0, 0.1)',
            transition: 'background-color 0.2s ease'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isGenerating ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <FaMagic size={18} />
            )}
            <span>{isGenerating ? 'Generating...' : 'Generate Caption'}</span>
          </Box>
        </Button>
      </Box>

      {/* Helper Text */}
      <Typography 
        variant="body2" 
        sx={{ 
          textAlign: 'center', 
          mt: 3, 
          color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
          fontSize: '0.85rem'
        }}
      >
        Tip: Add specific details about your business for better results
      </Typography>
    </Box>
  );
};

export default SimpleMode; 