import React from 'react';
import { 
  Box, Typography, TextField, Button, Grid
} from '@mui/material';
import { FaArrowLeft, FaMagic } from 'react-icons/fa';
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
  
  return (
    <>
      <Typography 
        variant="h5" 
        sx={{ 
          textAlign: 'center', 
          fontWeight: 600,
          mb: 3,
          color: isDarkMode ? '#fff' : '#000',
        }}
      >
        Enter Your Details
      </Typography>

      <Grid container spacing={3}>
        {/* First Row */}
        <Grid item xs={12} sm={6}>
          {/* Business Type */}
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 1, 
                fontWeight: 500,
                color: isDarkMode ? '#fff' : 'rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'center',
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: isDarkMode ? 'rgba(255,255,255,0.03)' : '#F3E5F5',
                  '& fieldset': { borderColor: 'transparent' },
                  '&:hover fieldset': { borderColor: 'transparent' },
                  '&.Mui-focused fieldset': { borderColor: '#9C27B0' },
                },
                '& .MuiInputBase-input': {
                  color: isDarkMode ? '#fff' : '#000',
                },
                borderRadius: '6px',
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
                mb: 1, 
                fontWeight: 500,
                color: isDarkMode ? '#fff' : 'rgba(0,0,0,0.8)',
              }}
            >
              Product/Service
            </Typography>
            <TextField
              fullWidth
              placeholder="Coffee, Clothing, Yoga Classes..."
              value={formState.product || ''}
              onChange={(e) => handleChange('product', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: isDarkMode ? 'rgba(255,255,255,0.03)' : '#F3E5F5',
                  '& fieldset': { borderColor: 'transparent' },
                  '&:hover fieldset': { borderColor: 'transparent' },
                  '&.Mui-focused fieldset': { borderColor: '#9C27B0' },
                },
                '& .MuiInputBase-input': {
                  color: isDarkMode ? '#fff' : '#000',
                },
                borderRadius: '6px',
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
            fontWeight: 500,
            color: isDarkMode ? '#fff' : 'rgba(0,0,0,0.8)',
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
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: isDarkMode ? 'rgba(255,255,255,0.03)' : '#F3E5F5',
              '& fieldset': { borderColor: 'transparent' },
              '&:hover fieldset': { borderColor: 'transparent' },
              '&.Mui-focused fieldset': { borderColor: '#9C27B0' },
            },
            '& .MuiInputBase-input': {
              color: isDarkMode ? '#fff' : '#000',
            },
            borderRadius: '6px',
          }}
        />
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button
          variant="outlined"
          startIcon={<FaArrowLeft />}
          onClick={() => navigate('/flyer')}
          sx={{
            flex: 1,
            py: 1.5,
            background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'linear-gradient(to right, #a14eea, #327dff)',
            color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'white',
            border: 'none',
            borderRadius: '6px',
            '&:hover': {
              background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'linear-gradient(to right, #a14eea, #327dff)',
              border: 'none',
            },
          }}
        >
          Skip to Flyer
        </Button>
        <Button
          variant="contained"
          startIcon={<FaMagic />}
          onClick={handleGenerate}
          disabled={isGenerating}
          sx={{
            flex: 1,
            py: 1.5,
            background: isDarkMode ? 'rgba(156, 39, 176, 0.7)' : 'linear-gradient(to right, #a14eea, #327dff)',
            color: 'white',
            borderRadius: '6px',
            '&:hover': {
              background: isDarkMode ? 'rgba(156, 39, 176, 0.8)' : 'linear-gradient(to right, #a14eea, #327dff)',
            },
            '&.Mui-disabled': {
              bgcolor: '#E1BEE7',
              color: '#9E9E9E',
            },
          }}
        >
          {isGenerating ? 'Generating...' : 'Generate Caption'}
        </Button>
      </Box>
    </>
  );
};

export default SimpleMode; 