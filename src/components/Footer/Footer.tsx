import { ReactElement } from 'react';
import { Box, Container, Typography, Link, Grid, Divider } from '@mui/material';
import { FaGithub, FaLinkedin, FaInstagram, FaHeart, FaTwitter } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
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
      label: 'Terms of Service',
      path: '/terms'
    },
    {
      label: 'Report Issues',
      path: '/report'
    }
  ];

  const socialLinks: SocialLink[] = [
    {
      icon: <FaInstagram size={20} />,
      href: 'https://instagram.com',
      label: 'Instagram'
    },
    {
      icon: <FaTwitter size={20} />,
      href: 'https://twitter.com',
      label: 'Twitter'
    },
    {
      icon: <FaGithub size={20} />,
      href: 'https://github.com',
      label: 'GitHub'
    },
    {
      icon: <FaLinkedin size={20} />,
      href: 'https://linkedin.com/company',
      label: 'LinkedIn'
    }
  ];

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        py: { xs: 2, sm: 2.5 },
        mt: 'auto',
        backgroundColor: isDarkMode 
          ? '#121212' 
          : '#e7eafb',
        borderTop: `1px solid ${
          isDarkMode 
            ? 'rgba(255,255,255,0.1)' 
            : 'rgba(0,0,0,0.1)'
        }`,
        transition: 'all 0.3s ease',
        position: 'relative',
        background: isDarkMode 
          ? 'linear-gradient(180deg, #121212 0%, #1e1e2d 100%)' 
          : '#e7eafb',
      }}
    >
      <Container maxWidth="lg">
        <Grid 
          container 
          spacing={{ xs: 2, md: 3 }}
          sx={{ mb: { xs: 1.5, sm: 2 } }}
        >
          {/* Left Column - Brand & Description */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', md: 'flex-start' },
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Box
                  component="img"
                  src={GlocapLogo}
                  alt="GloCap Logo"
                  sx={{
                    width: { xs: 45, sm: 50, md: 52 },
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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: { xs: '1.3rem', md: '1.4rem' },
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                      background: isDarkMode
                        ? 'linear-gradient(45deg, rgba(64, 93, 230, 0.9), rgba(103, 58, 183, 0.8))'
                        : 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
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
                      fontSize: { xs: '0.85rem', sm: '0.9rem' },
                      fontWeight: 500,
                      fontStyle: 'italic',
                      letterSpacing: '0.02em',
                      background: isDarkMode
                        ? 'linear-gradient(45deg, rgba(64, 93, 230, 0.9) 30%, rgba(103, 58, 183, 0.8) 90%)'
                        : 'linear-gradient(45deg, #405DE6 30%, #833AB4 90%)',
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
                  color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                  textAlign: { xs: 'center', md: 'left' },
                  fontSize: { xs: '0.9rem', sm: '0.95rem' },
                  maxWidth: { xs: '280px', md: '100%' },
                  lineHeight: 1.5,
                }}
              >
                Transform your social media presence with AI-powered captions.
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
                  color: isDarkMode ? '#FFFFFF' : '#000000',
                  mb: 1.25,
                  textAlign: 'center',
                  fontSize: { xs: '1.05rem', sm: '1.15rem' },
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -4,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '30px',
                    height: '2px',
                    background: isDarkMode
                      ? 'linear-gradient(45deg, rgba(64, 93, 230, 0.9), rgba(103, 58, 183, 0.8))'
                      : 'linear-gradient(45deg, #405DE6, #5851DB)',
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
                  gap: 0.75,
                }}
              >
                {navigationLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Typography
                      key={link.path}
                      component="div"
                      onClick={() => navigate(link.path)}
                      sx={{
                        color: isActive 
                          ? (isDarkMode ? 'rgba(64, 93, 230, 0.9)' : '#405DE6')
                          : (isDarkMode ? '#FFFFFF' : '#000000'),
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        fontSize: { xs: '0.85rem', sm: '0.9rem' },
                        position: 'relative',
                        fontWeight: isActive ? 600 : 400,
                        padding: '3px 5px',
                        cursor: 'pointer',
                        marginBottom: 0.25,
                        display: 'inline-block',
                        '&:hover': {
                          color: isDarkMode ? 'rgba(64, 93, 230, 0.9)' : '#405DE6',
                          transform: 'translateX(4px)',
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: -14,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: isDarkMode
                            ? 'linear-gradient(45deg, rgba(64, 93, 230, 0.9), rgba(103, 58, 183, 0.8))'
                            : 'linear-gradient(45deg, #405DE6, #5851DB)',
                          opacity: isActive ? 1 : 0,
                          transition: 'opacity 0.3s ease',
                        },
                        '&:hover::before': {
                          opacity: 1,
                        },
                      }}
                    >
                      {link.label}
                    </Typography>
                  );
                })}
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
                  color: isDarkMode ? '#FFFFFF' : '#000000',
                  mb: 1.25,
                  textAlign: 'center',
                  fontSize: { xs: '1.05rem', sm: '1.15rem' },
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -4,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '30px',
                    height: '2px',
                    background: isDarkMode
                      ? 'linear-gradient(45deg, rgba(64, 93, 230, 0.9), rgba(103, 58, 183, 0.8))'
                      : 'linear-gradient(45deg, #405DE6, #5851DB)',
                    borderRadius: '2px',
                  },
                }}
              >
                Connect With Us
              </Typography>
              
              <Box
                sx={{
                  display: 'flex',
                  gap: { xs: 2, sm: 2.5 },
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  mt: 0.75,
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
                      color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: isDarkMode 
                        ? 'rgba(30, 30, 45, 0.4)' 
                        : 'rgba(0,0,0,0.05)',
                      '&:hover': {
                        color: isDarkMode ? 'rgba(64, 93, 230, 0.9)' : '#405DE6',
                        transform: 'translateY(-3px)',
                        background: isDarkMode 
                          ? 'rgba(30, 30, 45, 0.6)' 
                          : 'rgba(0,0,0,0.08)',
                        boxShadow: isDarkMode
                          ? '0 3px 8px rgba(64, 93, 230, 0.3)'
                          : '0 3px 8px rgba(0,0,0,0.15)'
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
            my: { xs: 1.5, sm: 2 },
          }} 
        />

        {/* Copyright Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: { xs: 0.75, sm: 0 },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
              textAlign: { xs: 'center', sm: 'left' },
              fontSize: { xs: '0.85rem', sm: '0.9rem' },
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            © {new Date().getFullYear()} GloCap. Made with <FaHeart style={{ color: isDarkMode ? '#ff4081' : '#ff4081' }} /> by Deltabyte
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
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