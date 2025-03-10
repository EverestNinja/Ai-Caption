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
        py: { xs: 3, sm: 4 },
        mt: 'auto',
        backgroundColor: isDarkMode 
          ? 'rgba(255,255,255,0.05)' 
          : 'rgba(0,0,0,0.02)',
        borderTop: `1px solid ${
          isDarkMode 
            ? 'rgba(255,255,255,0.1)' 
            : 'rgba(0,0,0,0.1)'
        }`,
        transition: 'all 0.3s ease',
      }}
    >
      <Container maxWidth="lg">
        {/* Main 3-column grid */}
        <Grid 
          container 
          spacing={{ xs: 4, md: 2 }}
          sx={{ mb: 4 }}
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
                  gap: 2,
                  mb: 1,
                }}
              >
                <Box
                  component="img"
                  src={GlocapLogo}
                  alt="GloCap Logo"
                  sx={{
                    width: { xs: 40, sm: 45, md: 50 },
                    height: 'auto',
                    objectFit: 'contain',
                    filter: isDarkMode 
                      ? 'brightness(1.2) drop-shadow(0 0 8px rgba(255,255,255,0.4))'
                      : 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      filter: isDarkMode 
                        ? 'brightness(1.3) drop-shadow(0 0 12px rgba(255,255,255,0.5))'
                        : 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
                      transform: 'translateY(-2px)',
                    }
                  }}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: { xs: '1.3rem', md: '1.4rem' },
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                      background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      lineHeight: 1,
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
                      background: 'linear-gradient(45deg, #405DE6 30%, #833AB4 90%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      lineHeight: 1,
                    }}
                  >
                    Best Caption Generator
                  </Typography>
                </Box>
              </Box>
              <Typography
                sx={{
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                  textAlign: { xs: 'center', md: 'left' },
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
                justifyContent: { xs: 'flex-start', md: 'center' },
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: isDarkMode ? '#fff' : '#000',
                  mb: 2,
                  textAlign: 'center',
                }}
              >
                Quick Links
              </Typography>
              
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                {navigationLinks.map((link) => (
                  <Link
                    key={link.path}
                    component="button"
                    onClick={() => navigate(link.path)}
                    sx={{
                      color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease',
                      '&:hover': {
                        color: '#405DE6',
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
                justifyContent: { xs: 'flex-start', md: 'center' },
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: isDarkMode ? '#fff' : '#000',
                  mb: 2,
                  textAlign: 'center',
                }}
              >
                Connect With Us
              </Typography>
              
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'center',
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
                      color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: '#405DE6',
                        transform: 'translateY(-2px)',
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

        <Divider sx={{ 
          borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          mb: 3 
        }} />

        {/* Copyright */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
          }}
        >
          <Typography variant="body2">
            Made with
          </Typography>
          <FaHeart size={12} color="#405DE6" />
          <Typography variant="body2">
            by Deltabyte Technologies © {new Date().getFullYear()}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 