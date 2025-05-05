import { Box, Button, Container, Typography, Paper, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FaMagic, FaHashtag, FaRegLightbulb, FaRocket } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useLayoutEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlocapLogo from '../../assets/Glocap.png';
import themeColors from '../../utils/themeColors';

// Define transition constants
const TRANSITION_TIMING = themeColors.transition.timing;
const TRANSITION_PROPERTIES = themeColors.transition.properties;

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
  const isMobile = useMediaQuery('(max-width:600px)');
  const { isDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isThemeChanging = false;

  // Use useLayoutEffect to prevent flash of wrong theme
  useLayoutEffect(() => {
    setMounted(true);
    // Apply initial theme immediately
    document.body.style.transition = 'none';
    document.body.style.backgroundColor = isDarkMode ? themeColors.dark.background : themeColors.light.background;
    document.body.style.color = isDarkMode ? themeColors.dark.textPrimary : themeColors.light.textPrimary;
    // Re-enable transitions after initial render
    requestAnimationFrame(() => {
      document.body.style.transition = `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`;
    });
  }, []);

  useEffect(() => {
    if (mounted) {
      document.body.style.backgroundColor = isDarkMode ? themeColors.dark.background : themeColors.light.background;
      document.body.style.color = isDarkMode ? themeColors.dark.textPrimary : themeColors.light.textPrimary;
    }
  }, [isDarkMode, mounted]);

  const commonTransition = {
    transition: `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`,
  };

  const commonBoxStyles = {
    ...commonTransition,
    background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    color: isDarkMode ? themeColors.dark.textPrimary : themeColors.light.textPrimary,
    filter: isThemeChanging ? 'blur(0.3px)' : 'none',
    transform: isThemeChanging ? 'scale(0.995)' : 'scale(1)',
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: {
            xs: 'calc(var(--vh, 1vh) * 100)',
            sm: '100vh'
          },
          width: '100%',
          background: isDarkMode 
            ? themeColors.dark.background
            : themeColors.light.background,
          color: isDarkMode ? themeColors.dark.textPrimary : themeColors.light.textPrimary,
          transition: `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`,
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          position: 'relative',
          maxWidth: '100vw',
        }}
      >
      {/* Background Gradient with Animation */}
      <Box
        component={motion.div}
        animate={{
          background: isDarkMode
            ? themeColors.dark.overlay
            : themeColors.light.overlay,
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
          pt: { xs: 4, sm: 3 },
          px: { xs: 2, sm: 2, md: 3 },
          pb: { xs: 3, sm: 4 },
          flex: 1,
          width: '100%',
          maxWidth: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
          left: 'auto',
          right: 'auto',
          overflowX: 'hidden',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
          {/* Enhanced Hero Section */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{
            pt: { xs: 4, sm: 6, md: 8 },
              pb: { xs: 6, sm: 8 },
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
              overflow: 'hidden',
          }}
        >
            {/* Logo with enhanced animation */}
          <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: 'spring', 
                stiffness: 100, 
                damping: 10 
              }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
                marginBottom: '2rem',
                position: 'relative'
            }}
          >
              {/* Animated background circles */}
              <Box
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  zIndex: -1,
                }}
              >
                {[...Array(3)].map((_, i) => (
                  <Box
                    key={i}
                    component={motion.div}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      ease: 'easeInOut',
                      repeat: Infinity,
                      delay: i * 0.8,
                    }}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: { xs: 120 + i * 40, sm: 160 + i * 50, md: 200 + i * 60 },
                      height: { xs: 120 + i * 40, sm: 160 + i * 50, md: 200 + i * 60 },
                      borderRadius: '50%',
                      background: isDarkMode
                        ? `rgba(64, 93, 230, ${0.05 - i * 0.01})`
                        : `rgba(64, 93, 230, ${0.03 - i * 0.005})`,
                      filter: 'blur(8px)',
                    }}
                  />
                ))}
              </Box>

            <Box
              component="img"
              src={GlocapLogo}
              alt="GloCap Logo"
              sx={{
                width: { xs: 80, sm: 100, md: 120 },
                height: 'auto',
                objectFit: 'contain',
                filter: isDarkMode 
                      ? 'brightness(1.2) drop-shadow(0 0 10px rgba(255,255,255,0.5)) drop-shadow(0 0 20px rgba(255,255,255,0.3)) drop-shadow(0 0 30px rgba(255,255,255,0.2))'
                  : 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))',
                transition: 'all 0.4s ease',
                animation: isDarkMode ? 'glow 2s ease-in-out infinite alternate' : 'none',
                '@keyframes glow': {
                  '0%': {
                        filter: 'brightness(1.2) drop-shadow(0 0 10px rgba(255,255,255,0.5)) drop-shadow(0 0 20px rgba(255,255,255,0.3)) drop-shadow(0 0 30px rgba(255,255,255,0.2))'
                  },
                  '100%': {
                        filter: 'brightness(1.3) drop-shadow(0 0 15px rgba(255,255,255,0.6)) drop-shadow(0 0 25px rgba(255,255,255,0.4)) drop-shadow(0 0 35px rgba(255,255,255,0.3))'
                  }
                },
                '&:hover': {
                  transform: 'scale(1.03)',
                  filter: isDarkMode 
                        ? 'brightness(1.4) drop-shadow(0 0 20px rgba(255,255,255,0.7)) drop-shadow(0 0 30px rgba(255,255,255,0.5)) drop-shadow(0 0 40px rgba(255,255,255,0.4))'
                    : 'drop-shadow(0 6px 16px rgba(0,0,0,0.15))',
                    },
                    position: 'relative',
                    zIndex: 2,
              }}
            />
          </motion.div>

            {/* Hero Heading with improved animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' },
              lineHeight: { xs: 1.2, sm: 1.3 },
              background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              mb: { xs: 2, sm: 3 },
                  ...commonTransition,
                  textShadow: isDarkMode ? '0 0 30px rgba(64,93,230,0.3)' : 'none',
            }}
          >
                GloCap - Best Content Generator
          </Typography>
            </motion.div>

            {/* Subtitle with improved animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
          <Typography
            variant="h2"
            sx={{
                  fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
                  fontWeight: 500,
              mb: { xs: 4, sm: 5 },
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                  ...commonTransition,
                  maxWidth: { xs: '100%', sm: '90%', md: '80%' },
              mx: 'auto',
            }}
          >
                Transform your social media presence with AI-powered content that engages, inspires, and converts
          </Typography>
            </motion.div>

            {/* CTA Button with improved animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.7,
                type: 'spring',
                stiffness: 200
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
          >
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
                    boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                  transform: 'translateY(-2px)',
                },
                  '@media (hover: none)': {
                    '&:hover': {
                      background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                    }
                  },
                  position: 'relative',
                  overflow: 'hidden',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    animation: 'shine 3s infinite',
                  },
                  '@keyframes shine': {
                    '0%': { left: '-100%' },
                    '20%': { left: '100%' },
                    '100%': { left: '100%' },
                  },
                }}
            >
                Get Started Free
            </Button>
            </motion.div>

            {/* Stats Section - New Addition */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'center',
                alignItems: 'center',
                gap: { xs: 3, md: 6 },
                mt: { xs: 6, sm: 8 },
                mb: { xs: 2, sm: 3 },
                mx: 'auto',
                maxWidth: { xs: '100%', md: '80%' },
              }}
            >
              {[
                { value: '5k+', label: 'Active Users' },
                { value: '100k+', label: 'Captions Generated' },
                { value: '4.8', label: 'User Rating' },
              ].map((stat, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    py: { xs: 2, sm: 2.5 },
                    px: { xs: 4, sm: 5 },
                    borderRadius: 3,
                    ...commonBoxStyles,
                    background: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: { xs: '40%', md: '20%' },
                    transform: 'scale(1) !important',
                '&:hover': {
                      background: isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)',
                    }
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontSize: { xs: '1.4rem', sm: '1.6rem' },
                      fontWeight: 700,
                      background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      mb: 0.5,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    sx={{
                      color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
              }}
            >
                    {stat.label}
                  </Typography>
                </Paper>
              ))}
          </Box>
        </Box>

          {/* Features Section - Keep existing but add scroll animation */}
        <Box
          component={motion.div}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          sx={{
              py: { xs: 4, sm: 5, md: 6 },
              px: { xs: 2, sm: 0 },
              width: '100%',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
                mb: { xs: 3, sm: 4, md: 5 },
              color: isDarkMode ? '#fff' : '#000',
                fontWeight: 700,
                fontSize: { xs: '1.4rem', sm: '1.6rem', md: '1.8rem' },
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
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Paper
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
                        fontSize: '1.8rem',
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
                      {feature.description.replace('captions', 'content')}
                    </Typography>
                  </Paper>
                </motion.div>
              ))}
            </Box>
          </Box>

          {/* About Us Section - Keep with scroll animations */}
          <Box 
            component={motion.div}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            sx={{ 
              py: { xs: 4, sm: 5, md: 6 },
              px: { xs: 2, sm: 0 },
              width: '100%',
              mb: { xs: 4, sm: 5, md: 6 },
            }}>
            <Typography
              variant="h3"
              sx={{
                textAlign: 'center',
                mb: { xs: 4, sm: 5 },
                fontWeight: 700,
                fontSize: { xs: '1.4rem', sm: '1.6rem', md: '1.8rem' },
                background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                ...commonTransition,
              }}
            >
              About Us
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 6, sm: 8 },
                maxWidth: '900px',
                margin: '0 auto',
              }}
            >
              {/* Introduction Section */}
              <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    lineHeight: 1.8,
                    mb: 3,
                    color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
                  }}
                >
                  Welcome to GloCap - Best Content Generator, your ultimate AI-powered tool for crafting the perfect social media content.
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    lineHeight: 1.8,
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                  }}
                >
                  Whether you're an influencer looking to engage your audience, a brand trying to increase reach, or an everyday user wanting to add personality to your posts, GloCap is designed to help you express yourself effortlessly.
                </Typography>
              </Box>

              {/* Features Grid */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: 4,
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, sm: 4 },
                    borderRadius: { xs: 3, sm: 4 },
                    ...commonBoxStyles,
                    background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      fontWeight: 600,
                    }}
                  >
                    Who We Are
                  </Typography>
                  <Typography sx={{ lineHeight: 1.8 }}>
                    GloCap is a product of Deltabyte Technologies, committed to leveraging AI and technology to simplify digital content creation. Our team consists of passionate developers, designers, and content strategists who understand the importance of storytelling in the digital space.
                  </Typography>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, sm: 4 },
                    borderRadius: { xs: 3, sm: 4 },
                    ...commonBoxStyles,
                    background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      fontWeight: 600,
                    }}
                  >
                    Our Approach
                  </Typography>
                  <Typography sx={{ lineHeight: 1.8 }}>
                    We combine AI intelligence with user preferences to provide captions that feel personalized and engaging. Our focus is on helping users create meaningful content that resonates with their audience while ensuring the best possible experience.
                  </Typography>
                </Paper>
              </Box>

              {/* Mission Section */}
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    fontWeight: 600,
                  }}
                >
                  Our Mission
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                    gap: 3,
                  }}
                >
                  {[
                    {
                      title: 'Effortless Creation',
                      description: 'No more struggling to find the perfect words; our AI generates them instantly.',
                    },
                    {
                      title: 'Enhanced Creativity',
                      description: 'Smart suggestions that spark inspiration and align with different tones and styles.',
                    },
                    {
                      title: 'Time Efficiency',
                      description: 'Streamline your content creation process, whether you post daily or occasionally.',
                    },
                    {
                      title: 'Better Engagement',
                      description: 'Boost likes, shares, and comments with captions that truly connect.',
                    },
                  ].map((item) => (
                    <Paper
                      key={item.title}
                      elevation={0}
                      sx={{
                        p: { xs: 2.5, sm: 3 },
                        borderRadius: { xs: 2, sm: 3 },
                        ...commonBoxStyles,
                        background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                        },
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: { xs: '1.1rem', sm: '1.2rem' },
                      mb: 1,
                          fontWeight: 600,
                      color: isDarkMode ? '#fff' : '#000',
                    }}
                  >
                        {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                    }}
                  >
                        {item.description}
                  </Typography>
                </Paper>
                  ))}
                </Box>
              </Box>

              {/* Call to Action */}
              <Box
                sx={{
                  textAlign: 'center',
                  mt: 6,
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    mb: 4,
                    color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
                    lineHeight: 1.8,
                  }}
                >
                  Join us on this journey and experience the power of AI-driven captions that transform your social media game. Whether you're posting for fun, business, or influence, GloCap is here to make every caption count!
                </Typography>
                <Button
                  variant="contained"
                  size={isMobile ? "medium" : "large"}
                  onClick={() => navigate('/generate')}
                  sx={{
                    py: { xs: 1.5, sm: 2 },
                    px: { xs: 4, sm: 6 },
                    borderRadius: 3,
                    background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #833AB4, #5851DB, #405DE6)',
                    },
                  }}
                >
                  Get Your Captions Now
                </Button>
              </Box>
          </Box>
        </Box>
      </Container>
      </Box>
    </AnimatePresence>
  );
};

export default Landing;
