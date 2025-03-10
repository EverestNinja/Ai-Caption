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
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: '12px',
              boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)',
              background: isDarkMode ? 'rgba(255,255,255,0.03)' : '#fff',
              transition: `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`,
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontSize: { xs: '1.8rem', sm: '2.5rem' },
                fontWeight: 700,
                mb: 1,
                background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textAlign: 'center',
              }}
            >
              Privacy Policy
            </Typography>

            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ mb: 0.5, color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
                Effective Date: March 2025
              </Typography>
              <Typography variant="body2" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
                Last Updated: March 2025
              </Typography>
            </Box>

            <Typography
              variant="body1"
              sx={{
                mb: 4, 
                lineHeight: 1.7,
                color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
              }}
            >
              Welcome to GloCap by Deltabyte Technologies. Your privacy is our priority. This Privacy Policy outlines how we collect, use, disclose, and protect your information when you use our website and services. By accessing or using our website, you agree to the terms outlined in this policy.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 4, 
                fontStyle: 'italic',
                color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
              }}
            >
              If you do not agree with this Privacy Policy, please do not use our website or services.
            </Typography>

            {/* Section 1 */}
            <Typography 
              variant="h5" 
              sx={{ 
                mt: 4, 
                mb: 2, 
                fontWeight: 600,
                color: isDarkMode ? '#fff' : '#000',
              }}
            >
              1. Information We Collect
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
              We collect certain information to improve our services and provide a seamless user experience. This includes:
            </Typography>

            <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
              1.1 Information You Provide Voluntarily
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
              While using our website, you may provide information, including:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 3 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Contact Information:
                </Typography>
                <Typography variant="body1">
                  If you choose to reach out to us via email or any contact form, we may collect your name, email address, and message details.
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  User Input Data:
                </Typography>
                <Typography variant="body1">
                  The text you enter in the form to generate captions (such as post type, post tone, and hashtag preferences) is processed to generate captions but is not stored permanently.
                </Typography>
              </Box>
            </Box>

            <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
              1.2 Automatically Collected Information
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
              When you access our website, we may automatically collect certain technical information, including:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 3 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Device Information:
                </Typography>
                <Typography variant="body1">
                  We may collect details such as your device type, operating system, and browser type.
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Usage Data:
                </Typography>
                <Typography variant="body1">
                  We analyze how users interact with our website, including pages visited, time spent on pages, and features used.
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  IP Address & Log Data:
                </Typography>
                <Typography variant="body1">
                  For security and analytical purposes, we may collect your IP address, browser type, and access times.
                </Typography>
              </Box>
            </Box>

            <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
              1.3 Cookies & Tracking Technologies
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
              We use cookies and similar tracking technologies to enhance user experience, analyze site traffic, and improve our services. These include:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 3 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Essential Cookies:
                </Typography>
                <Typography variant="body1">
                  Required for basic website functionality.
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Analytics Cookies:
                </Typography>
                <Typography variant="body1">
                  Used to track user interactions and improve website performance.
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Preference Cookies:
                </Typography>
                <Typography variant="body1">
                  Store user settings and preferences for a better experience.
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1" sx={{ mb: 4, fontStyle: 'italic' }}>
              You can disable cookies through your browser settings, but some features may not function properly without them.
            </Typography>

            {/* Section 2 */}
            <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
              2. How We Use Your Information
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
              We use the information collected to:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 3 }}>
              <Box component="li">
                <Typography variant="body1">
                  Provide and optimize the GloCap caption generation service.
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1" sx={{ mb: 4, fontWeight: 500 }}>
              We do not sell, trade, or share your personal information with third parties for marketing purposes.
            </Typography>

            {/* Section 3 */}
            <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
              3. Data Storage & Retention
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
              We only retain data for as long as necessary to fulfill the purposes outlined in this policy:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 3 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  User Input Data:
                </Typography>
                <Typography variant="body1">
                  Captions generated are not stored permanently and are deleted after processing.
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Analytics Data:
                </Typography>
                <Typography variant="body1">
                  Usage data is retained for analytical purposes and website improvement but does not personally identify users.
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Contact Information:
                </Typography>
                <Typography variant="body1">
                  Emails and inquiries may be stored for customer support purposes.
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1" sx={{ mb: 4 }}>
              If you wish to request deletion of any stored data, you may contact us at support@deltabyte.com.
            </Typography>

            {/* Section 4 */}
            <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
              4. Data Security & Protection
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
              We implement robust security measures to safeguard your information from unauthorized access, alteration, or disclosure. This includes:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 3 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Encryption:
                </Typography>
                <Typography variant="body1">
                  Data transmission is encrypted using secure SSL technology.
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Access Control:
                </Typography>
                <Typography variant="body1">
                  Limited access to personal data, ensuring only authorized personnel can view it.
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Regular Security Audits:
                </Typography>
                <Typography variant="body1">
                  We monitor our systems to detect and mitigate potential vulnerabilities.
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1" sx={{ mb: 4, fontStyle: 'italic' }}>
              Despite our efforts, no method of data transmission or storage is 100% secure. We encourage users to take personal precautions, such as using strong passwords and keeping software updated.
            </Typography>

            {/* Section 5 */}
            <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
              5. Third-Party Services & Integrations
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
              Our website integrates with Grok API to generate AI-powered captions. While we do not share personal data, Grok API may collect and process input data in accordance with their privacy policy.
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7 }}>
              Additionally, we may use third-party analytics tools (such as Google Analytics) to track user behavior. These third-party services have their own privacy policies, and we encourage you to review them for more details.
            </Typography>

            {/* Contact Section */}
            <Box 
              sx={{
                mt: 6,
                p: 3,
                borderRadius: '8px',
                background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              }}
            >
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
                Contact Us
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
                If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1">
                  📧 Email: support@deltabyte.com
                </Typography>
                <Typography variant="body1">
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