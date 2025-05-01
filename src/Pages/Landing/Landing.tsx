import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FaMagic, FaHashtag, FaRegLightbulb, FaRocket } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlocapLogo from '../../assets/Glocap.png';

// Define transition constants
const TRANSITION_TIMING = '0.4s cubic-bezier(0.4, 0, 0.2, 1)';
const TRANSITION_PROPERTIES = 'background, color, border-color, box-shadow, transform, opacity, filter';

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

const Landing = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isThemeChanging] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Apply theme to document body with synchronized transition
    document.body.style.transition = `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`;
    document.body.style.backgroundColor = isDarkMode ? '#121212' : '#ffffff';
    document.body.style.color = isDarkMode ? '#ffffff' : '#121212';
  }, [isDarkMode]);

  const commonTransition = {
    transition: `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`,
  };

  const commonBoxStyles = {
    ...commonTransition,
    background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    color: isDarkMode ? '#fff' : '#000',
    filter: 'none',
    transform: 'scale(1)',
  };

  const features = [
    { icon: <FaMagic />, title: 'AI-Powered', description: 'Advanced AI technology for creative captions' },
    { icon: <FaHashtag />, title: 'Smart Hashtags', description: 'Relevant hashtag suggestions' },
    { icon: <FaRegLightbulb />, title: 'Multiple Styles', description: 'Various tones and styles to choose from' },
    { icon: <FaRocket />, title: 'Instant Results', description: 'Get captions in seconds' }
  ];

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
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
        maxWidth="lg"
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{
          position: 'relative',
          zIndex: 1,
          pt: { xs: 8, sm: 6 },
          px: { xs: 2, sm: 3, md: 4 },
          pb: { xs: 4, sm: 6 },
          flex: 1,
          width: '100%',
          maxWidth: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
          left: 'auto',
          right: 'auto'
        }}
      >
        {/* Hero Section - Mobile Optimized */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{
            pt: { xs: 4, sm: 6, md: 8 },
            pb: { xs: 8, sm: 10 },
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '2rem'
            }}
          >
            <Box
              component="img"
              src={GlocapLogo}
              alt="GloCap Logo"
              sx={{
                width: { xs: 120, sm: 150, md: 180 },
                height: 'auto',
                objectFit: 'contain',
                filter: isDarkMode 
                  ? 'brightness(1.2) drop-shadow(0 0 10px rgba(255,255,255,0.5))'
                  : 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))',
                transition: 'all 0.4s ease',
                animation: isDarkMode ? 'glow 2s ease-in-out infinite alternate' : 'none',
                '@keyframes glow': {
                  '0%': {
                    filter: 'brightness(1.2) drop-shadow(0 0 10px rgba(255,255,255,0.5))'
                  },
                  '100%': {
                    filter: 'brightness(1.3) drop-shadow(0 0 15px rgba(255,255,255,0.6))'
                  }
                },
                '&:hover': {
                  transform: 'scale(1.03)',
                  filter: isDarkMode 
                    ? 'brightness(1.4) drop-shadow(0 0 20px rgba(255,255,255,0.7))'
                    : 'drop-shadow(0 6px 16px rgba(0,0,0,0.15))',
                }
              }}
            />
          </motion.div>

          {/* Hero Text */}
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
              px: { xs: 1, sm: 2 },
            }}
          >
            AI-Powered Caption Generator
          </Typography>

          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
              color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
              mb: { xs: 4, sm: 5 },
              px: { xs: 2, sm: 4 },
              maxWidth: { xs: '100%', sm: '80%', md: '70%' },
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Create engaging captions and stunning flyers for your social media posts with the power of AI
          </Typography>

          {/* CTA Buttons */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 3 },
              justifyContent: 'center',
              alignItems: 'center',
              mt: { xs: 3, sm: 4 },
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/generate')}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                minWidth: { xs: '100%', sm: 200 },
                py: { xs: 1.5, sm: 2 },
                px: { xs: 3, sm: 4 },
                fontSize: { xs: '1rem', sm: '1.1rem' },
                borderRadius: '12px',
                background: 'linear-gradient(45deg, #405DE6, #5851DB)',
                boxShadow: '0 4px 20px rgba(64,93,230,0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5851DB, #405DE6)',
                  boxShadow: '0 6px 25px rgba(64,93,230,0.4)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Get Started
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/generate')}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                minWidth: { xs: '100%', sm: 200 },
                py: { xs: 1.5, sm: 2 },
                px: { xs: 3, sm: 4 },
                fontSize: { xs: '1rem', sm: '1.1rem' },
                borderRadius: '12px',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                color: isDarkMode ? '#fff' : '#000',
                '&:hover': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                  bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Learn More
            </Button>
          </Box>
        </Box>

        {/* Features Section - Mobile Optimized */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          sx={{
            mt: { xs: 6, sm: 8, md: 10 },
            px: { xs: 1, sm: 2 },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              fontWeight: 700,
              textAlign: 'center',
              mb: { xs: 4, sm: 6 },
              color: isDarkMode ? '#fff' : '#000',
            }}
          >
            Why Choose GloCap?
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
              },
              gap: { xs: 3, sm: 4 },
              px: { xs: 1, sm: 2 },
            }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, sm: 3 },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    borderRadius: '16px',
                    ...commonBoxStyles,
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: isDarkMode
                        ? '0 8px 30px rgba(64,93,230,0.15)'
                        : '0 8px 30px rgba(0,0,0,0.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Box
                    sx={{
                      color: isDarkMode ? '#405DE6' : '#405DE6',
                      fontSize: { xs: '2rem', sm: '2.5rem' },
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: { xs: '1.1rem', sm: '1.2rem' },
                      fontWeight: 600,
                      mb: 1,
                      color: isDarkMode ? '#fff' : '#000',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                      lineHeight: 1.6,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Paper>
              </motion.div>
            ))}
          </Box>
        </Box>
      </Container>
    </AnimatePresence>
  );
};

export default Landing;
