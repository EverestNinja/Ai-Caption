import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  IconButton, 
  Switch
} from '@mui/material';
import { BsSunFill, BsMoonFill } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../components/Layout';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { useTheme } from '../../context/ThemeContext';
import GlocapLogo from '../../assets/Glocap.png';

// Constants for transition
const TRANSITION_TIMING = '0.3s ease';
const TRANSITION_PROPERTIES = 'background-color, color, border-color, box-shadow, transform, opacity';

const Privacy = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      <Layout>
        {/* Back Button */}
        <IconButton
          onClick={handleGoBack}
          sx={{
            position: 'absolute',
            top: { xs: 12, sm: 20 },
            left: { xs: 12, sm: 20 },
            zIndex: 1000,
            background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            color: isDarkMode ? '#fff' : '#000',
            '&:hover': {
              background: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
            },
            transition: `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`,
          }}
          aria-label="Go back"
        >
          <IoArrowBack size={22} />
        </IconButton>

        {/* Theme Toggle */}
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: { xs: 12, sm: 20 },
            right: { xs: 12, sm: 20 },
            borderRadius: '50px',
            p: { xs: '2px', sm: '4px' },
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.5, sm: 1 },
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            transition: `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`,
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
              transition: `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`,
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
              transition: `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`,
            }}
          >
            <BsMoonFill />
          </IconButton>
        </Paper>

        {/* Privacy Policy Content */}
        <Container 
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          maxWidth="md" 
          sx={{ 
            py: { xs: 6, sm: 8 },
            mt: { xs: 4, sm: 6 },
            px: { xs: 2, sm: 3 },
            width: '100%',
            maxWidth: '100%',
            margin: '0 auto',
            boxSizing: 'border-box',
            left: 'auto',
            right: 'auto'
          }}
        >
          <Paper
            elevation={isDarkMode ? 0 : 3}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: '16px',
              boxShadow: isDarkMode 
                ? '0 4px 30px rgba(0,0,0,0.4)' 
                : '0 4px 20px rgba(0,0,0,0.1)',
              background: isDarkMode 
                ? 'rgba(255,255,255,0.05)' 
                : '#fff',
              border: isDarkMode 
                ? '1px solid rgba(255,255,255,0.1)' 
                : 'none',
              transition: `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
              },
            }}
          >
            {/* Logo and Title Section */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
              gap: 2
            }}>
              <Box
                component="img"
                src={GlocapLogo}
                alt="GloCap Logo"
                sx={{
                  width: { xs: 60, sm: 80 },
                  height: 'auto',
                  objectFit: 'contain',
                  filter: isDarkMode 
                    ? 'brightness(1.2) drop-shadow(0 0 10px rgba(255,255,255,0.5))'
                    : 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))',
                  transition: 'all 0.3s ease',
                }}
              />
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontSize: { xs: '1.8rem', sm: '2.5rem' },
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  textAlign: 'center',
                  letterSpacing: '-0.02em',
                }}
              >
                Privacy Policy
              </Typography>
            </Box>

            <Box 
              sx={{ 
                mb: 5, 
                textAlign: 'center',
                p: 2,
                borderRadius: '12px',
                background: isDarkMode 
                  ? 'rgba(255,255,255,0.03)' 
                  : 'rgba(0,0,0,0.02)',
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 1,
                  color: isDarkMode ? '#fff' : 'rgba(0,0,0,0.7)',
                  fontSize: '0.9rem',
                }}
              >
                Effective Date: March 2025
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: isDarkMode ? '#fff' : 'rgba(0,0,0,0.7)',
                  fontSize: '0.9rem',
                }}
              >
                Last Updated: March 2025
              </Typography>
            </Box>

            <Typography
              variant="body1"
              sx={{
                mb: 4, 
                lineHeight: 1.8,
                color: isDarkMode ? '#fff' : 'rgba(0,0,0,0.8)',
                fontSize: '1.1rem',
              }}
            >
              Welcome to GloCap by Deltabyte Technologies. Your privacy is our priority. This Privacy Policy outlines how we collect, use, disclose, and protect your information when you use our website and services.
            </Typography>

            <Box
              sx={{
                p: 3,
                mb: 4,
                borderRadius: '12px',
                background: isDarkMode 
                  ? 'rgba(64, 93, 230, 0.1)' 
                  : 'rgba(64, 93, 230, 0.05)',
                border: `1px solid ${isDarkMode ? 'rgba(64, 93, 230, 0.2)' : 'rgba(64, 93, 230, 0.1)'}`,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontStyle: 'italic',
                  color: isDarkMode ? '#fff' : 'rgba(0,0,0,0.8)',
                  lineHeight: 1.7,
                }}
              >
                If you do not agree with this Privacy Policy, please do not use our website or services.
              </Typography>
            </Box>

            {/* Section 1 */}
            <Typography 
              variant="h5" 
              sx={{ 
                mt: 5, 
                mb: 3, 
                fontWeight: 700,
                fontSize: { xs: '1.4rem', sm: '1.6rem' },
                color: isDarkMode ? '#fff' : '#000',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: -16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 4,
                  height: '80%',
                  background: 'linear-gradient(45deg, #405DE6, #5851DB)',
                  borderRadius: '4px',
                },
                pl: 2,
              }}
            >
              1. Information We Collect
            </Typography>

            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3, 
                lineHeight: 1.8,
                color: isDarkMode ? '#fff' : 'rgba(0,0,0,0.8)',
                fontSize: '1.05rem',
              }}
            >
              We collect certain information to improve our services and provide a seamless user experience. This includes:
            </Typography>

            <Box
              sx={{
                p: 3,
                mb: 4,
                borderRadius: '12px',
                background: isDarkMode 
                  ? 'rgba(255,255,255,0.03)' 
                  : 'rgba(0,0,0,0.02)',
                border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 600,
                  color: isDarkMode ? '#fff' : '#000',
                  fontSize: '1.2rem',
                }}
              >
                1.1 Information You Provide Voluntarily
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 2, 
                  lineHeight: 1.8,
                  color: isDarkMode ? '#fff' : 'rgba(0,0,0,0.8)',
                }}
              >
                While using our website, you may provide information, including:
              </Typography>
              <Box 
                component="ul" 
                sx={{ 
                  pl: 4, 
                  mb: 0,
                  '& li': {
                    mb: 2,
                    '&:last-child': {
                      mb: 0
                    },
                    color: isDarkMode ? '#fff' : 'rgba(0,0,0,0.8)',
                  }
                }}
              >
                <Box component="li">
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 600,
                      color: isDarkMode ? '#fff' : '#000',
                      mb: 0.5,
                    }}
                  >
                    Contact Information:
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{
                      color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)',
                      lineHeight: 1.7,
                    }}
                  >
                    If you choose to reach out to us via email or any contact form, we may collect your name, email address, and message details.
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 600,
                      color: isDarkMode ? '#fff' : '#000',
                      mb: 0.5,
                    }}
                  >
                    User Input Data:
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{
                      color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)',
                      lineHeight: 1.7,
                    }}
                  >
                    The text you enter in the form to generate captions (such as post type, post tone, and hashtag preferences) is processed to generate captions but is not stored permanently.
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Typography variant="h6" sx={{ 
              mt: 3, 
              mb: 1, 
              fontWeight: 600,
              color: isDarkMode ? '#fff' : '#000',
              fontSize: '1.3rem',
            }}>
              1.2 Automatically Collected Information
            </Typography>
            <Typography variant="body1" sx={{ 
              mb: 2, 
              lineHeight: 1.7,
              color: isDarkMode ? '#fff' : 'rgba(0,0,0,0.8)',
            }}>
              When you access our website, we may automatically collect certain technical information, including:
            </Typography>
            <Box component="ul" sx={{ 
              pl: 4, 
              mb: 3,
              '& li': {
                mb: 2,
                color: isDarkMode ? '#fff' : 'rgba(0,0,0,0.8)',
              }
            }}>
              <Box component="li" sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ 
                  fontWeight: 600,
                  color: isDarkMode ? '#fff' : '#000',
                  mb: 0.5,
                }}>
                  Device Information:
                </Typography>
                <Typography variant="body1" sx={{
                  color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)',
                }}>
                  We may collect details such as your device type, operating system, and browser type.
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ 
                  fontWeight: 600,
                  color: isDarkMode ? '#fff' : '#000',
                  mb: 0.5,
                }}>
                  Usage Data:
                </Typography>
                <Typography variant="body1" sx={{
                  color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)',
                }}>
                  We analyze how users interact with our website, including pages visited, time spent on pages, and features used.
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1" sx={{ 
                  fontWeight: 600,
                  color: isDarkMode ? '#fff' : '#000',
                  mb: 0.5,
                }}>
                  IP Address & Log Data:
                </Typography>
                <Typography variant="body1" sx={{
                  color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)',
                }}>
                  For security and analytical purposes, we may collect your IP address, browser type, and access times.
                </Typography>
              </Box>
            </Box>

            <Typography variant="h6" sx={{ 
              mt: 3, 
              mb: 1, 
              fontWeight: 600,
              color: isDarkMode ? '#fff' : '#000',
              fontSize: '1.3rem',
            }}>
              1.3 Cookies & Tracking Technologies
            </Typography>
            <Typography variant="body1" sx={{ 
              mb: 2, 
              lineHeight: 1.7,
              color: isDarkMode ? '#fff' : 'rgba(0,0,0,0.8)',
            }}>
              We use cookies and similar tracking technologies to enhance user experience, analyze site traffic, and improve our services. These include:
            </Typography>
            <Box component="ul" sx={{ 
              pl: 4, 
              mb: 3,
              '& li': {
                mb: 2,
                color: isDarkMode ? '#fff' : 'rgba(0,0,0,0.8)',
              }
            }}>
              <Box component="li" sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ 
                  fontWeight: 600,
                  color: isDarkMode ? '#fff' : '#000',
                  mb: 0.5,
                }}>
                  Essential Cookies:
                </Typography>
                <Typography variant="body1" sx={{
                  color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)',
                }}>
                  Required for basic website functionality.
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ 
                  fontWeight: 600,
                  color: isDarkMode ? '#fff' : '#000',
                  mb: 0.5,
                }}>
                  Analytics Cookies:
                </Typography>
                <Typography variant="body1" sx={{
                  color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)',
                }}>
                  Used to track user interactions and improve website performance.
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1" sx={{ 
                  fontWeight: 600,
                  color: isDarkMode ? '#fff' : '#000',
                  mb: 0.5,
                }}>
                  Preference Cookies:
                </Typography>
                <Typography variant="body1" sx={{
                  color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)',
                }}>
                  Store user settings and preferences for a better experience.
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1" sx={{ 
              mb: 4, 
              fontStyle: 'italic',
              color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)',
              background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              p: 2,
              borderRadius: '8px',
            }}>
              You can disable cookies through your browser settings, but some features may not function properly without them.
            </Typography>

            {/* Section 2 */}
            <Typography variant="h5" sx={{ 
              mt: 4, 
              mb: 2, 
              fontWeight: 700,
              color: isDarkMode ? '#fff' : '#000',
              fontSize: { xs: '1.4rem', sm: '1.6rem' },
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: -16,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 4,
                height: '80%',
                background: 'linear-gradient(45deg, #405DE6, #5851DB)',
                borderRadius: '4px',
              },
              pl: 2,
            }}>
              2. How We Use Your Information
            </Typography>
            <Typography variant="body1" sx={{ 
              mb: 2, 
              lineHeight: 1.7,
              color: isDarkMode ? '#fff' : 'rgba(0,0,0,0.8)',
            }}>
              We use the information collected to:
            </Typography>
            <Box component="ul" sx={{ 
              pl: 4, 
              mb: 3,
              '& li': {
                mb: 2,
                color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
              }
            }}>
              <Box component="li">
                <Typography variant="body1">
                  Provide and optimize the GloCap caption generation service.
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1" sx={{ 
              mb: 4, 
              fontWeight: 500,
              color: isDarkMode ? '#fff' : '#000',
              background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              p: 2,
              borderRadius: '8px',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            }}>
              We do not sell, trade, or share your personal information with third parties for marketing purposes.
            </Typography>

            {/* Section 3 */}
            <Typography variant="h5" sx={{ 
              mt: 4, 
              mb: 2, 
              fontWeight: 700,
              color: isDarkMode ? '#fff' : '#000',
              fontSize: { xs: '1.4rem', sm: '1.6rem' },
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: -16,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 4,
                height: '80%',
                background: 'linear-gradient(45deg, #405DE6, #5851DB)',
                borderRadius: '4px',
              },
              pl: 2,
            }}>
              3. Data Storage & Retention
            </Typography>
            <Typography variant="body1" sx={{ 
              mb: 2, 
              lineHeight: 1.7,
              color: isDarkMode ? '#fff' : 'rgba(0,0,0,0.8)',
            }}>
              We only retain data for as long as necessary to fulfill the purposes outlined in this policy:
            </Typography>
            <Box component="ul" sx={{ 
              pl: 4, 
              mb: 3,
              '& li': {
                mb: 2,
                color: isDarkMode ? '#fff' : 'rgba(0,0,0,0.8)',
              }
            }}>
              <Box component="li" sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ 
                  fontWeight: 600,
                  color: isDarkMode ? '#fff' : '#000',
                  mb: 0.5,
                }}>
                  User Input Data:
                </Typography>
                <Typography variant="body1" sx={{
                  color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)',
                }}>
                  Captions generated are not stored permanently and are deleted after processing.
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ 
                  fontWeight: 600,
                  color: isDarkMode ? '#fff' : '#000',
                  mb: 0.5,
                }}>
                  Analytics Data:
                </Typography>
                <Typography variant="body1" sx={{
                  color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)',
                }}>
                  Usage data is retained for analytical purposes and website improvement but does not personally identify users.
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1" sx={{ 
                  fontWeight: 600,
                  color: isDarkMode ? '#fff' : '#000',
                  mb: 0.5,
                }}>
                  Contact Information:
                </Typography>
                <Typography variant="body1" sx={{
                  color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)',
                }}>
                  Emails and inquiries may be stored for customer support purposes.
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1" sx={{ 
              mb: 4,
              color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)',
              background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              p: 2,
              borderRadius: '8px',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            }}>
              If you wish to request deletion of any stored data, you may contact us at support@deltabyte.com.
            </Typography>

            {/* Section 4 */}
            <Typography variant="h5" sx={{ 
              mt: 4, 
              mb: 2, 
              fontWeight: 700,
              color: isDarkMode ? '#fff' : '#000',
              fontSize: { xs: '1.4rem', sm: '1.6rem' },
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: -16,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 4,
                height: '80%',
                background: 'linear-gradient(45deg, #405DE6, #5851DB)',
                borderRadius: '4px',
              },
              pl: 2,
            }}>
              4. Data Security & Protection
            </Typography>
            <Typography variant="body1" sx={{ 
              mb: 2, 
              lineHeight: 1.7,
              color: isDarkMode ? '#fff' : 'rgba(0,0,0,0.8)',
            }}>
              We implement robust security measures to safeguard your information from unauthorized access, alteration, or disclosure. This includes:
            </Typography>
            <Box component="ul" sx={{ 
              pl: 4, 
              mb: 3,
              '& li': {
                mb: 2,
                color: isDarkMode ? '#fff' : 'rgba(0,0,0,0.8)',
              }
            }}>
              <Box component="li" sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ 
                  fontWeight: 600,
                  color: isDarkMode ? '#fff' : '#000',
                  mb: 0.5,
                }}>
                  Encryption:
                </Typography>
                <Typography variant="body1" sx={{
                  color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)',
                }}>
                  Data transmission is encrypted using secure SSL technology.
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ 
                  fontWeight: 600,
                  color: isDarkMode ? '#fff' : '#000',
                  mb: 0.5,
                }}>
                  Access Control:
                </Typography>
                <Typography variant="body1" sx={{
                  color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)',
                }}>
                  Limited access to personal data, ensuring only authorized personnel can view it.
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1" sx={{ 
                  fontWeight: 600,
                  color: isDarkMode ? '#fff' : '#000',
                  mb: 0.5,
                }}>
                  Regular Security Audits:
                </Typography>
                <Typography variant="body1" sx={{
                  color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)',
                }}>
                  We monitor our systems to detect and mitigate potential vulnerabilities.
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1" sx={{ 
              mb: 4, 
              fontStyle: 'italic',
              color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)',
              background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              p: 2,
              borderRadius: '8px',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            }}>
              Despite our efforts, no method of data transmission or storage is 100% secure. We encourage users to take personal precautions, such as using strong passwords and keeping software updated.
            </Typography>

            {/* Section 5 */}
            <Typography variant="h5" sx={{ 
              mt: 4, 
              mb: 2, 
              fontWeight: 700,
              color: isDarkMode ? '#fff' : '#000',
              fontSize: { xs: '1.4rem', sm: '1.6rem' },
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: -16,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 4,
                height: '80%',
                background: 'linear-gradient(45deg, #405DE6, #5851DB)',
                borderRadius: '4px',
              },
              pl: 2,
            }}>
              5. Third-Party Services & Integrations
            </Typography>

            <Box sx={{
              p: 3,
              mb: 4,
              borderRadius: '12px',
              background: isDarkMode 
                ? 'rgba(255,255,255,0.03)' 
                : 'rgba(0,0,0,0.02)',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            }}>
              <Typography variant="h6" sx={{ 
                mb: 2, 
                fontWeight: 600,
                color: isDarkMode ? '#fff' : '#000',
                fontSize: '1.2rem',
              }}>
                Grok API Integration
              </Typography>
              <Typography variant="body1" sx={{ 
                mb: 3, 
                lineHeight: 1.7,
                color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)',
              }}>
                Our website integrates with Grok API to generate AI-powered captions. While we do not share personal data, Grok API may collect and process input data in accordance with their privacy policy.
              </Typography>

              <Typography variant="h6" sx={{ 
                mb: 2, 
                fontWeight: 600,
                color: isDarkMode ? '#fff' : '#000',
                fontSize: '1.2rem',
              }}>
                Analytics Tools
              </Typography>
              <Typography variant="body1" sx={{ 
                lineHeight: 1.7,
                color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)',
              }}>
                Additionally, we may use third-party analytics tools (such as Google Analytics) to track user behavior. These third-party services have their own privacy policies, and we encourage you to review them for more details.
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ 
              mb: 4,
              p: 2,
              borderRadius: '8px',
              background: isDarkMode 
                ? 'rgba(64, 93, 230, 0.1)' 
                : 'rgba(64, 93, 230, 0.05)',
              border: `1px solid ${isDarkMode ? 'rgba(64, 93, 230, 0.2)' : 'rgba(64, 93, 230, 0.1)'}`,
              color: isDarkMode ? '#fff' : 'rgba(0,0,0,0.8)',
              fontStyle: 'italic',
            }}>
              For more information about how these third-party services handle your data, please refer to their respective privacy policies.
            </Typography>

            {/* Contact Section - Enhanced */}
            <Box 
              sx={{
                mt: 6,
                p: 4,
                borderRadius: '12px',
                background: isDarkMode 
                  ? 'linear-gradient(145deg, rgba(64, 93, 230, 0.1), rgba(131, 58, 180, 0.05))'
                  : 'linear-gradient(145deg, rgba(64, 93, 230, 0.05), rgba(131, 58, 180, 0.02))',
                border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 600, 
                  textAlign: 'center',
                  color: isDarkMode ? '#fff' : '#000',
                }}
              >
                Contact Us
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 3, 
                  textAlign: 'center',
                  color: isDarkMode ? '#fff' : 'rgba(0,0,0,0.8)',
                }}
              >
                If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at:
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: 2 
                }}
              >
                <Typography 
                  variant="body1"
                  sx={{
                    color: isDarkMode ? '#fff' : 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  📧 Email: support@deltabyte.com
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{
                    color: isDarkMode ? '#fff' : 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  🌐 Website: www.deltabyte.com
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Layout>
    </AnimatePresence>
  );
};

export default Privacy; 