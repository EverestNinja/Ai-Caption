import { Box, Container, Typography, Paper, useTheme, IconButton, Switch, TextField, Button, CircularProgress, useMediaQuery, Select, MenuItem, FormControl, InputLabel, FormControlLabel, Tooltip, Zoom, Divider, Dialog, Grid, Slide, Alert, Snackbar } from '@mui/material';
import { BsSunFill, BsMoonFill } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, forwardRef } from 'react';
import { FaMagic, FaHashtag, FaRegLightbulb, FaRegSmile, FaRegCopy, FaTimes } from 'react-icons/fa';
import { MdOutlineDescription, MdArrowBack } from 'react-icons/md';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { generateCaptions } from '../../services/api';

// Define transition constants (matching Landing page)
const TRANSITION_TIMING = '0.4s cubic-bezier(0.4, 0, 0.2, 1)';
const TRANSITION_PROPERTIES = 'background, color, border-color, box-shadow, transform, opacity, filter';

const POST_TYPES = ['Actionable', 'Inspiring', 'Promotional', 'Reels', 'Stories'];
const CAPTION_TONES = ['Fun', 'Poetic', 'Casual', 'Informative', 'Formal', 'Witty'];
const GENERATION_COUNTS = [1, 3, 5];

// Helper function for copying text
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

