import { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Button, IconButton, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useStepContext } from '../../context/StepContext';
import StepNavigation from '../../components/StepNavigation/StepNavigation';
import Footer from '../../components/Footer/Footer';
// Comment out problematic import temporarily
// import { Context } from '../../Context/ContextProvider';

// Add type declarations for Facebook SDK
declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: {
      init: (params: {
        appId: string;
        cookie: boolean;
        xfbml: boolean;
        version: string;
      }) => void;
      login: (
        callback: (response: { authResponse?: { accessToken: string }; status?: string }) => void,
        options?: { scope: string }
      ) => void;
      getLoginStatus: (
        callback: (response: { authResponse?: { accessToken: string }; status: string }) => void
      ) => void;
      api: {
        (path: string, params: any, callback?: (response: any) => void): void | any;
        (path: string, method: string, params: any, callback?: (response: any) => void): void | any;
      };
    };
  }
}

// Facebook SDK initialization function
const initFacebookSDK = () => {
  return new Promise<void>((resolve) => {
    // Load the Facebook SDK asynchronously
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: process.env.REACT_APP_FACEBOOK_APP_ID || '[YOUR_FB_APP_ID]',
        cookie: true,
        xfbml: true,
        version: 'v17.0' // Use the latest version
      });
      resolve();
    };

    // Load the SDK
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode?.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  });
};

// For development/testing purposes
const mockPostToSocialMedia = async (_platform: string, _caption: string, _imageUrl: string) => {
  // Simulate API call
  return new Promise<{ success: boolean, postId?: string, error?: string }>((resolve) => {
    setTimeout(() => {
      // Simulate success most of the time
      if (Math.random() > 0.2) {
        resolve({
          success: true,
          postId: `post_${Date.now()}_${Math.floor(Math.random() * 1000)}`
        });
      } else {
        resolve({
          success: false,
          error: 'Failed to connect to social media platform. Please try again.'
        });
      }
    }, 1500);
  });
};

// Define transition constants
const TRANSITION_TIMING = '0.4s cubic-bezier(0.4, 0, 0.2, 1)';
const TRANSITION_PROPERTIES = 'background, color, border-color, box-shadow, transform, opacity, filter';

