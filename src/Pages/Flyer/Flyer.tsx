import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, TextField, Button, IconButton, useMediaQuery, CircularProgress, Snackbar, Alert, Dialog, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FaImage, FaMagic, FaUpload, FaTimesCircle, FaInfoCircle, FaDownload, FaTimes, FaShare } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useStepContext } from '../../context/StepContext';
import { generateFlyer, FlyerFormState, GeneratedFlyer, checkXaiApiHealth } from '../../services/flyerapi';
import { checkUsageLimit, incrementUsage, getRemainingUsage, LIMITS } from '../../services/usageLimit';
import { getAuth } from 'firebase/auth';
import { clearDailyUsage } from '../../services/usageLimit';

// Define transition constants
const TRANSITION_TIMING = '0.4s cubic-bezier(0.4, 0, 0.2, 1)';
const TRANSITION_PROPERTIES = 'background, color, border-color, box-shadow, transform, opacity, filter';

const Flyer = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  const { isDarkMode } = useTheme();
  const { caption, goToNextStep } = useStepContext();
  const [mounted, setMounted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [generatedFlyer, setGeneratedFlyer] = useState<GeneratedFlyer | null>(null);
  const [apiStatus, setApiStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [remainingUsage, setRemainingUsage] = useState<number>(3);
  const auth = getAuth();

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

    // Update remaining usage count
    setRemainingUsage(getRemainingUsage('flyers'));
    
    // Clear old usage data
    clearDailyUsage();
  }, [caption, auth.currentUser]);

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
    if (!checkUsageLimit('flyers')) {
      setError('You have reached your daily limit for free flyers. Please login to generate unlimited flyers.');
      return;
    }

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
      
      // Increment usage after successful generation
      incrementUsage('flyers');
      setRemainingUsage(getRemainingUsage('flyers'));
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
        pt: 1,
      }}>
        {/* API Status Alert */}
        {apiStatus === 'loading' && (
          <Box sx={{ 
            position: 'fixed', 
            top: '10px',
            left: '50%', 
            transform: 'translateX(-50%)',
            zIndex: 1100,
            width: { xs: '90%', sm: '60%', md: '40%' },
            textAlign: 'center'
          }}>
            <Alert 
              severity="info" 
              icon={<CircularProgress size={14} />}
              sx={{ 
                bgcolor: isDarkMode ? 'rgba(41, 98, 255, 0.1)' : 'rgba(41, 98, 255, 0.05)', 
                color: isDarkMode ? '#fff' : 'inherit',
                '& .MuiAlert-icon': { color: isDarkMode ? '#fff' : '#2962ff' },
                py: 0.5,
                fontSize: '0.75rem'
              }}
            >
              <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                Connecting to xAI API...
              </Typography>
            </Alert>
          </Box>
        )}

        {apiStatus === 'error' && (
          <Box sx={{ 
            position: 'fixed', 
            top: '10px',
            left: '50%', 
            transform: 'translateX(-50%)',
            zIndex: 1100,
            width: { xs: '90%', sm: '60%', md: '40%' },
            textAlign: 'center'
          }}>
            <Alert 
              severity="error"
              sx={{ 
                bgcolor: isDarkMode ? 'rgba(211, 47, 47, 0.1)' : 'rgba(211, 47, 47, 0.05)', 
                color: isDarkMode ? '#fff' : 'inherit',
                '& .MuiAlert-icon': { color: isDarkMode ? '#fff' : '#d32f2f' },
                py: 0.5,
                fontSize: '0.75rem'
              }}
            >
              <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                {error || 'Failed to connect to xAI API. Please try again later.'}
              </Typography>
            </Alert>
          </Box>
        )}

        {/* Usage Limit Indicator */}
        <Container maxWidth="md" sx={{ py: 0.5 }}>
          <Paper
            elevation={2}
            sx={{
              position: 'fixed',
              top: 10,
              right: 10,
              zIndex: 1100,
              p: 1,
              borderRadius: 1.5,
              background: isDarkMode 
                ? auth.currentUser 
                  ? 'rgba(0,200,83,0.1)' 
                  : 'rgba(64,93,230,0.1)' 
                : auth.currentUser
                  ? 'rgba(0,200,83,0.05)'
                  : 'rgba(64,93,230,0.05)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${isDarkMode 
                ? auth.currentUser 
                  ? 'rgba(0,200,83,0.2)' 
                  : 'rgba(64,93,230,0.2)' 
                : auth.currentUser
                  ? 'rgba(0,200,83,0.1)'
                  : 'rgba(64,93,230,0.1)'}`,
              boxShadow: isDarkMode 
                ? auth.currentUser
                  ? '0 4px 12px rgba(0,200,83,0.2)'
                  : '0 4px 12px rgba(64,93,230,0.2)'
                : '0 4px 10px rgba(0,0,0,0.08)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <FaInfoCircle 
                color={isDarkMode 
                  ? auth.currentUser 
                    ? '#00C853' 
                    : '#A78BFA' 
                  : auth.currentUser
                    ? '#00C853'
                    : '#7F56D9'} 
                size={14}
              />
              <Typography
                variant="body2"
                sx={{
                  color: isDarkMode ? 'rgba(255,255,255,0.9)' : '#344054',
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              >
                {auth.currentUser ? 'Premium' : 'Daily Limit'}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#667085',
                mt: 0.25,
                fontSize: '0.7rem'
              }}
            >
              {auth.currentUser 
                ? 'Unlimited flyers' 
                : `${remainingUsage}/${LIMITS.flyers.daily} remaining`}
            </Typography>
            {!auth.currentUser && (
              <Button
                variant="text"
                size="small"
                onClick={() => navigate('/login')}
                sx={{
                  mt: 0.25,
                  color: isDarkMode ? '#A78BFA' : '#7F56D9',
                  textTransform: 'none',
                  fontSize: '0.65rem',
                  fontWeight: 500,
                  padding: '1px 4px',
                  minWidth: 'auto',
                  '&:hover': {
                    background: isDarkMode ? 'rgba(167,139,250,0.1)' : 'rgba(127,86,217,0.1)',
                  }
                }}
              >
              Login for unlimited
              </Button>
            )}
          </Paper>
        </Container>

        <Container 
          maxWidth="md"
          sx={{ 
            mb: 2,
            pt: { xs: 0, sm: 0.5 },
            px: { xs: 1, sm: 1.5 }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: { xs: 0.5, sm: 1 },
            }}
          >
            <Box
              component={motion.div}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
              sx={{
                mb: { xs: 0.5, sm: 0.5 },
                p: { xs: 0.6, sm: 0.8 },
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #833AB4, #C13584, #E1306C)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FaImage size={isMobile ? 14 : 18} color="white" />
            </Box>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '1.2rem', sm: '1.4rem' },
                fontWeight: 700,
                mb: 0.25,
                textAlign: 'center',
                color: isDarkMode ? '#fff' : '#000'
              }}
            >
              Create Flyer
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                mb: 0.5,
                textAlign: 'center'
              }}
            >
              Transform your caption into a professional flyer
            </Typography>
          </Box>

          <Paper
            elevation={2}
            sx={{
              p: { xs: 1.25, sm: 1.5 },
              background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: { xs: '8px', sm: '10px' },
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              boxShadow: isDarkMode 
                ? '0 6px 16px rgba(0, 0, 0, 0.2)' 
                : '0 6px 16px rgba(0, 0, 0, 0.05)',
              transition: `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`,
            }}
          >
            {caption && (
              <Box sx={{ mb: 1.5 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    mb: 0.25,
                    color: isDarkMode ? '#fff' : '#000',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    fontSize: '0.8rem'
                  }}
                >
                  Your Selected Caption
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1,
                    background: isDarkMode ? 'rgba(64,93,230,0.1)' : 'rgba(64,93,230,0.05)',
                    borderRadius: 1,
                    border: `1px solid ${isDarkMode ? 'rgba(64,93,230,0.2)' : 'rgba(64,93,230,0.1)'}`,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontStyle: 'italic',
                      color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)',
                      fontSize: '0.75rem',
                      lineHeight: 1.5,
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
                mb: { xs: 1, sm: 1.25 },
                color: isDarkMode ? '#fff' : '#000',
                textAlign: 'center',
                fontWeight: 600,
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              Describe Your Flyer
            </Typography>

            {/* Description Box */}
            <Box sx={{ mb: 2 }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  mb: 0.5,
                  color: isDarkMode ? '#fff' : '#000',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                Description
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                    padding: '2px',
                    ml: 0.25
                  }}
                >
                  <FaInfoCircle size={8} />
                </IconButton>
              </Typography>
              <TextField
                multiline
                rows={2}
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
                      borderRadius: '6px',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: isDarkMode ? 'rgba(131, 58, 180, 0.6)' : 'rgba(131, 58, 180, 0.6)',
                    },
                    borderRadius: '6px',
                  },
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? '#fff' : '#000',
                    fontSize: '0.8rem',
                    padding: '8px 10px'
                  },
                }}
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block', 
                  mt: 0.5,
                  color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                  fontSize: '0.65rem',
                  lineHeight: 1.2
                }}
              >
                Be specific about colors, topics, headline text, and call-to-action.
              </Typography>
            </Box>

            {/* New Side-by-Side Layout - further optimized */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1.5, sm: 1 }, 
              mb: 2, 
              alignItems: { sm: 'stretch' },
              mx: { xs: 0, sm: 0.5 },
            }}>
              {/* Left side: Logo Upload - more compact */}
              <Box sx={{ 
                flex: { xs: '1', sm: '0 0 120px' },
                mb: { xs: 1, sm: 0 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    mb: 0.5,
                    color: isDarkMode ? '#fff' : '#000',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    alignSelf: 'flex-start'
                  }}
                >
                  Company Logo
                </Typography>
                
                {/* Logo upload container - fixed square */}
                <Box sx={{ 
                  height: 'auto',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <Box 
                    sx={{ 
                      border: `1px dashed ${isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}`,
                      borderRadius: '6px',
                      p: 0.5,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '90px',
                      width: '90px',
                      marginX: 'auto',
                      backgroundColor: isDarkMode ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.02)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                        backgroundColor: isDarkMode ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.04)',
                        cursor: 'pointer'
                      },
                    }}
                    onClick={() => !formState.logoPreview && document.getElementById('logo-upload')?.click()}
                  >
                    {formState.logoPreview ? (
                      <Box sx={{ position: 'relative', width: '100%', height: '100%', textAlign: 'center' }}>
                        <Box
                          component="img"
                          src={formState.logoPreview}
                          alt="Company Logo"
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            borderRadius: '4px',
                            filter: isDarkMode ? 'brightness(1.1)' : 'none',
                          }}
                        />
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            removeLogo();
                          }}
                          sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            backgroundColor: isDarkMode ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.9)',
                            color: isDarkMode ? '#fff' : '#000',
                            p: '2px',
                            '&:hover': {
                              backgroundColor: isDarkMode ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,1)',
                              transform: 'scale(1.05)'
                            },
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          }}
                        >
                          <FaTimesCircle size={12} />
                        </IconButton>
                      </Box>
                    ) : (
                      <>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer',
                            height: '100%',
                            justifyContent: 'center',
                          }}
                        >
                          <FaUpload
                            size={16}
                            color={isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'}
                            style={{ marginBottom: '4px' }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                              fontSize: '0.65rem',
                              fontWeight: 500,
                              textAlign: 'center'
                            }}
                          >
                            Upload Logo
                          </Typography>
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
                  
                  {/* Logo Position Dropdown - simplified */}
                  {formState.logoPreview && (
                    <FormControl 
                      fullWidth 
                      variant="outlined" 
                      size="small"
                      sx={{ 
                        mt: 1,
                        '& .MuiInputBase-root': {
                          color: isDarkMode ? '#fff' : '#000',
                          backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                          fontSize: '0.7rem',
                          borderRadius: '6px',
                          height: '28px',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                        },
                        '& .MuiSvgIcon-root': {
                          color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                          fontSize: '1rem',
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '0.7rem',
                          transform: 'translate(14px, 8px) scale(1)',
                          '&.MuiInputLabel-shrink': {
                            transform: 'translate(14px, -6px) scale(0.75)',
                          }
                        }
                      }}
                    >
                      <InputLabel 
                        id="logo-position-label"
                        sx={{ 
                          color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                          fontSize: '0.7rem',
                        }}
                      >
                        Position
                      </InputLabel>
                      <Select
                        labelId="logo-position-label"
                        value={formState.logoPosition || 'top-right'}
                        onChange={(e) => setFormState(prev => ({
                          ...prev,
                          logoPosition: e.target.value as FlyerFormState['logoPosition']
                        }))}
                        label="Position"
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              borderRadius: '6px',
                              backgroundColor: isDarkMode ? 'rgba(30, 30, 45, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                              maxHeight: '200px',
                              '& .MuiMenuItem-root': {
                                fontSize: '0.7rem',
                                py: 0.5,
                                px: 1,
                              }
                            }
                          }
                        }}
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
                  )}
                </Box>
              </Box>

              {/* Right side: Tips Section - improved design with fixed height */}
              <Box sx={{ 
                flex: '1',
                maxWidth: { xs: '100%', sm: 'calc(100% - 125px)' }
              }}>
                <Box
                  sx={{
                    p: { xs: 1.25, sm: 1.5 },
                    borderRadius: '6px',
                    backgroundColor: isDarkMode 
                      ? 'rgba(131, 58, 180, 0.1)' 
                      : 'rgba(131, 58, 180, 0.05)',
                    border: `1px solid ${isDarkMode ? 'rgba(131, 58, 180, 0.2)' : 'rgba(131, 58, 180, 0.1)'}`,
                    height: { xs: 'auto', sm: '120px' },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: isDarkMode 
                      ? 'inset 0 1px 1px rgba(255,255,255,0.05)' 
                      : 'inset 0 1px 1px rgba(255,255,255,0.7)',
                    overflow: 'hidden',
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
                      color: isDarkMode ? '#fff' : '#000',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}
                  >
                    <span style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      backgroundColor: isDarkMode ? 'rgba(131, 58, 180, 0.3)' : 'rgba(131, 58, 180, 0.2)',
                    }}>
                      <FaInfoCircle size={7} color={isDarkMode ? '#fff' : '#833AB4'} />
                    </span>
                    Tips for a perfect flyer:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.75)',
                      mb: 0.5,
                      fontSize: '0.7rem',
                      lineHeight: 1.3,
                      pl: 0.25,
                    }}
                  >
                    Specify colors, layout, headline text, and call-to-action for best results.
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                      p: 1,
                      borderRadius: '4px',
                      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontStyle: 'italic',
                        color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.65)',
                        fontSize: '0.65rem',
                        lineHeight: 1.3,
                        position: 'relative',
                        pl: 1,
                        '&:before': {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          width: '2px',
                          height: '100%',
                          backgroundColor: isDarkMode ? 'rgba(131, 58, 180, 0.5)' : 'rgba(131, 58, 180, 0.3)',
                          borderRadius: '2px',
                        }
                      }}
                    >
                      "Create a blue and white flyer with 'SUMMER SALE' headline and 'SHOP NOW' button"
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Generate Button - refined */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              mt: 0.5
            }}>
              <Button
                variant="contained"
                disabled={isGenerating || !formState.description.trim()}
                onClick={handleGenerate}
                startIcon={isGenerating ? 
                  <CircularProgress size={14} color="inherit" /> : 
                  <FaMagic size={14} />
                }
                sx={{
                  py: 0.8,
                  px: 3,
                  borderRadius: 20,
                  background: 'linear-gradient(45deg, #833AB4, #C13584, #E1306C)',
                  boxShadow: isDarkMode 
                    ? '0 3px 10px rgba(193,53,132,0.3)' 
                    : '0 3px 10px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  letterSpacing: '0.2px',
                  textTransform: 'none',
                  minWidth: '160px',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #E1306C, #C13584, #833AB4)',
                    transform: 'translateY(-2px)',
                    boxShadow: isDarkMode 
                      ? '0 5px 15px rgba(193,53,132,0.4)' 
                      : '0 5px 15px rgba(0,0,0,0.15)',
                  },
                  '&:active': {
                    transform: 'translateY(1px)',
                    boxShadow: isDarkMode 
                      ? '0 2px 5px rgba(193,53,132,0.4)' 
                      : '0 2px 5px rgba(0,0,0,0.15)',
                    transition: 'all 0.1s ease',
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

        {/* Flyer Popup Dialog - made more compact and simpler */}
        <Dialog 
          open={isPopupOpen && !!generatedFlyer} 
          onClose={() => setIsPopupOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 1,
              background: isDarkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 6px 24px rgba(0, 0, 0, 0.3)',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              margin: '8px'
            }
          }}
        >
          <Box sx={{ 
            p: 1,
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              color: isDarkMode ? '#fff' : '#000',
              fontSize: '0.9rem'
            }}>
              Your Generated Flyer
            </Typography>
            <IconButton onClick={() => setIsPopupOpen(false)} size="small">
              <FaTimes size={12} color={isDarkMode ? '#fff' : '#000'} />
            </IconButton>
          </Box>
          
          <DialogContent sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            p: 1.5,
            pt: 1.5,
          }}>
            {generatedFlyer && (
              <Box
                component="img"
                src={generatedFlyer.imageUrl}
                alt="Generated Flyer"
                sx={{
                  maxWidth: '100%',
                  maxHeight: '55vh',
                  borderRadius: 1,
                  boxShadow: '0 3px 12px rgba(0,0,0,0.2)',
                }}
              />
            )}
          </DialogContent>
          
          <DialogActions sx={{ 
            p: 1.5,
            pt: 0.5,
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            flexWrap: 'wrap',
            borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          }}>
            <Button
              variant="contained"
              onClick={handleDownloadFlyer}
              startIcon={<FaDownload size={12} />}
              sx={{
                py: 0.6,
                px: 1.5,
                borderRadius: 1,
                background: 'linear-gradient(45deg, #833AB4, #C13584, #E1306C)',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.75rem',
                '&:hover': {
                  background: 'linear-gradient(45deg, #E1306C, #C13584, #833AB4)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(193,53,132,0.4)',
                },
              }}
            >
              Download
            </Button>
            <Button
              variant="outlined"
              onClick={handleGenerate}
              startIcon={<FaMagic size={12} />}
              sx={{
                py: 0.6,
                px: 1.5,
                borderRadius: 1,
                borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                color: isDarkMode ? '#fff' : '#000',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.75rem',
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
              startIcon={<FaShare size={12} />}
              sx={{
                py: 0.6,
                px: 1.5,
                borderRadius: 1,
                background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.75rem',
                '&:hover': {
                  background: 'linear-gradient(45deg, #833AB4, #5851DB, #405DE6)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(64,93,230,0.4)',
                },
              }}
            >
              Publish
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
              fontSize: '0.75rem',
              py: 0.5,
              px: 1.5
            }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </AnimatePresence>
  );
};

export default Flyer;