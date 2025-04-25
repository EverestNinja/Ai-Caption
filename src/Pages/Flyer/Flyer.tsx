import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, TextField, Button, IconButton, Switch, useMediaQuery, CircularProgress, Snackbar, Alert, Dialog, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FaImage, FaMagic, FaArrowLeft, FaUpload, FaTimesCircle, FaInfoCircle, FaDownload, FaTimes, FaShare } from 'react-icons/fa';
import { BsSunFill, BsMoonFill } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useStepContext } from '../../context/StepContext';
import { generateFlyer, FlyerFormState, GeneratedFlyer, checkXaiApiHealth } from '../../services/flyerapi';
import Footer from '../../components/Footer/Footer';
import StepNavigation from '../../components/StepNavigation/StepNavigation';

// Define transition constants
const TRANSITION_TIMING = '0.4s cubic-bezier(0.4, 0, 0.2, 1)';
const TRANSITION_PROPERTIES = 'background, color, border-color, box-shadow, transform, opacity, filter';

const Flyer = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  const { isDarkMode, toggleTheme } = useTheme();
  const { currentStep, steps, caption, goToNextStep } = useStepContext();
  const [mounted, setMounted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [generatedFlyer, setGeneratedFlyer] = useState<GeneratedFlyer | null>(null);
  const [apiStatus, setApiStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [formState, setFormState] = useState<FlyerFormState>({
    description: '',
    companyLogo: null,
    logoPreview: null,
    logoPosition: 'top-right'
  });

  useEffect(() => {
    setMounted(true);
    
    // Check API health on component mount
    const checkApiHealth = async () => {
      try {
        console.log('Checking xAI API health...');
        const isHealthy = await checkXaiApiHealth();
        
        if (isHealthy) {
          console.log('xAI API is healthy and connected');
          setApiStatus('success');
        } else {
          console.log('Using fallback implementation');
          // We're still setting success here because our implementation will fall back to mocks
          setApiStatus('success');
          setError('');
        }
      } catch (err) {
        console.error('Error checking API health:', err);
        // We're still setting success here because our implementation will fall back to mocks
        setApiStatus('success');
        setError('');
      } finally {
        // Make sure the component is mounted
        setMounted(true);
      }
    };
    
    // Don't wait for API check to complete before setting mounted
    setMounted(true);
    
    // If we have a caption from the previous step, use it in the description
    if (caption) {
      setFormState(prev => ({
        ...prev,
        description: caption
      }));
    }
    
    // Run the API health check in the background
    checkApiHealth();
  }, [caption]);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({
      ...prev,
      description: e.target.value
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      
      // Check file size (limit to 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('Logo file size should not exceed 5MB');
        return;
      }
      
      // Check file type
      if (!selectedFile.type.match('image.*')) {
        setError('Please select an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormState(prev => ({
          ...prev,
          companyLogo: selectedFile,
          logoPreview: e.target?.result as string
        }));
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeLogo = () => {
    setFormState(prev => ({
      ...prev,
      companyLogo: null,
      logoPreview: null
    }));
  };

  const handlePublishContent = () => {
    // Save the generated flyer URL to localStorage for the publish page
    if (generatedFlyer) {
      localStorage.setItem('generatedFlyerUrl', generatedFlyer.imageUrl);
    }
    
    // Navigate to the publish step first
    goToNextStep();
    
    // Close the dialog after a longer delay to ensure navigation completes first
    setTimeout(() => {
      setIsPopupOpen(false);
    }, 500);
  };

  const handleGenerate = async () => {
    if (!formState.description.trim()) {
      setError('Please provide a description for your flyer');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      console.log('Calling generateFlyer with:', formState);
      const flyer = await generateFlyer(formState);
      console.log('Generated flyer:', flyer);
      setGeneratedFlyer(flyer);
      setIsPopupOpen(true);
    } catch (err) {
      console.error('Error in handleGenerate:', err);
      if (err instanceof Error) {
        setError(`Failed to generate flyer: ${err.message}`);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to download the generated flyer
  const handleDownloadFlyer = () => {
    if (!generatedFlyer) return;
    
    // For base64 data URLs
    if (generatedFlyer.imageUrl.startsWith('data:')) {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = generatedFlyer.imageUrl;
      link.download = `flyer-${generatedFlyer.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // For regular URLs, fetch the image first
      fetch(generatedFlyer.imageUrl)
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `flyer-${generatedFlyer.id}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch(err => {
          console.error('Error downloading image:', err);
          setError('Failed to download the flyer. Please try again.');
        });
    }
  };

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      <Box sx={{ 
        minHeight: '100vh',
        background: isDarkMode 
          ? 'linear-gradient(135deg, #121212, #1e1e2d)' 
          : 'linear-gradient(135deg, #f5f7fa, #f8f9fa)',
        transition: `background-color ${TRANSITION_TIMING}`,
        position: 'relative',
        pt: 10,
      }}>
        {/* Back Button */}
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            position: 'fixed',
            top: 20,
            left: 20,
            color: isDarkMode ? '#ffffff' : '#121212',
            bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            zIndex: 1100,
            '&:hover': {
              bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            },
            transition: TRANSITION_TIMING,
          }}
        >
          <FaArrowLeft />
        </IconButton>

        {/* API Status Alert */}
        {apiStatus === 'loading' && (
          <Box sx={{ 
            position: 'fixed', 
            top: '80px', 
            left: '50%', 
            transform: 'translateX(-50%)',
            zIndex: 1100,
            width: { xs: '90%', sm: '80%', md: '50%' },
            textAlign: 'center'
          }}>
            <Alert 
              severity="info" 
              icon={<CircularProgress size={20} />}
              sx={{ 
                bgcolor: isDarkMode ? 'rgba(41, 98, 255, 0.1)' : 'rgba(41, 98, 255, 0.05)', 
                color: isDarkMode ? '#fff' : 'inherit',
                '& .MuiAlert-icon': { color: isDarkMode ? '#fff' : '#2962ff' }
              }}
            >
              <Typography variant="body2">
                Connecting to xAI API...
              </Typography>
            </Alert>
          </Box>
        )}

        {apiStatus === 'error' && (
          <Box sx={{ 
            position: 'fixed', 
            top: '80px', 
            left: '50%', 
            transform: 'translateX(-50%)',
            zIndex: 1100,
            width: { xs: '90%', sm: '80%', md: '50%' },
            textAlign: 'center'
          }}>
            <Alert 
              severity="error"
              sx={{ 
                bgcolor: isDarkMode ? 'rgba(211, 47, 47, 0.1)' : 'rgba(211, 47, 47, 0.05)', 
                color: isDarkMode ? '#fff' : 'inherit',
                '& .MuiAlert-icon': { color: isDarkMode ? '#fff' : '#d32f2f' }
              }}
            >
              <Typography variant="body2">
                {error || 'Failed to connect to xAI API. Please try again later.'}
              </Typography>
            </Alert>
          </Box>
        )}

        {/* Theme Toggle */}
        <Paper
          elevation={3}
          sx={{
            position: 'fixed',
            top: 20,
            right: 20,
            borderRadius: '50px',
            p: { xs: '2px', sm: '4px' },
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.5, sm: 1 },
            background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            color: isDarkMode ? '#fff' : '#000',
            filter: 'blur(0.3px)',
            transform: 'scale(1) !important',
            transition: `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`,
            border: 0,
            backdropFilter: 'blur(10px)',
            zIndex: 1100,
            '&:hover': {
              background: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
            }
          }}
        >
          <IconButton 
            size="small" 
            onClick={toggleTheme}
            sx={{ 
              color: isDarkMode ? 'rgba(255,255,255,0.5)' : '#FDB813',
              transform: `scale(${!isDarkMode ? 1.2 : 1})`,
              transition: TRANSITION_TIMING,
            }}
          >
            <BsSunFill />
          </IconButton>
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
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
          <IconButton 
            size="small"
            onClick={toggleTheme}
            sx={{ 
              color: isDarkMode ? '#ffffff' : 'rgba(0,0,0,0.3)',
              transform: `scale(${isDarkMode ? 1.2 : 1})`,
              transition: TRANSITION_TIMING,
            }}
          >
            <BsMoonFill />
          </IconButton>
        </Paper>

        {/* Background Gradient */}
        <Box
          component={motion.div}
          animate={{
            background: isDarkMode
              ? 'radial-gradient(circle at 50% 50%, rgba(131, 58, 180, 0.15) 0%, rgba(193, 53, 132, 0.08) 50%, transparent 100%)'
              : 'radial-gradient(circle at 50% 50%, rgba(131, 58, 180, 0.08) 0%, rgba(193, 53, 132, 0.04) 50%, transparent 100%)',
          }}
          transition={{ duration: 0.4 }}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            transition: TRANSITION_TIMING,
          }}
        />

        <Container 
          maxWidth="lg" 
          sx={{ 
            mb: 5, 
            pt: { xs: 1, sm: 2 },
            px: { xs: 2, sm: 3 }
          }}
        >
          {/* Step Navigation */}
          <StepNavigation 
            currentStep={currentStep}
            steps={steps}
            nextStepLabel="Skip to Publish"
            nextStepPath="/publish"
          />
          
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: { xs: 1, sm: 4 },
            }}
          >
            <Box
              component={motion.div}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
              sx={{
                mb: { xs: 1, sm: 1.5 },
                p: { xs: 1, sm: 1.5 },
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #833AB4, #C13584, #E1306C)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FaImage size={isMobile ? 20 : 28} color="white" />
            </Box>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.25rem' },
                fontWeight: 700,
                mb: 1,
                textAlign: 'center',
                color: isDarkMode ? '#fff' : '#000'
              }}
            >
              Create Your Flyer
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '0.9rem', sm: '1.1rem' },
                color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                mb: 2,
                textAlign: 'center'
              }}
            >
              Transform your caption into a professional business flyer
            </Typography>
          </Box>

          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 3 },
              background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: { xs: '12px', sm: '16px' },
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              boxShadow: isDarkMode 
                ? '0 10px 30px rgba(0, 0, 0, 0.2)' 
                : '0 10px 30px rgba(0, 0, 0, 0.05)',
              transition: `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`,
            }}
          >
            {caption && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: isDarkMode ? '#fff' : '#000',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  Your Selected Caption
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    background: isDarkMode ? 'rgba(64,93,230,0.1)' : 'rgba(64,93,230,0.05)',
                    borderRadius: 2,
                    border: `1px solid ${isDarkMode ? 'rgba(64,93,230,0.2)' : 'rgba(64,93,230,0.1)'}`,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontStyle: 'italic',
                      color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)',
                      fontSize: '0.95rem',
                      lineHeight: 1.7,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {caption}
                  </Typography>
                </Paper>
              </Box>
            )}
            
            <Typography
              variant="h6"
              sx={{
                mb: { xs: 2, sm: 3 },
                color: isDarkMode ? '#fff' : '#000',
                textAlign: 'center',
                fontWeight: 600,
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}
            >
              Describe Your Perfect Flyer
            </Typography>

            {/* Description Box */}
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  mb: 1, 
                  color: isDarkMode ? '#fff' : '#000',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                Describe Your Flyer
                <IconButton 
                  size="small" 
                  sx={{ color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}
                >
                  <FaInfoCircle size={12} />
                </IconButton>
              </Typography>
              <TextField
                multiline
                rows={4}
                fullWidth
                placeholder="A flyer in a pot"
                value={formState.description}
                onChange={handleDescriptionChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: isDarkMode ? '#fff' : '#000',
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
                    '& fieldset': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: isDarkMode ? 'rgba(131, 58, 180, 0.6)' : 'rgba(131, 58, 180, 0.6)',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? '#fff' : '#000',
                  },
                }}
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block', 
                  mt: 1, 
                  color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                  fontSize: '0.75rem'
                }}
              >
                Be specific about colors, topics, headline text, and call-to-action. The AI will generate a professional flyer based on your description.
              </Typography>
            </Box>

            {/* Logo Upload */}
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  mb: 1, 
                  color: isDarkMode ? '#fff' : '#000',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <FaImage size={16} />
                Company Logo (Optional)
              </Typography>
              <Box 
                sx={{ 
                  border: `1px dashed ${isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}`,
                  borderRadius: 2,
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '150px',
                  backgroundColor: isDarkMode ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.02)',
                }}
              >
                {formState.logoPreview ? (
                  <Box sx={{ position: 'relative', width: '100%', textAlign: 'center' }}>
                    <Box
                      component="img"
                      src={formState.logoPreview}
                      alt="Company Logo"
                      sx={{
                        maxWidth: '100%',
                        maxHeight: '150px',
                        objectFit: 'contain',
                        borderRadius: 1,
                      }}
                    />
                    <IconButton
                      onClick={removeLogo}
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        backgroundColor: isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)',
                        color: isDarkMode ? '#fff' : '#000',
                        p: '4px',
                        '&:hover': {
                          backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.95)',
                        },
                      }}
                    >
                      <FaTimesCircle size={16} />
                    </IconButton>
                    
                    {/* Logo Position Dropdown */}
                    <FormControl 
                      fullWidth 
                      variant="outlined" 
                      size="small"
                      sx={{ 
                        mt: 2,
                        '& .MuiInputBase-root': {
                          color: isDarkMode ? '#fff' : '#000',
                          backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                        },
                        '& .MuiSvgIcon-root': {
                          color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                        },
                      }}
                    >
                      <InputLabel 
                        id="logo-position-label"
                        sx={{ 
                          color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' 
                        }}
                      >
                        Logo Position
                      </InputLabel>
                      <Select
                        labelId="logo-position-label"
                        value={formState.logoPosition || 'top-right'}
                        onChange={(e) => setFormState(prev => ({
                          ...prev,
                          logoPosition: e.target.value as FlyerFormState['logoPosition']
                        }))}
                        label="Logo Position"
                      >
                        <MenuItem value="top-left">Top Left</MenuItem>
                        <MenuItem value="top">Top Center</MenuItem>
                        <MenuItem value="top-right">Top Right</MenuItem>
                        <MenuItem value="left">Left Center</MenuItem>
                        <MenuItem value="right">Right Center</MenuItem>
                        <MenuItem value="bottom-left">Bottom Left</MenuItem>
                        <MenuItem value="bottom">Bottom Center</MenuItem>
                        <MenuItem value="bottom-right">Bottom Right</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                ) : (
                  <>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                      onClick={() => document.getElementById('logo-upload')?.click()}
                    >
                      <FaUpload
                        size={24}
                        color={isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          mt: 1,
                          color: isDarkMode ? '#fff' : '#000',
                          borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                        }}
                      >
                        Upload Logo
                      </Button>
                    </Box>
                    <input
                      type="file"
                      id="logo-upload"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                  </>
                )}
              </Box>
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block', 
                  mt: 1, 
                  color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                  fontSize: '0.75rem'
                }}
              >
                Your logo will appear at the selected position on the flyer
              </Typography>
            </Box>

            {/* Tips Section */}
            <Box
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 1,
                backgroundColor: isDarkMode ? 'rgba(131, 58, 180, 0.1)' : 'rgba(131, 58, 180, 0.05)',
                border: `1px solid ${isDarkMode ? 'rgba(131, 58, 180, 0.2)' : 'rgba(131, 58, 180, 0.1)'}`,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  color: isDarkMode ? '#fff' : '#000',
                }}
              >
                How to create a perfect flyer:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                  mb: 1,
                }}
              >
                Be specific about colors, layout, and text. Include a clear headline, call-to-action, and describe any imagery you want. The AI works best with detailed instructions and will create professional, ready-to-share designs.
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontStyle: 'italic',
                  color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                }}
              >
                Example: "Create a blue and white flyer with 'SUMMER SALE' headline, product image, and 'SHOP NOW' button"
              </Typography>
            </Box>

            {/* Generate Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                disabled={isGenerating || !formState.description.trim()}
                onClick={handleGenerate}
                startIcon={isGenerating ? 
                  <CircularProgress size={20} color="inherit" /> : 
                  <FaMagic size={20} />
                }
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 8,
                  background: 'linear-gradient(45deg, #833AB4, #C13584, #E1306C)',
                  boxShadow: isDarkMode ? '0 4px 15px rgba(193,53,132,0.3)' : '0 4px 15px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #E1306C, #C13584, #833AB4)',
                    transform: 'translateY(-2px)',
                    boxShadow: isDarkMode ? '0 6px 20px rgba(193,53,132,0.4)' : '0 6px 20px rgba(0,0,0,0.2)',
                  },
                  '&.Mui-disabled': {
                    background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    color: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                  },
                }}
              >
                {isGenerating ? 'Generating...' : 'Generate Flyer'}
              </Button>
            </Box>
          </Paper>
        </Container>

        {/* Flyer Popup Dialog */}
        <Dialog 
          open={isPopupOpen && !!generatedFlyer} 
          onClose={() => setIsPopupOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              background: isDarkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            }
          }}
        >
          <Box sx={{ 
            p: 2, 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: isDarkMode ? '#fff' : '#000' }}>
              Your Generated Flyer
            </Typography>
            <IconButton onClick={() => setIsPopupOpen(false)}>
              <FaTimes color={isDarkMode ? '#fff' : '#000'} />
            </IconButton>
          </Box>
          
          <DialogContent sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            p: 3,
            pt: 3,
          }}>
            {generatedFlyer && (
              <Box
                component="img"
                src={generatedFlyer.imageUrl}
                alt="Generated Flyer"
                sx={{
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                }}
              />
            )}
          </DialogContent>
          
          <DialogActions sx={{ 
            p: 2,
            pt: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          }}>
            <Button
              variant="contained"
              onClick={handleDownloadFlyer}
              startIcon={<FaDownload />}
              sx={{
                py: 1.2,
                px: 3,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #833AB4, #C13584, #E1306C)',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(45deg, #E1306C, #C13584, #833AB4)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(193,53,132,0.4)',
                },
              }}
            >
              Download Flyer
            </Button>
            <Button
              variant="outlined"
              onClick={handleGenerate}
              startIcon={<FaMagic />}
              sx={{
                py: 1.2,
                px: 3,
                borderRadius: 2,
                borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                color: isDarkMode ? '#fff' : '#000',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                },
              }}
            >
              Regenerate
            </Button>
            <Button
              variant="contained"
              onClick={handlePublishContent}
              startIcon={<FaShare />}
              sx={{
                py: 1.2,
                px: 3,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(45deg, #833AB4, #5851DB, #405DE6)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(64,93,230,0.4)',
                },
              }}
            >
              Publish Your Content
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setError('')}
            severity="error"
            sx={{
              width: '100%',
              backgroundColor: isDarkMode ? '#ff5252' : '#ffebee',
              color: isDarkMode ? '#fff' : '#c62828',
            }}
          >
            {error}
          </Alert>
        </Snackbar>

        <Footer />
      </Box>
    </AnimatePresence>
  );
};

export default Flyer; 