// Transition component for Dialog
const Transition = forwardRef(function Transition(props: any, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface GeneratedCaption {
  id: number;
  text: string;
  copied?: boolean;
}

const Generation = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isThemeChanging, setIsThemeChanging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form States
  const [postType, setPostType] = useState('');
  const [captionTone, setCaptionTone] = useState('');
  const [generationCount, setGenerationCount] = useState(1);
  const [useHashtags, setUseHashtags] = useState(true);
  const [useEmojis, setUseEmojis] = useState(true);
  const [postDescription, setPostDescription] = useState('');

  // Dialog States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [generatedCaptions, setGeneratedCaptions] = useState<GeneratedCaption[]>([]);
  const [copiedStates, setCopiedStates] = useState<{ [key: number]: boolean }>({});

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const formItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    document.body.style.transition = `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`;
    document.body.style.backgroundColor = isDarkMode ? '#121212' : '#ffffff';
    document.body.style.color = isDarkMode ? '#ffffff' : '#121212';
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsThemeChanging(true);
    setIsDarkMode(!isDarkMode);
    setTimeout(() => setIsThemeChanging(false), 400);
  };

  const commonTransition = {
    transition: `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`,
  };

  const commonBoxStyles = {
    ...commonTransition,
    background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    color: isDarkMode ? '#fff' : '#000',
    filter: isThemeChanging ? 'blur(0.3px)' : 'none',
    transform: isThemeChanging ? 'scale(0.995)' : 'scale(1)',
  };

  // Add debug logging for form state
  useEffect(() => {
    console.log('Form State:', {
      postType,
      captionTone,
      postDescription,
      isGenerating,
      isButtonDisabled: !postType || !captionTone || !postDescription || isGenerating
    });
  }, [postType, captionTone, postDescription, isGenerating]);

  // Function to generate captions using API
  const handleGenerate = async () => {
    console.log('Generate button clicked');
    console.log('Current form values:', {
      postType,
      captionTone,
      generationCount,
      useHashtags,
      useEmojis,
      postDescription,
    });

    setIsGenerating(true);
    setError(null);
    
    try {
      const params = {
        postType,
        captionTone,
        generationCount,
        useHashtags,
        useEmojis,
        postDescription,
      };

      // Use the real API instead of mock
      const captions = await generateCaptions(params);
      setGeneratedCaptions(captions);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Generation error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCaption = (caption: GeneratedCaption) => {
    copyToClipboard(caption.text);
    setCopiedStates(prev => ({ ...prev, [caption.id]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [caption.id]: false }));
    }, 2000);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      <Box
        component={motion.div}
        initial={false}
        animate={{
          background: isDarkMode 
            ? 'linear-gradient(135deg, #1a1a1a 0%, #262626 100%)'
            : 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)',
        }}
        transition={{ duration: 0.4 }}
        sx={{
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          ...commonTransition,
        }}
      >
        {/* Back Button */}
        <IconButton
          onClick={() => navigate('/')}
          sx={{
            position: 'fixed',
            top: { xs: 12, sm: 20 },
            left: { xs: 12, sm: 20 },
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            },
          }}
        >
          <MdArrowBack color={isDarkMode ? '#fff' : '#000'} />
        </IconButton>

        {/* Theme Toggle */}
        <Paper
          elevation={3}
          sx={{
            position: 'fixed',
            top: { xs: 12, sm: 20 },
            right: { xs: 12, sm: 20 },
            borderRadius: '50px',
            p: { xs: '2px', sm: '4px' },
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.5, sm: 1 },
            ...commonBoxStyles,
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            transform: 'scale(1) !important',
            '&:hover': {
              background: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
            }
          }}
        >
          <IconButton 
            size="small" 
            onClick={() => setIsDarkMode(false)}
            sx={{ 
              color: isDarkMode ? 'rgba(255,255,255,0.5)' : '#FDB813',
              transform: `scale(${!isDarkMode ? 1.2 : 1})`,
              ...commonTransition,
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
            onClick={() => setIsDarkMode(true)}
            sx={{ 
              color: isDarkMode ? '#ffffff' : 'rgba(0,0,0,0.3)',
              transform: `scale(${isDarkMode ? 1.2 : 1})`,
              ...commonTransition,
            }}
          >
            <BsMoonFill />
          </IconButton>
        </Paper>

        {/* Background Gradient with Animation */}
        <Box
          component={motion.div}
          animate={{
            background: isDarkMode
              ? 'radial-gradient(circle at 50% 50%, rgba(64, 93, 230, 0.15) 0%, rgba(131, 58, 180, 0.08) 50%, transparent 100%)'
              : 'radial-gradient(circle at 50% 50%, rgba(64, 93, 230, 0.08) 0%, rgba(131, 58, 180, 0.04) 50%, transparent 100%)',
            opacity: isThemeChanging ? 0.5 : 0.8,
          }}
          transition={{ duration: 0.4 }}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            ...commonTransition,
          }}
        />

        <Container 
          maxWidth="md"
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          sx={{
            position: 'relative',
            zIndex: 1,
            pt: { xs: 16, sm: 12 },
            px: { xs: 2, sm: 3, md: 4 },
            pb: { xs: 4, sm: 6 },
          }}
        >
          {/* Title with Icon */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: { xs: 3, sm: 6 },
            }}
          >
            <Box
              component={motion.div}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
              sx={{
                mb: { xs: 1.5, sm: 2 },
                p: { xs: 1.5, sm: 2 },
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FaMagic size={isMobile ? 24 : 32} color="white" />
            </Box>
            <Typography
              variant="h3"
              sx={{
                textAlign: 'center',
                fontWeight: 700,
                background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                lineHeight: 1.2,
                mb: { xs: 1, sm: 1.5 },
              }}
            >
              Generate Your Instagram Caption
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                textAlign: 'center',
                color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                maxWidth: '600px',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                px: { xs: 2, sm: 0 },
              }}
            >
              Create engaging captions that capture attention and drive engagement
            </Typography>
          </Box>

          {/* Form Container */}
          <Paper
            elevation={0}
            component={motion.div}
            variants={formItemVariants}
            sx={{
              p: { xs: 2.5, sm: 4 },
              borderRadius: { xs: 2.5, sm: 4 },
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 2.5, sm: 3 },
              ...commonBoxStyles,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Section: Post Details */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                <MdOutlineDescription size={24} color={isDarkMode ? '#fff' : '#000'} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Post Details
                </Typography>
              </Box>
              
              {/* Post Type Dropdown */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel 
                  id="post-type-label"
                  sx={{ 
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                    '&.Mui-focused': {
                      color: '#405DE6',
                    },
                  }}
                >
                  Post Type
                </InputLabel>
                <Select
                  labelId="post-type-label"
                  value={postType}
                  onChange={(e) => setPostType(e.target.value)}
                  label="Post Type"
                  sx={{
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#405DE6',
                    },
                    '& .MuiSelect-icon': {
                      color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                    },
                  }}
                >
                  {POST_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Caption Tone Dropdown */}
              <FormControl fullWidth>
                <InputLabel 
                  id="caption-tone-label"
                  sx={{ 
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                    '&.Mui-focused': {
                      color: '#405DE6',
                    },
                  }}
                >
                  Caption Tone
                </InputLabel>
                <Select
                  labelId="caption-tone-label"
                  value={captionTone}
                  onChange={(e) => setCaptionTone(e.target.value)}
                  label="Caption Tone"
                  sx={{
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#405DE6',
                    },
                    '& .MuiSelect-icon': {
                      color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                    },
                  }}
                >
                  {CAPTION_TONES.map((tone) => (
                    <MenuItem key={tone} value={tone}>{tone}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Divider sx={{ 
              my: 1,
              borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            }} />

            {/* Section: Generation Options */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                <FaRegLightbulb size={24} color={isDarkMode ? '#fff' : '#000'} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Generation Options
                </Typography>
              </Box>

              {/* Number of Generations Dropdown */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel 
                  id="generation-count-label"
                  sx={{ 
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                    '&.Mui-focused': {
                      color: '#405DE6',
                    },
                  }}
                >
                  Number of Generations
                </InputLabel>
                <Select
                  labelId="generation-count-label"
                  value={generationCount}
                  onChange={(e) => setGenerationCount(Number(e.target.value))}
                  label="Number of Generations"
                  sx={{
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#405DE6',
                    },
                    '& .MuiSelect-icon': {
                      color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                    },
                  }}
                >
                  {GENERATION_COUNTS.map((count) => (
                    <MenuItem key={count} value={count}>{count}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Toggle Switches with Icons */}
              <Box sx={{ 
                display: 'flex', 
                gap: { xs: 2, sm: 3 }, 
                flexWrap: 'wrap',
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
                p: { xs: 1.5, sm: 2 },
                borderRadius: 2,
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: { xs: '1 1 100%', sm: '1 1 auto' } }}>
                  <FaHashtag size={16} color={isDarkMode ? '#fff' : '#000'} />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={useHashtags}
                        onChange={(e) => setUseHashtags(e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase': {
                            color: isDarkMode ? '#405DE6' : '#757575',
                            '&.Mui-checked': {
                              color: '#405DE6',
                            },
                            '&.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#405DE6 !important',
                            },
                          },
                          '& .MuiSwitch-track': {
                            backgroundColor: isDarkMode ? '#ffffff40 !important' : '#00000040 !important',
                          },
                        }}
                      />
                    }
                    label={<Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Use Hashtags</Typography>}
                    sx={{
                      color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
                      ...commonTransition,
                      m: 0,
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: { xs: '1 1 100%', sm: '1 1 auto' } }}>
                  <FaRegSmile size={16} color={isDarkMode ? '#fff' : '#000'} />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={useEmojis}
                        onChange={(e) => setUseEmojis(e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase': {
                            color: isDarkMode ? '#405DE6' : '#757575',
                            '&.Mui-checked': {
                              color: '#405DE6',
                            },
                            '&.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#405DE6 !important',
                            },
                          },
                          '& .MuiSwitch-track': {
                            backgroundColor: isDarkMode ? '#ffffff40 !important' : '#00000040 !important',
                          },
                        }}
                      />
                    }
                    label={<Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Use Emojis</Typography>}
                    sx={{
                      color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
                      ...commonTransition,
                      m: 0,
                    }}
                  />
                </Box>
              </Box>
            </Box>

            <Divider sx={{ 
              my: 1,
              borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            }} />

            {/* Section: Post Description */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                <MdOutlineDescription size={24} color={isDarkMode ? '#fff' : '#000'} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Post Description
                </Typography>
                <Tooltip 
                  title="Describe your post in detail to get better captions" 
                  placement="top"
                  arrow
                >
                  <IconButton size="small">
                    <IoMdInformationCircleOutline color={isDarkMode ? '#fff' : '#000'} />
                  </IconButton>
                </Tooltip>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder="Enter details about your post to help generate better captions..."
                value={postDescription}
                onChange={(e) => setPostDescription(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    '& fieldset': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#405DE6',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? '#fff' : '#000',
                  },
                }}
              />
            </Box>

            {/* Generate Button */}
            <Button
              variant="contained"
              disabled={false} // Remove the disabled condition temporarily for testing
              onClick={handleGenerate}
              startIcon={isGenerating ? <CircularProgress size={isMobile ? 16 : 20} color="inherit" /> : <FaMagic />}
              sx={{
                py: { xs: 1.5, sm: 2 },
                px: { xs: 3, sm: 4 },
                borderRadius: 3,
                background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s ease',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                width: { xs: '100%', sm: 'auto' },
                alignSelf: { xs: 'stretch', sm: 'flex-start' },
                '&:hover': {
                  background: 'linear-gradient(45deg, #833AB4, #5851DB, #405DE6)',
                  transform: 'translateY(-2px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                '&.Mui-disabled': {
                  background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  color: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                },
              }}
            >
              {isGenerating ? 'Generating...' : 'Generate Caption'}
            </Button>
          </Paper>
        </Container>

        {/* Results Dialog */}
        <Dialog
          fullWidth
          maxWidth="md"
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          TransitionComponent={Transition}
          PaperProps={{
            sx: {
              backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
              backgroundImage: 'none',
              borderRadius: { xs: 2, sm: 3 },
            },
          }}
        >
          <Box sx={{ 
            p: { xs: 2, sm: 3 },
            position: 'relative',
          }}>
            {/* Dialog Header */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              mb: 3,
            }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: isDarkMode ? '#fff' : '#000',
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                }}
              >
                Generated Captions
              </Typography>
              <IconButton
                onClick={() => setIsDialogOpen(false)}
                sx={{
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                  '&:hover': {
                    color: '#405DE6',
                  },
                }}
              >
                <FaTimes />
              </IconButton>
            </Box>

            {/* Captions Grid */}
            <Grid container spacing={2}>
              {generatedCaptions.map((caption) => (
                <Grid item xs={12} key={caption.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 2, sm: 3 },
                      borderRadius: 2,
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                      position: 'relative',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        whiteSpace: 'pre-wrap',
                        color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        pr: 4,
                        mb: 1,
                      }}
                    >
                      {caption.text}
                    </Typography>
                    <Box sx={{ 
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      display: 'flex',
                      gap: 1,
                    }}>
                      <Tooltip
                        open={copiedStates[caption.id]}
                        title="Copied to clipboard!"
                        placement="top"
                        TransitionComponent={Zoom}
                      >
                        <IconButton
                          onClick={() => handleCopyCaption(caption)}
                          size="small"
                          sx={{
                            color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                            '&:hover': {
                              color: '#405DE6',
                            },
                          }}
                        >
                          <FaRegCopy size={isMobile ? 16 : 20} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Dialog>

        {/* Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setError(null)}
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
      </Box>
    </AnimatePresence>
  );
};

export default Generation;
