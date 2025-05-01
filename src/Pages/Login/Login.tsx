import { useState } from 'react';
import { Box, Typography, TextField, Button, Checkbox, FormControlLabel, IconButton, Paper, Switch } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { BsSunFill, BsMoonFill } from 'react-icons/bs';
import { FaArrowLeft } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

// Define transition constants
const TRANSITION_TIMING = '0.3s ease';
const TRANSITION_PROPERTIES = 'background-color, color, border-color, box-shadow, transform, opacity';

const AuthPage = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const commonTransition = {
    transition: `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`,
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const auth = getAuth();
      
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        const result = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const db = getFirestore();
        await setDoc(doc(db, 'users', result.user.uid), {
          email: formData.email,
          createdAt: new Date(),
        });
      }
      
      navigate('/generate');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      setError('');
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const db = getFirestore();
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        name: result.user.displayName,
        createdAt: new Date(),
      });

      navigate('/generate');
    } catch (err: any) {
      setError(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <Box sx={{ 
        display: 'flex', 
        minHeight: '100vh',
        bgcolor: isDarkMode ? '#1A1A1A' : '#fff',
        position: 'relative',
        flexDirection: 'column',
        ...commonTransition
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
              transition: TRANSITION_TIMING,
            }}
          >
            <BsMoonFill />
          </IconButton>
        </Paper>

        <Box sx={{ 
          display: 'flex',
          flex: 1,
          mt: 0
        }}>
          {/* Left Side - Login Form */}
          <Box sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: { xs: 2, sm: 4 },
            pt: { xs: 0, sm: 0 },
            maxWidth: '600px'
          }}>
            <Box sx={{ maxWidth: 400, width: '100%', mx: 'auto', mt: 0 }}>
              {/* Logo */}
              <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                <Box 
                  component="img" 
                  src="/logo.svg" 
                  alt="Logo"
                  sx={{ width: 32, height: 32, mr: 2 }}
                />
              </Box>

              <Typography variant="h4" sx={{ 
                fontWeight: 600, 
                mb: 1,
                color: isDarkMode ? '#ffffff' : '#101828'
              }}>
                Welcome back!
              </Typography>
              <Typography sx={{ 
                mb: 4,
                color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#667085'
              }}>
                Enter to get unlimited access to data & information.
              </Typography>

              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}

              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ 
                    mb: 1.5,
                    fontSize: '14px',
                    fontWeight: 500,
                    color: isDarkMode ? 'rgba(255,255,255,0.9)' : '#344054'
                  }}>
                    Email*
                  </Typography>
                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#fff',
                        '& fieldset': {
                          borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#D0D5DD',
                        },
                        '&:hover fieldset': {
                          borderColor: '#7F56D9',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#7F56D9',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: isDarkMode ? '#ffffff' : '#000000',
                      },
                      '& .MuiInputLabel-root': {
                        color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#344054',
                      },
                    }}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ 
                    mb: 1.5,
                    fontSize: '14px',
                    fontWeight: 500,
                    color: isDarkMode ? 'rgba(255,255,255,0.9)' : '#344054'
                  }}>
                    Password*
                  </Typography>
                  <TextField
                    fullWidth
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    InputProps={{
                      endAdornment: (
                        <Box 
                          component="button"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          sx={{ 
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            p: 1,
                            color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#344054'
                          }}
                        >
                          {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </Box>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#fff',
                        '& fieldset': {
                          borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#D0D5DD',
                        },
                        '&:hover fieldset': {
                          borderColor: '#7F56D9',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#7F56D9',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: isDarkMode ? '#ffffff' : '#000000',
                      },
                      '& .MuiInputLabel-root': {
                        color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#344054',
                      },
                    }}
                  />
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3
                }}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        sx={{
                          color: isDarkMode ? 'rgba(255,255,255,0.3)' : '#D0D5DD',
                          '&.Mui-checked': {
                            color: '#7F56D9',
                          },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ 
                        fontSize: '14px', 
                        color: isDarkMode ? 'rgba(255,255,255,0.9)' : '#344054' 
                      }}>
                        Remember me
                      </Typography>
                    }
                  />
                  <Button
                    variant="text"
                    onClick={() => {/* Handle forgot password */}}
                    sx={{ 
                      fontSize: '14px',
                      color: isDarkMode ? '#A78BFA' : '#6941C6',
                      textDecoration: 'none',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Forgot your password?
                  </Button>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  disabled={loading}
                  sx={{
                    py: 2,
                    mb: 3,
                    bgcolor: '#7F56D9',
                    color: '#fff',
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: '#6941C6',
                    },
                    '&.Mui-disabled': {
                      bgcolor: isDarkMode ? 'rgba(127, 86, 217, 0.3)' : '#E9D7FE',
                      color: isDarkMode ? 'rgba(255,255,255,0.5)' : '#fff',
                    },
                  }}
                >
                  {loading ? 'Please wait...' : (isLogin ? 'Log in' : 'Sign up')}
                </Button>

                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mb: 3
                }}>
                  <Box sx={{ 
                    flex: 1, 
                    height: '1px', 
                    bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#EAECF0' 
                  }} />
                  <Typography sx={{ 
                    px: 2,
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#667085',
                    fontSize: '14px'
                  }}>
                    Or {isLogin ? 'login' : 'sign up'} with
                  </Typography>
                  <Box sx={{ 
                    flex: 1, 
                    height: '1px', 
                    bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#EAECF0' 
                  }} />
                </Box>

                <Button
                  fullWidth
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  startIcon={<FcGoogle size={20} />}
                  sx={{
                    py: 2,
                    mb: 3,
                    color: isDarkMode ? 'rgba(255,255,255,0.9)' : '#344054',
                    bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#fff',
                    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : '#D0D5DD'}`,
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#F9FAFB',
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : '#D0D5DD',
                    },
                  }}
                >
                  {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
                </Button>

                <Box sx={{ 
                  textAlign: 'center',
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#667085',
                  fontSize: '14px'
                }}>
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                  <Button
                    onClick={() => setIsLogin(!isLogin)}
                    sx={{
                      color: isDarkMode ? '#A78BFA' : '#6941C6',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: 'transparent',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {isLogin ? 'Register here' : 'Login here'}
                  </Button>
                </Box>
              </form>
            </Box>
          </Box>

          {/* Right Side - Pattern */}
          <Box 
            sx={{ 
              flex: 1,
              bgcolor: isDarkMode ? '#1e1e2d' : '#7F56D9',
              display: { xs: 'none', md: 'block' },
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box 
              component={motion.div}
              animate={{
                background: isDarkMode
                  ? 'radial-gradient(circle at 50% 50%, rgba(131, 58, 180, 0.15) 0%, rgba(193, 53, 132, 0.08) 50%, transparent 100%)'
                  : 'radial-gradient(circle at 50% 50%, rgba(64, 93, 230, 0.2) 0%, rgba(131, 58, 180, 0.1) 50%, transparent 100%)',
              }}
              transition={{ duration: 0.4 }}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: isDarkMode ? `url('/patterndark.svg')` : `url('/pattern.svg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: isDarkMode ? 0.05 : 0.1,
                transition: 'all 0.3s ease'
              }}
            />
          </Box>
        </Box>
      </Box>
    </AnimatePresence>
  );
};

export default AuthPage; 