import { Box, Button, Container, Typography, Paper, IconButton, Switch, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FaInstagram, FaMagic, FaHashtag, FaRegLightbulb, FaRocket } from 'react-icons/fa';
import { BsSunFill, BsMoonFill } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

// Define transition constants
const TRANSITION_TIMING = '0.4s cubic-bezier(0.4, 0, 0.2, 1)';
const TRANSITION_PROPERTIES = 'background, color, border-color, box-shadow, transform, opacity, filter';

const Landing = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isThemeChanging, setIsThemeChanging] = useState(false);

  useEffect(() => {
    setMounted(true);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    // Apply theme to document body with synchronized transition
    document.body.style.transition = `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`;
    document.body.style.backgroundColor = isDarkMode ? '#121212' : '#ffffff';
    document.body.style.color = isDarkMode ? '#ffffff' : '#121212';
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsThemeChanging(true);
    setIsDarkMode(!isDarkMode);
    setTimeout(() => setIsThemeChanging(false), 400); // Match transition duration
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

  const features = [
    { icon: <FaMagic />, title: 'AI-Powered', description: 'Advanced AI technology for creative captions' },
    { icon: <FaHashtag />, title: 'Smart Hashtags', description: 'Relevant hashtag suggestions' },
    { icon: <FaRegLightbulb />, title: 'Multiple Styles', description: 'Various tones and styles to choose from' },
    { icon: <FaRocket />, title: 'Instant Results', description: 'Get captions in seconds' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Content Creator',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      text: 'This tool has completely transformed how I create content. The captions are always on point!'
    },
    {
      name: 'Mike Williams',
      role: 'Social Media Manager',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
      text: 'A game-changer for managing multiple accounts. Saves hours of creative work.'
    },
    {
      name: 'Emma Davis',
      role: 'Influencer',
      image: 'https://randomuser.me/api/portraits/women/3.jpg',
      text: 'The variety of styles and tones available is amazing. My engagement has increased significantly!'
    }
  ];

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
        {/* Theme Toggle - Adjusted for mobile */}
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
          component={motion.div}
          animate={{ 
            scale: isThemeChanging ? 0.998 : 1,
            opacity: isThemeChanging ? 0.95 : 1,
          }}
          transition={{ duration: 0.4 }}
          maxWidth="lg"
          sx={{
            position: 'relative',
            zIndex: 1,
            px: { xs: 2, sm: 3, md: 4 },
            ...commonTransition,
          }}
        >
          {/* Hero Section - Enhanced for mobile */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            sx={{
              pt: { xs: 16, sm: 20, md: 24 },
              pb: { xs: 8, sm: 10 },
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
            >
              <IconButton
                sx={{
                  p: { xs: 2, sm: 3 },
                  background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                  mb: { xs: 3, sm: 4 },
                  '&:hover': {
                    background: 'linear-gradient(45deg, #833AB4, #5851DB, #405DE6)',
                  },
                  '@media (hover: none)': {
                    '&:hover': {
                      background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                    }
                  }
                }}
              >
                <FaInstagram size={isMobile ? 32 : 40} color="white" />
              </IconButton>
            </motion.div>

            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '4rem' },
                lineHeight: { xs: 1.2, sm: 1.3 },
                background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: { xs: 2, sm: 3 },
                px: { xs: 2, sm: 0 },
              }}
            >
              AI Instagram Caption Generator
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)',
                maxWidth: '800px',
                mx: 'auto',
                mb: { xs: 4, sm: 6 },
                px: { xs: 2, sm: 3 },
                fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
                lineHeight: 1.5,
              }}
            >
              Transform your Instagram presence with AI-powered captions that engage, inspire, and convert
            </Typography>

            <Button
              variant="contained"
              size={isMobile ? "medium" : "large"}
              onClick={() => navigate('/generate')}
              sx={{
                py: { xs: 1.5, sm: 2 },
                px: { xs: 4, sm: 8 },
                borderRadius: 3,
                fontSize: { xs: '1rem', sm: '1.2rem' },
                background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                width: { xs: '90%', sm: 'auto' },
                '&:hover': {
                  background: 'linear-gradient(45deg, #833AB4, #5851DB, #405DE6)',
                },
                '@media (hover: none)': {
                  '&:hover': {
                    background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                  }
                }
              }}
            >
              Get Started Free
            </Button>
          </Box>

          {/* Features Section - Enhanced for mobile */}
          <Box sx={{ 
            py: { xs: 6, sm: 8, md: 10 },
            px: { xs: 2, sm: 0 }
          }}>
            <Typography
              variant="h3"
              sx={{
                textAlign: 'center',
                mb: { xs: 4, sm: 6, md: 8 },
                color: isDarkMode ? '#fff' : '#000',
                fontWeight: 700,
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                ...commonTransition,
              }}
            >
              Why Choose Us?
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { 
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(4, 1fr)'
                },
                gap: { xs: 3, sm: 4 },
              }}
            >
              {features.map((feature) => (
                <Paper
                  key={feature.title}
                  elevation={0}
                  sx={{
                    p: { xs: 3, sm: 4 },
                    borderRadius: { xs: 3, sm: 4 },
                    ...commonBoxStyles,
                    transition: `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}, transform 0.3s ease`,
                    '&:active': {
                      transform: 'scale(0.98)',
                    },
                    '@media (hover: hover)': {
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        background: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                        boxShadow: isDarkMode 
                          ? '0 4px 20px rgba(0,0,0,0.3)'
                          : '0 4px 20px rgba(0,0,0,0.1)',
                      },
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      color: '#405DE6',
                      fontSize: '2.5rem',
                      mb: 2,
                      ...commonTransition,
                      '&:hover': {
                        transform: 'scale(1.1)',
                      }
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 1,
                      color: isDarkMode ? '#fff' : '#000',
                      ...commonTransition,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                      ...commonTransition,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>

          {/* Testimonials Section - Enhanced for mobile */}
          <Box sx={{ 
            py: { xs: 6, sm: 8, md: 10 },
            px: { xs: 2, sm: 0 }
          }}>
            <Typography
              variant="h3"
              sx={{
                textAlign: 'center',
                mb: { xs: 4, sm: 6, md: 8 },
                color: isDarkMode ? '#fff' : '#000',
                fontWeight: 700,
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                ...commonTransition,
              }}
            >
              What Our Users Say
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(3, 1fr)'
                },
                gap: { xs: 3, sm: 4 },
              }}
            >
              {testimonials.map((testimonial) => (
                <Paper
                  key={testimonial.name}
                  elevation={0}
                  sx={{
                    p: { xs: 3, sm: 4 },
                    borderRadius: { xs: 3, sm: 4 },
                    ...commonBoxStyles,
                    '&:active': {
                      transform: 'scale(0.98)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box
                      component="img"
                      src={testimonial.image}
                      sx={{
                        width: { xs: 50, sm: 60 },
                        height: { xs: 50, sm: 60 },
                        borderRadius: '50%',
                        mr: 2,
                      }}
                    />
                    <Box>
                      <Typography 
                        sx={{ 
                          fontWeight: 600, 
                          color: isDarkMode ? '#fff' : '#000',
                          ...commonTransition,
                        }}
                      >
                        {testimonial.name}
                      </Typography>
                      <Typography 
                        sx={{ 
                          color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                          ...commonTransition,
                        }}
                      >
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography 
                    sx={{ 
                      color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                      ...commonTransition,
                    }}
                  >
                    "{testimonial.text}"
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </AnimatePresence>
  );
};

export default Landing;
