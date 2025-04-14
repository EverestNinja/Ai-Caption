import { Box, Container, Typography, Paper, IconButton, Switch, Grid, Card, CardContent , Button, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FaImage, FaFileAlt, FaMagic, FaArrowLeft } from 'react-icons/fa';
import { BsSunFill, BsMoonFill } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Footer from '../../components/Footer/Footer';

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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: "easeOut"
    }
  }),
  hover: {
    y: -10,
    boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const Choose = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  const { isDarkMode, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = () => {
    toggleTheme();
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
              : 'radial-gradient(circle at 50% 50%, rgba(64, 93, 230, 0.08) 0%, rgba(131, 58, 180, 0.04) 50%, transparent 100%)',
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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 120px)',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              mb: { xs: 4, sm: 6 },
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
                background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: { xs: 1, sm: 2 },
              }}
            >
              Choose Your Creation Type
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1rem', sm: '1.2rem' },
                color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                maxWidth: '800px',
                mx: 'auto',
              }}
            >
              Select a content type to get started with our AI-powered generation tools
            </Typography>
          </Box>

          {/* Cards Section */}
          <Grid container spacing={{ xs: 3, md: 6 }} justifyContent="center">
            {/* Caption Generator Card */}
            <Grid item xs={12} sm={6} md={5}>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                custom={0}
              >
                <Card
                  elevation={4}
                  sx={{
                    borderRadius: { xs: '16px', sm: '24px' },
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, rgba(64, 93, 230, 0.2), rgba(88, 81, 219, 0.15))'
                      : 'white',
                    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #405DE6, #5851DB, #833AB4)',
                      height: { xs: '120px', sm: '160px' },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <FaFileAlt 
                      size={isMobile ? 50 : 70} 
                      color="rgba(255,255,255,0.9)" 
                      style={{ 
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                      }} 
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.3) 100%)',
                      }}
                    />
                  </Box>
                  <CardContent
                    sx={{
                      p: { xs: 3, sm: 4 },
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        color: isDarkMode ? '#fff' : '#000',
                        textAlign: 'center',
                      }}
                    >
                      Caption Generator
                    </Typography>
                    <Typography
                      sx={{
                        mb: 3,
                        color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                        textAlign: 'center',
                        flexGrow: 1,
                      }}
                    >
                      Create engaging, AI-powered captions for your social media posts with customizable options for hashtags, emojis, and various styles.
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => navigate('/generate')}
                      startIcon={<FaMagic />}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                        boxShadow: isDarkMode ? '0 4px 15px rgba(64,93,230,0.3)' : '0 4px 15px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #833AB4, #5851DB, #405DE6)',
                          transform: 'translateY(-2px)',
                          boxShadow: isDarkMode ? '0 6px 20px rgba(64,93,230,0.4)' : '0 6px 20px rgba(0,0,0,0.2)',
                        },
                      }}
                    >
                      Generate Captions
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Flyer Generator Card */}
            <Grid item xs={12} sm={6} md={5}>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                custom={1}
              >
                <Card
                  elevation={4}
                  sx={{
                    borderRadius: { xs: '16px', sm: '24px' },
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, rgba(131, 58, 180, 0.2), rgba(193, 53, 132, 0.15))'
                      : 'white',
                    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #833AB4, #C13584, #E1306C)',
                      height: { xs: '120px', sm: '160px' },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <FaImage 
                      size={isMobile ? 50 : 70} 
                      color="rgba(255,255,255,0.9)" 
                      style={{ 
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                      }} 
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.3) 100%)',
                      }}
                    />
                  </Box>
                  <CardContent
                    sx={{
                      p: { xs: 3, sm: 4 },
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        color: isDarkMode ? '#fff' : '#000',
                        textAlign: 'center',
                      }}
                    >
                      Flyer Generator
                    </Typography>
                    <Typography
                      sx={{
                        mb: 3,
                        color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                        textAlign: 'center',
                        flexGrow: 1,
                      }}
                    >
                      Design beautiful promotional flyers with our AI-powered tool. Perfect for events, promotions, announcements, and more.
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => navigate('/flyer')}
                      startIcon={<FaMagic />}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #833AB4, #C13584, #E1306C)',
                        boxShadow: isDarkMode ? '0 4px 15px rgba(193,53,132,0.3)' : '0 4px 15px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #E1306C, #C13584, #833AB4)',
                          transform: 'translateY(-2px)',
                          boxShadow: isDarkMode ? '0 6px 20px rgba(193,53,132,0.4)' : '0 6px 20px rgba(0,0,0,0.2)',
                        },
                      }}
                    >
                      Create Flyers
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Container>

        <Footer />
      </Box>
    </AnimatePresence>
  );
};

export default Choose; 