const Publish = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { currentStep, steps, caption, goToPreviousStep } = useStepContext();
  // Comment out Context usage for now
  // const { selectedCaption, hashtags } = useContext(Context);
  const [mounted, setMounted] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isFacebookConnected, setIsFacebookConnected] = useState(false);
  const [facebookPages, setFacebookPages] = useState<Array<{id: string, name: string}>>([]);
  const [selectedPage, setSelectedPage] = useState<string>('');
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [useRealFacebook] = useState(process.env.NODE_ENV === 'production');

  useEffect(() => {
    setMounted(true);
    
    // Get the preview URL from localStorage
    const storedUrl = localStorage.getItem('generatedFlyerUrl');
    if (storedUrl) {
      setPreviewUrl(storedUrl);
    }

    // Initialize Facebook SDK
    if (useRealFacebook) {
      initFacebookSDK().then(() => {
        setIsSDKLoaded(true);
        
        // Check if user is already logged in
        window.FB.getLoginStatus((response) => {
          if (response.status === 'connected' && response.authResponse) {
            setIsFacebookConnected(true);
            fetchPages(response.authResponse.accessToken);
          }
        });
      });
    }

    return () => {
      setMounted(false);
    };
  }, [useRealFacebook]);

  const fetchPages = (accessToken: string) => {
    if (!useRealFacebook) return;
    
    window.FB.api('/me/accounts', { access_token: accessToken }, (response) => {
      if (response && !response.error) {
        setFacebookPages(response.data);
        if (response.data.length > 0) {
          setSelectedPage(response.data[0].id);
        }
      }
    });
  };

  const handleConnectFacebook = () => {
    if (!useRealFacebook) {
      // In development mode, simulate connection
      setIsConnecting(true);
      setTimeout(() => {
        setIsFacebookConnected(true);
        setIsConnecting(false);
        setFacebookPages([{ id: 'mock_page_id', name: 'My Business Page' }]);
        setSelectedPage('mock_page_id');
      }, 1500);
      return;
    }
    
    if (!isSDKLoaded) {
      setError('Facebook SDK is not loaded yet. Please try again in a moment.');
      return;
    }
    
    setIsConnecting(true);
    setError('');
    
    window.FB.login((response) => {
      if (response.authResponse) {
        setIsFacebookConnected(true);
        fetchPages(response.authResponse.accessToken);
      } else {
        setError('Facebook login was canceled or failed');
      }
      setIsConnecting(false);
    }, { scope: 'pages_manage_posts,pages_read_engagement' });
  };

  const handlePostToFacebook = async () => {
    setIsPosting(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // Get the image URL from previous step
      const imageUrl = previewUrl || '';
      
      if (!useRealFacebook) {
        // Use mock implementation for development
        const result = await mockPostToSocialMedia('facebook', caption, imageUrl);
        
        if (result.success) {
          setSuccessMessage(`Successfully posted to Facebook! Post ID: ${result.postId}`);
        } else {
          setError(result.error || 'Failed to post to Facebook');
        }
        setIsPosting(false);
      } else {
        // Real Facebook posting implementation
        if (!isFacebookConnected) {
          setError('Please connect to Facebook first');
          setIsPosting(false);
          return;
        }
        
        if (!selectedPage) {
          setError('Please select a Facebook page');
          setIsPosting(false);
          return;
        }
        
        // Get page access token
        window.FB.api(`/${selectedPage}`, { fields: 'access_token' }, async (pageResponse: any) => {
          if (pageResponse && !pageResponse.error) {
            const pageAccessToken = pageResponse.access_token;
            
            // Upload image first if we have one
            if (imageUrl) {
              try {
                // For base64 data URLs, we need to convert to blob
                const imageBlob = imageUrl.startsWith('data:') 
                  ? await fetch(imageUrl).then(res => res.blob())
                  : await fetch(imageUrl).then(res => res.blob());
                
                // Create form data for image upload
                const formData = new FormData();
                formData.append('source', imageBlob);
                formData.append('access_token', pageAccessToken);
                
                // Upload image
                fetch(`https://graph.facebook.com/v17.0/${selectedPage}/photos`, {
                  method: 'POST',
                  body: formData
                })
                .then(response => response.json())
                .then(data => {
                  if (data.id) {
                    // Create post with the uploaded image
                    // Using a standard approach to avoid TypeScript issues
                    const apiPath = `/${selectedPage}/feed`;
                    const apiMethod = 'POST';
                    const apiParams = {
                      message: caption,
                      attached_media: [{ media_fbid: data.id }],
                      access_token: pageAccessToken
                    };
                    const apiCallback = (postResponse: any) => {
                      if (postResponse && !postResponse.error) {
                        setSuccessMessage(`Successfully posted to Facebook! Post ID: ${postResponse.id}`);
                      } else {
                        setError(postResponse.error?.message || 'Error posting to Facebook');
                      }
                      setIsPosting(false);
                    };

                    // Using the method signature with 3 parameters
                    window.FB.api(
                      apiPath,
                      {
                        method: apiMethod,
                        ...apiParams
                      },
                      apiCallback
                    );
                  } else {
                    setError(data.error?.message || 'Error uploading image to Facebook');
                    setIsPosting(false);
                  }
                })
                .catch((err: Error) => {
                  setError('Error uploading image: ' + err.message);
                  setIsPosting(false);
                });
              } catch (err) {
                if (err instanceof Error) {
                  setError('Error uploading image: ' + err.message);
                } else {
                  setError('Unknown error occurred');
                }
                setIsPosting(false);
              }
            } else {
              // Text-only post
              // Using a standard approach to avoid TypeScript issues
              const apiPath = `/${selectedPage}/feed`;
              const apiMethod = 'POST';
              const apiParams = {
                message: caption,
                access_token: pageAccessToken
              };
              const apiCallback = (postResponse: any) => {
                if (postResponse && !postResponse.error) {
                  setSuccessMessage(`Successfully posted to Facebook! Post ID: ${postResponse.id}`);
                } else {
                  setError(postResponse.error?.message || 'Error posting to Facebook');
                }
                setIsPosting(false);
              };

              // Using the method signature with 3 parameters
              window.FB.api(
                apiPath,
                {
                  method: apiMethod,
                  ...apiParams
                },
                apiCallback
              );
            }
          } else {
            setError(pageResponse.error?.message || 'Error getting page access token');
            setIsPosting(false);
          }
        });
      }
    } catch (err) {
      setError('An unexpected error occurred while posting to Facebook');
      console.error(err);
      setIsPosting(false);
    }
  };

  const handleCreateNewContent = () => {
    navigate('/generate');
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
          onClick={() => goToPreviousStep()}
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

        {/* Background Gradient */}
        <Box
          component={motion.div}
          animate={{
            background: isDarkMode
              ? 'radial-gradient(circle at 50% 50%, rgba(131, 58, 180, 0.15) 0%, rgba(193, 53, 132, 0.08) 50%, transparent 100%)'
              : 'radial-gradient(circle at 50% 50%, rgba(131, 58, 180, 0.08) 0%, rgba(193, 53, 132, 0.04) 50%, transparent 100%)',
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

        <Container maxWidth="lg" sx={{ mb: 5, pt: { xs: 1, sm: 2 }, px: { xs: 2, sm: 3 } }}>
          {/* Step Navigation */}
          <StepNavigation 
            currentStep={currentStep} 
            steps={steps} 
          />

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: { xs: 3, sm: 4 },
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.25rem' },
                fontWeight: 700,
                mb: 1,
                textAlign: 'center',
                color: isDarkMode ? '#fff' : '#000'
              }}
            >
              Step 3: Publish Your Content
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '0.9rem', sm: '1.1rem' },
                color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                mb: 2,
                textAlign: 'center'
              }}
            >
              Share your content on social media platforms
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* Facebook Preview */}
            <Paper
              elevation={3}
              sx={{
                flex: 1,
                p: { xs: 2, sm: 3 },
                background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(10px)',
                borderRadius: { xs: '12px', sm: '16px' },
                border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                boxShadow: isDarkMode 
                  ? '0 10px 30px rgba(0, 0, 0, 0.2)' 
                  : '0 10px 30px rgba(0, 0, 0, 0.05)',
                transition: `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: isDarkMode ? '#fff' : '#000',
                  fontWeight: 600
                }}
              >
                Facebook Preview
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 2,
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                }}
              >
                How your post will appear on Facebook
              </Typography>

              <Box
                sx={{
                  border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  borderRadius: 2,
                  overflow: 'hidden',
                  mb: 3,
                  background: isDarkMode ? '#1C1E21' : '#fff',
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: isDarkMode ? '#4267B2' : '#4267B2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                    }}
                  >
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                      YB
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: isDarkMode ? '#fff' : '#000'
                      }}
                    >
                      Your Business
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'
                      }}
                    >
                      {new Date().toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Caption displayed before image */}
                {caption && (
                  <Box
                    sx={{
                      p: 2,
                      pb: 1,
                      borderBottom: previewUrl ? 'none' : `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '0.95rem',
                        color: isDarkMode ? '#fff' : '#000',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {caption}
                    </Typography>
                  </Box>
                )}
                
                {previewUrl ? (
                  <Box
                    component="img"
                    src={previewUrl}
                    alt="Preview"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: 200,
                      background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                      <Typography
                        sx={{
                          color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                        }}
                      >
                        Image Preview Not Available
                      </Typography>
                    </Box>
                  )}
                
                <Box
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'
                      }}
                    >
                      <Box
                        sx={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        }}
                      />
                      <Typography variant="caption">Like</Typography>
                    </Box>
                    <Typography 
                      variant="caption"
                      sx={{ 
                        color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'
                      }}
                    >
                      Comment
                    </Typography>
                    <Typography 
                      variant="caption"
                      sx={{ 
                        color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'
                      }}
                    >
                      Share
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>

            {/* Posting Options */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Paper
                elevation={3}
                sx={{
                  p: { xs: 2, sm: 3 },
                  background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: { xs: '12px', sm: '16px' },
                  border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  boxShadow: isDarkMode 
                    ? '0 10px 30px rgba(0, 0, 0, 0.2)' 
                    : '0 10px 30px rgba(0, 0, 0, 0.05)',
                  transition: `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                    color: isDarkMode ? '#fff' : '#000',
                    fontWeight: 600
                  }}
                >
                  Post to Facebook with Glocap AI
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 2,
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                  }}
                >
                  Direct posting to Facebook Pages with analytics tracking
                </Typography>

                <Box
                  sx={{
                    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    borderRadius: 2,
                    p: 2,
                    mb: 3,
                    background: isDarkMode ? 'rgba(66, 103, 178, 0.1)' : 'rgba(66, 103, 178, 0.05)'
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      mb: 2
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: '#4267B2',
                        color: '#fff'
                      }}
                    >
                      <FaFacebook size={24} />
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: isDarkMode ? '#fff' : '#000'
                      }}
                    >
                      Facebook with Glocap AI
                    </Typography>
                  </Box>
                  
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 3,
                      color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                    }}
                  >
                    Connect to Facebook for direct posting with Glocap AI tracking. This integration provides enhanced analytics and more reliable social media posting.
                  </Typography>
                  
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                      mb: 2
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                      }}
                    >
                      <strong>Note:</strong> Development mode is active. The app will use mock Facebook data without requiring a real Facebook login.
                    </Typography>
                  </Box>
                  
                  <Button
                    variant="contained"
                    onClick={handleConnectFacebook}
                    disabled={isConnecting || isFacebookConnected}
                    sx={{
                      width: '100%',
                      py: 1,
                      background: '#4267B2',
                      '&:hover': {
                        background: '#365899'
                      },
                      mb: 2
                    }}
                  >
                    {isConnecting ? <CircularProgress size={20} color="inherit" style={{ marginRight: '8px' }} /> : null}
                    {isFacebookConnected ? 'Connected to Facebook' : (useRealFacebook ? 'Connect to Facebook' : 'Connect Facebook (Dev Mode)')}
                  </Button>
                  
                  {isFacebookConnected && (
                    <>
                      {facebookPages.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ mb: 1, color: isDarkMode ? '#fff' : '#000' }}>
                            Select a Page to post to:
                          </Typography>
                          <select
                            value={selectedPage}
                            onChange={(e) => setSelectedPage(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px',
                              borderRadius: '4px',
                              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#fff',
                              color: isDarkMode ? '#fff' : '#000',
                              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
                              marginBottom: '16px'
                            }}
                          >
                            {facebookPages.map(page => (
                              <option key={page.id} value={page.id}>
                                {page.name}
                              </option>
                            ))}
                          </select>
                        </Box>
                      )}

                      <Button
                        variant="contained"
                        onClick={handlePostToFacebook}
                        disabled={isPosting || !selectedPage}
                        sx={{
                          width: '100%',
                          py: 1.5,
                          background: 'linear-gradient(45deg, #4267B2, #5B7BD5)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #365899, #4267B2)'
                          },
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 1
                        }}
                      >
                        {isPosting ? <CircularProgress size={20} color="inherit" /> : null}
                        Share on Facebook
                      </Button>
                    </>
                  )}
                </Box>
                
                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}
                
                {successMessage && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    {successMessage}
                  </Alert>
                )}
              </Paper>
              
              <Paper
                elevation={3}
                sx={{
                  p: { xs: 2, sm: 3 },
                  background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: { xs: '12px', sm: '16px' },
                  border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  boxShadow: isDarkMode 
                    ? '0 10px 30px rgba(0, 0, 0, 0.2)' 
                    : '0 10px 30px rgba(0, 0, 0, 0.05)',
                  transition: `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                    color: isDarkMode ? '#fff' : '#000',
                    fontWeight: 600
                  }}
                >
                  Instagram & TikTok
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 2,
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                  }}
                >
                  Direct posting coming soon
                </Typography>
                
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 2
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                      borderRadius: 2,
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      background: isDarkMode ? 'rgba(225, 48, 108, 0.1)' : 'rgba(225, 48, 108, 0.05)'
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                        color: '#fff',
                        mb: 1
                      }}
                    >
                      <FaInstagram size={24} />
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: isDarkMode ? '#fff' : '#000',
                        textAlign: 'center'
                      }}
                    >
                      Instagram
                    </Typography>
                  </Box>
                  
                  <Box
                    sx={{
                      flex: 1,
                      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                      borderRadius: 2,
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      background: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: '#000',
                        color: '#fff',
                        mb: 1
                      }}
                    >
                      <FaTiktok size={20} />
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: isDarkMode ? '#fff' : '#000',
                        textAlign: 'center'
                      }}
                    >
                      TikTok
                    </Typography>
                  </Box>
                </Box>
                
                <Typography
                  variant="body2"
                  sx={{
                    mb: 2,
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                  }}
                >
                  Direct posting to Instagram and TikTok will be available in future updates. For now, you can use Facebook to share your content.
                </Typography>
              </Paper>
              
              <Button
                variant="outlined"
                onClick={handleCreateNewContent}
                sx={{
                  py: 1.5,
                  color: isDarkMode ? '#fff' : '#000',
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                  '&:hover': {
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                    background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                  }
                }}
              >
                Create New Content
              </Button>
            </Box>
          </Box>
        </Container>
        <Footer />
      </Box>
    </AnimatePresence>
  );
};

export default Publish; 