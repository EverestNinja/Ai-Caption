import { useState } from 'react';
import { Box, Typography, TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../components/BackButton';
import themeColors from '../../utils/themeColors';

const AuthPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
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
    transition: `${themeColors.transition.properties} ${themeColors.transition.timing}`,
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
        background: isDarkMode ? themeColors.dark.background : themeColors.light.background,
        color: isDarkMode ? themeColors.dark.textPrimary : themeColors.light.textPrimary,
        position: 'relative',
        flexDirection: 'column',
        ...commonTransition
      }}>
        {/* Background Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isDarkMode ? themeColors.dark.overlay : themeColors.light.overlay,
            zIndex: 0,
          }}
        />

        {/* Back Button */}
        <BackButton />

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
                color: isDarkMode ? themeColors.dark.textPrimary : themeColors.light.textPrimary
              }}>
                Welcome back!
              </Typography>
              <Typography sx={{ 
                mb: 4,
                color: isDarkMode ? themeColors.dark.textSecondary : themeColors.light.textSecondary
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
                    color: isDarkMode ? themeColors.dark.textPrimary : themeColors.light.textPrimary
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
                        bgcolor: isDarkMode ? themeColors.dark.inputBackground : themeColors.light.inputBackground,
                        '& fieldset': {
                          borderColor: isDarkMode ? themeColors.dark.inputBorder : themeColors.light.inputBorder,
                        },
                        '&:hover fieldset': {
                          borderColor: themeColors.primary,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: themeColors.primary,
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: isDarkMode ? themeColors.dark.textPrimary : themeColors.light.textPrimary,
                      },
                      '& .MuiInputLabel-root': {
                        color: isDarkMode ? themeColors.dark.textSecondary : themeColors.light.textSecondary,
                      },
                    }}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ 
                    mb: 1.5,
                    fontSize: '14px',
                    fontWeight: 500,
                    color: isDarkMode ? themeColors.dark.textPrimary : themeColors.light.textPrimary
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
                            color: isDarkMode ? themeColors.dark.textSecondary : themeColors.light.textSecondary
                          }}
                        >
                          {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </Box>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        bgcolor: isDarkMode ? themeColors.dark.inputBackground : themeColors.light.inputBackground,
                        '& fieldset': {
                          borderColor: isDarkMode ? themeColors.dark.inputBorder : themeColors.light.inputBorder,
                        },
                        '&:hover fieldset': {
                          borderColor: themeColors.primary,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: themeColors.primary,
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: isDarkMode ? themeColors.dark.textPrimary : themeColors.light.textPrimary,
                      },
                      '& .MuiInputLabel-root': {
                        color: isDarkMode ? themeColors.dark.textSecondary : themeColors.light.textSecondary,
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
                          color: isDarkMode ? themeColors.dark.textSecondary : themeColors.light.textSecondary,
                          '&.Mui-checked': {
                            color: themeColors.primary,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ 
                        fontSize: '14px', 
                        color: isDarkMode ? themeColors.dark.textPrimary : themeColors.light.textPrimary 
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
                      color: themeColors.primary,
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
                    bgcolor: themeColors.primary,
                    color: '#fff',
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: themeColors.primaryHover,
                    },
                    '&.Mui-disabled': {
                      bgcolor: isDarkMode ? themeColors.dark.disabledBackground : themeColors.light.disabledBackground,
                      color: isDarkMode ? themeColors.dark.disabledText : themeColors.light.disabledText,
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
                    bgcolor: isDarkMode ? themeColors.dark.inputBorder : themeColors.light.inputBorder 
                  }} />
                  <Typography sx={{ 
                    px: 2,
                    color: isDarkMode ? themeColors.dark.textSecondary : themeColors.light.textSecondary,
                    fontSize: '14px'
                  }}>
                    Or {isLogin ? 'login' : 'sign up'} with
                  </Typography>
                  <Box sx={{ 
                    flex: 1, 
                    height: '1px', 
                    bgcolor: isDarkMode ? themeColors.dark.inputBorder : themeColors.light.inputBorder 
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
                    color: isDarkMode ? themeColors.dark.textPrimary : themeColors.light.textPrimary,
                    bgcolor: isDarkMode ? themeColors.dark.inputBackground : themeColors.light.inputBackground,
                    border: `1px solid ${isDarkMode ? themeColors.dark.inputBorder : themeColors.light.inputBorder}`,
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: isDarkMode ? themeColors.dark.inputBackgroundHover : themeColors.light.inputBackgroundHover,
                      borderColor: isDarkMode ? themeColors.dark.inputBorderHover : themeColors.light.inputBorderHover,
                    },
                  }}
                >
                  {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
                </Button>

                <Box sx={{ 
                  textAlign: 'center',
                  color: isDarkMode ? themeColors.dark.textSecondary : themeColors.light.textSecondary,
                  fontSize: '14px'
                }}>
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                  <Button
                    onClick={() => setIsLogin(!isLogin)}
                    sx={{
                      color: themeColors.primary,
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
              bgcolor: isDarkMode ? themeColors.dark.background : themeColors.light.background,
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