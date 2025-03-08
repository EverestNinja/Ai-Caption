import { ReactElement } from 'react';
import { Box, Container, Typography, Link, Grid, Divider } from '@mui/material';
import { FaGithub, FaLinkedin, FaInstagram, FaHeart, FaTwitter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface FooterProps {
  isDarkMode: boolean;
}

interface NavLink {
  label: string;
  path: string;
}

interface SocialLink {
  icon: ReactElement;
  href: string;
  label: string;
}

const Footer = ({ isDarkMode }: FooterProps) => {
  const navigate = useNavigate();

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
      href: 'https://instagram.com/deltabyte',
      label: 'Instagram'
    },
    {
      icon: <FaTwitter size={22} />,
      href: 'https://twitter.com/deltabyte',
      label: 'Twitter'
    },
    {
      icon: <FaGithub size={22} />,
      href: 'https://github.com/deltabyte',
      label: 'GitHub'
    },
    {
      icon: <FaLinkedin size={22} />,
      href: 'https://linkedin.com/company/deltabyte',
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
                }}
              >
                Instagram Caption Generator
              </Typography>
              
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                  flexWrap: { xs: 'wrap', md: 'nowrap' },
                  justifyContent: { xs: 'center', md: 'flex-start' },
                }}
              >
                <Typography 
                  variant="body2"
                  sx={{ fontSize: '0.9rem' }}
                >
                  Powered by AI
                </Typography>
                <Typography variant="body2">|</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                    Created with
                  </Typography>
                  <FaHeart 
                    size={12} 
                    color="#FF0000"
                    style={{
                      filter: 'drop-shadow(0 0 2px rgba(255, 0, 0, 0.3))',
                    }}
                  />
                </Box>
              </Box>
              
              <Typography
                variant="body2"
                sx={{
                  color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                  lineHeight: 1.6,
                  textAlign: { xs: 'center', md: 'left' },
                  mt: 1,
                  fontSize: '0.9rem',
                }}
              >
                The Instagram Caption Generator is an AI-powered tool that helps users create engaging and creative captions effortlessly. 
                Whether you're posting a fun selfie, an inspiring quote, or a promotional ad, our tool generates high-quality captions tailored to your needs.
              </Typography>
            </Box>
          </Grid>

          {/* Middle Column - Navigation Links */}
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
                      transition: 'all 0.3s ease',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      '&:hover': {
                        color: '#405DE6',
                        transform: 'translateY(-1px)',
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                      },
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Right Column - Social Media */}
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
                  textAlign: { xs: 'center', md: 'right' },
                }}
              >
                Connect With Us
              </Typography>
              
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', md: 'flex-end' },
                }}
              >
                {socialLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    sx={{
                      color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: '#fff',
                        background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
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

        {/* Bottom - Copyright & Developed By */}
        <Divider sx={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
        
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0.5,
            mt: 3,
            color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
          }}
        >
          <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
            Developed with
          </Typography>
          <FaHeart 
            size={12} 
            color="#FF0000"
            style={{
              filter: 'drop-shadow(0 0 2px rgba(255, 0, 0, 0.3))',
            }}
          />
          <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
            by Deltabyte Technologies
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 