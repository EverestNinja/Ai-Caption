import { Box, Grid, Typography, Link, IconButton, Divider, useTheme } from '@mui/material';
import { GitHub, LinkedIn, Instagram, BugReport, Home, Description, AutoAwesome } from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        py: 6,
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(0, 0, 0, 0.95)' 
          : 'rgba(255, 255, 255, 0.95)',
        borderTop: '1px solid',
        borderColor: theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.05)' 
          : 'rgba(0, 0, 0, 0.05)',
        margin: 0,
        padding: 0
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          px: { xs: 2, sm: 4, md: 6 }
        }}
      >
        <Grid container spacing={4} justifyContent="space-between">
          {/* Company Info */}
          <Grid item xs={12} sm={4}>
            <Typography 
              variant="h6" 
              color="primary" 
              sx={{ 
                fontWeight: 600,
                mb: 2,
                background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Caption Generator
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: theme.palette.text.secondary,
                mb: 2 
              }}
            >
              Create engaging Instagram captions with AI-powered technology.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <IconButton
                href="https://github.com/EverestNinja/Ai-Caption"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{ 
                  color: theme.palette.text.secondary,
                  '&:hover': { 
                    color: '#24292e',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s'
                  }
                }}
              >
                <GitHub />
              </IconButton>
              <IconButton
                href="https://instagram.com/deltabyte.tech"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{ 
                  color: theme.palette.text.secondary,
                  '&:hover': { 
                    color: '#E4405F',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s'
                  }
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                href="https://linkedin.com/company/deltabyte-technologies"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{ 
                  color: theme.palette.text.secondary,
                  '&:hover': { 
                    color: '#0077b5',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s'
                  }
                }}
              >
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={4}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                mb: 2,
                color: theme.palette.text.primary 
              }}
            >
              Quick Links
            </Typography>
            <Link 
              href="/" 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: theme.palette.text.secondary,
                textDecoration: 'none',
                mb: 1,
                '&:hover': {
                  color: theme.palette.primary.main
                }
              }}
            >
              <Home fontSize="small" />
              Home
            </Link>
            <Link 
              href="/generate" 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: theme.palette.text.secondary,
                textDecoration: 'none',
                mb: 1,
                '&:hover': {
                  color: theme.palette.primary.main
                }
              }}
            >
              <AutoAwesome fontSize="small" />
              Generate Captions
            </Link>
            <Link 
              href="/privacy-policy" 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: theme.palette.text.secondary,
                textDecoration: 'none',
                mb: 1,
                '&:hover': {
                  color: theme.palette.primary.main
                }
              }}
            >
              <Description fontSize="small" />
              Privacy Policy
            </Link>
            <Link 
              href="https://github.com/EverestNinja/Ai-Caption/issues" 
              target="_blank"
              rel="noopener noreferrer"
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: theme.palette.text.secondary,
                textDecoration: 'none',
                '&:hover': {
                  color: theme.palette.primary.main
                }
              }}
            >
              <BugReport fontSize="small" />
              Report Issue
            </Link>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} sm={4}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                mb: 2,
                color: theme.palette.text.primary 
              }}
            >
              Contact
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: theme.palette.text.secondary,
                mb: 1
              }}
            >
              Have questions? Reach out to us:
            </Typography>
            <Link
              href="mailto:contact@deltabyte.tech"
              sx={{
                color: theme.palette.primary.main,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              contact@deltabyte.tech
            </Link>
          </Grid>
        </Grid>

        <Divider 
          sx={{ 
            my: 4,
            opacity: 0.1
          }} 
        />

        {/* Copyright */}
        <Box 
          sx={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            width: '100%'
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.text.secondary,
              fontWeight: 500,
              opacity: 0.8
            }}
          >
            © {currentYear} Deltabyte Technologies
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.text.secondary,
              fontWeight: 500,
              opacity: 0.8
            }}
          >
            Developed with ❤️ by Deltabyte Technologies
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer; 