import { Box, Button, Container, Typography, Paper, IconButton, Switch, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FaMagic, FaHashtag, FaRegLightbulb, FaRocket } from 'react-icons/fa';
import { BsSunFill, BsMoonFill } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
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
  const isMobile = useMediaQuery('(max-width:600px)');
  const { isDarkMode, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isThemeChanging, setIsThemeChanging] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Apply theme to document body with synchronized transition
    document.body.style.transition = `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`;
    document.body.style.backgroundColor = isDarkMode ? '#121212' : '#ffffff';
    document.body.style.color = isDarkMode ? '#ffffff' : '#121212';
  }, [isDarkMode]);

  const handleThemeToggle = () => {
    setIsThemeChanging(true);
    toggleTheme();
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
    { icon: <FaRocket />, title: 'Instant Results', description: 'Get captions in seconds' }
  ];

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      <Layout>
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
            onClick={toggleTheme}
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
            onChange={handleThemeToggle}
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
          {/* Hero Section - Enhanced for mobile */}
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
                  }
                }}
              />
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
                ...commonTransition,
              }}
            >
              GloCap - Best Content Generator
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
                fontWeight: 500,
                mb: { xs: 3, sm: 4 },
                color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                ...commonTransition,
              }}
            >
              Transform your social media presence with AI-powered content that engages, inspires, and converts
            </Typography>

            <Button
              variant="contained"
              size={isMobile ? "medium" : "large"}
              onClick={() => navigate('/choose')}
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
                    {feature.description.replace('captions', 'content')}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>

          {/* About Us Section */}
          <Box sx={{ 
            py: { xs: 6, sm: 8, md: 10 },
            px: { xs: 2, sm: 0 }
          }}>
            <Typography
              variant="h3"
              sx={{
                textAlign: 'center',
                mb: { xs: 6, sm: 8 },
                fontWeight: 700,
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
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
                  onClick={() => navigate('/choose')}
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
      </Layout>
    </AnimatePresence>
  );
};

export default Landing;
