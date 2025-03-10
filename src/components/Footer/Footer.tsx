import { ReactElement } from 'react';
import { Box, Container, Typography, Link, Grid, Divider } from '@mui/material';
import { FaGithub, FaLinkedin, FaInstagram, FaHeart, FaTwitter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import GlocapLogo from '../../assets/Glocap.png';

interface NavLink {
  label: string;
  path: string;
}

interface SocialLink {
  icon: ReactElement;
  href: string;
  label: string;
}

const Footer = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const navigationLinks: NavLink[] = [
    {
      label: 'Home',
      path: '/'
    },
    {
      label: 'Generate Caption',
      path: '/generate'
    },
    {
      label: 'Privacy & Policy',
      path: '/privacy'
    },
    {
      label: 'Report Issues',
      path: '/report'
    }
  ];

  const socialLinks: SocialLink[] = [
    {
      icon: <FaInstagram size={22} />,
      href: 'https://instagram.com',
      label: 'Instagram'
    },
    {
      icon: <FaTwitter size={22} />,
      href: 'https://twitter.com',
      label: 'Twitter'
    },
    {
      icon: <FaGithub size={22} />,
      href: 'https://github.com',
      label: 'GitHub'
    },
    {
      icon: <FaLinkedin size={22} />,
      href: 'https://linkedin.com/company',
      label: 'LinkedIn'
    }
  ];

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        py: { xs: 4, sm: 5 },
        mt: 'auto',
        backgroundColor: isDarkMode 
          ? 'rgba(255,255,255,0.03)' 
          : 'rgba(0,0,0,0.02)',
        borderTop: `1px solid ${
          isDarkMode 
            ? 'rgba(255,255,255,0.1)' 
            : 'rgba(0,0,0,0.1)'
        }`,
        transition: 'all 0.3s ease',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
          opacity: 0.5,
        },
      }}
    >
      <Container maxWidth="lg">
        <Grid 
          container 
          spacing={{ xs: 4, md: 6 }}
          sx={{ mb: { xs: 4, sm: 5 } }}
        >
          {/* Left Column - Brand & Description */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', md: 'flex-start' },
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box
                  component="img"
                  src={GlocapLogo}
                  alt="GloCap Logo"
                  sx={{
                    width: { xs: 45, sm: 50, md: 55 },
                    height: 'auto',
                    objectFit: 'contain',
                    filter: isDarkMode 
                      ? 'brightness(1.2) drop-shadow(0 0 10px rgba(255,255,255,0.4))'
                      : 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      filter: isDarkMode 
                        ? 'brightness(1.3) drop-shadow(0 0 15px rgba(255,255,255,0.5))'
                        : 'drop-shadow(0 6px 16px rgba(0,0,0,0.15))',
                      transform: 'translateY(-2px)',
                    }
                  }}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: { xs: '1.4rem', md: '1.5rem' },
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                      background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      lineHeight: 1.1,
                    }}
                  >
                    GloCap
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontSize: { xs: '0.9rem', sm: '0.95rem' },
                      fontWeight: 500,
                      fontStyle: 'italic',
                      letterSpacing: '0.02em',
                      background: 'linear-gradient(45deg, #405DE6 30%, #833AB4 90%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      lineHeight: 1.1,
                    }}
                  >
                    Best Caption Generator
                  </Typography>
                </Box>
              </Box>
              <Typography
                sx={{
                  color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                  textAlign: { xs: 'center', md: 'left' },
                  fontSize: { xs: '0.95rem', sm: '1rem' },
                  maxWidth: { xs: '280px', md: '100%' },
                  lineHeight: 1.6,
                }}
              >
                Transform your social media presence with AI-powered captions that captivate your audience.
              </Typography>
            </Box>
          </Grid>

          {/* Middle Column - Quick Links */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', md: 'center' },
                height: '100%',
                justifyContent: { xs: 'flex-start', md: 'flex-start' },
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: isDarkMode ? '#fff' : '#000',
                  mb: 2.5,
                  textAlign: 'center',
                  fontSize: { xs: '1.1rem', sm: '1.15rem' },
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '40px',
                    height: '2px',
                    background: 'linear-gradient(45deg, #405DE6, #5851DB)',
                    borderRadius: '2px',
                  },
                }}
              >
                Quick Links
              </Typography>
              
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                {navigationLinks.map((link) => (
                  <Link
                    key={link.path}
                    component="button"
                    onClick={() => navigate(link.path)}
                    sx={{
                      color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      fontSize: { xs: '0.95rem', sm: '1rem' },
                      position: 'relative',
                      '&:hover': {
                        color: '#405DE6',
                        transform: 'translateX(4px)',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: -16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #405DE6, #5851DB)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      },
                      '&:hover::before': {
                        opacity: 1,
                      },
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Right Column - Social Links */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', md: 'flex-end' },
                height: '100%',
                justifyContent: { xs: 'flex-start', md: 'flex-start' },
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: isDarkMode ? '#fff' : '#000',
                  mb: 2.5,
                  textAlign: 'center',
                  fontSize: { xs: '1.1rem', sm: '1.15rem' },
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '40px',
                    height: '2px',
                    background: 'linear-gradient(45deg, #405DE6, #5851DB)',
                    borderRadius: '2px',
                  },
                }}
              >
                Connect With Us
              </Typography>
              
              <Box
                sx={{
                  display: 'flex',
                  gap: { xs: 3, sm: 4 },
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {socialLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    sx={{
                      color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: isDarkMode 
                        ? 'rgba(255,255,255,0.05)' 
                        : 'rgba(0,0,0,0.05)',
                      '&:hover': {
                        color: '#405DE6',
                        transform: 'translateY(-4px)',
                        background: isDarkMode 
                          ? 'rgba(255,255,255,0.1)' 
                          : 'rgba(0,0,0,0.08)',
                      },
                    }}
                  >
                    {link.icon}
                  </Link>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider 
          sx={{ 
            borderColor: isDarkMode 
              ? 'rgba(255,255,255,0.1)' 
              : 'rgba(0,0,0,0.1)',
            my: { xs: 3, sm: 4 },
          }} 
        />

        {/* Copyright Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
              textAlign: { xs: 'center', sm: 'left' },
              fontSize: { xs: '0.85rem', sm: '0.9rem' },
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            © {new Date().getFullYear()} GloCap. Made with <FaHeart style={{ color: '#ff4081' }} /> by Deltabyte
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
              textAlign: { xs: 'center', sm: 'right' },
              fontSize: { xs: '0.85rem', sm: '0.9rem' },
            }}
          >
            All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 