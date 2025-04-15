import { useState, useEffect } from 'react';
// MUI Components
import { 
  Container, Typography, Box, useTheme, IconButton, 
  Paper, Switch, useMediaQuery, CircularProgress,
  Snackbar, Alert, Button, TextField, MenuItem, FormControl,
  InputLabel, Select, Stack, Fade, Stepper, Step, StepLabel,
  Tooltip, LinearProgress, Divider, Chip, Grid
} from "@mui/material";
// Icons
import { MdArrowBack } from 'react-icons/md';
import { BsSunFill, BsMoonFill } from 'react-icons/bs';
import { FaMagic, FaInfoCircle, FaCopy } from 'react-icons/fa';
// Other imports
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme as useCustomTheme } from '../../context/ThemeContext';
import Footer from '../../components/Footer/Footer';
import FeedbackButton from '../../components/FeedbackButton';
import { usePositiveMessage } from '../../context/PositiveMessageContext';
import FloatingSettingsButton from '../../components/FloatingSettingsButton';

// ===== TYPES =====
type PostType = 'promotional' | 'engagement' | 'educational' | 'testimonial' | 'event' | 'product-launch';
type BusinessType = 'restaurant' | 'computer-shop' | 'clothing' | 'coffee-shop';

interface FormField {
  id: string;
  label: string;
  placeholder?: string;
  type?: 'select' | 'multiline';
  options?: { value: string; label: string; }[];
  required?: boolean;
  tooltip?: string;
  multiline?: boolean;
}

interface FormState {
  postType: PostType | '';
  businessType: BusinessType | '';
  [key: string]: string;
}

interface FormErrors {
  [key: string]: string;
}

// ===== CONSTANTS =====
const TRANSITION_TIMING = '0.3s ease';
const TRANSITION_PROPERTIES = 'background-color, color, border-color, box-shadow, transform, opacity';

const POST_TYPES = [
  { 
    value: 'promotional', 
    label: 'Promotional Post'
  },
  { 
    value: 'engagement', 
    label: 'Engagement Post'
  },
  { 
    value: 'educational', 
    label: 'Educational Post'
  },
  { 
    value: 'testimonial', 
    label: 'Testimonial Post'
  },
  { 
    value: 'event', 
    label: 'Event Post'
  },
  { 
    value: 'product-launch', 
    label: 'Product Launch Post'
  }
];

const BUSINESS_TYPES = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'computer-shop', label: 'Computer Shop' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'coffee-shop', label: 'Coffee Shop' }
];

const FORM_FIELDS = {
  promotional: [
    { 
      id: 'product', 
      label: "What Are You Selling?", 
      placeholder: "e.g., Handmade Candles",
      tooltip: "Enter the product or service you want to promote"
    },
    { 
      id: 'offer', 
      label: "What's the Deal?", 
      placeholder: "e.g., Buy 2, Get 1 Free",
      tooltip: "Describe your special offer or promotion"
    },
    { 
      id: 'audience', 
      label: "Who's It For?", 
      placeholder: "e.g., Candle Lovers",
      tooltip: "Specify your target audience"
    },
    { 
      id: 'cta', 
      label: "What Should They Do?",
      type: 'select',
      options: [
        { value: 'Shop Now', label: 'Shop Now' },
        { value: 'Grab It', label: 'Grab It' },
        { value: 'Claim Deal', label: 'Claim Deal' },
        { value: 'Check It Out', label: 'Check It Out' }
      ],
      tooltip: "Choose a call-to-action for your post"
    },
    {
      id: 'tone',
      label: "How Should It Sound?",
      type: 'select',
      options: [
        { value: 'exciting', label: 'Exciting' },
        { value: 'urgent', label: 'Urgent' },
        { value: 'friendly', label: 'Friendly' }
      ],
      tooltip: "Select the tone for your promotional message"
    }
  ],
  engagement: [
    { id: 'topic', label: "What's Your Question or Hook?", placeholder: "e.g., What's your go-to snack?" },
    { id: 'tiein', label: "How's It Tied to Your Business?", placeholder: "e.g., Our Bakery" },
    {
      id: 'goal',
      label: "What's Your Goal?",
      type: 'select',
      options: [
        { value: 'comments', label: 'Get Comments' },
        { value: 'chat', label: 'Start a Chat' },
        { value: 'shares', label: 'Get Shares' }
      ]
    },
    {
      id: 'tone',
      label: "How Should It Feel?",
      type: 'select',
      options: [
        { value: 'casual', label: 'Casual' },
        { value: 'fun', label: 'Fun' },
        { value: 'curious', label: 'Curious' }
      ]
    }
  ],
  educational: [
    { id: 'topic', label: "What Are You Teaching?", placeholder: "e.g., Easy Meal Prep" },
    { id: 'tip', label: "What's the Key Tip?", placeholder: "e.g., Plan your meals on Sunday", multiline: true },
    { id: 'industry', label: "Your Business Niche", placeholder: "e.g., Healthy Eating" },
    {
      id: 'tone',
      label: "How Should It Sound?",
      type: 'select',
      options: [
        { value: 'helpful', label: 'Helpful' },
        { value: 'smart', label: 'Smart' },
        { value: 'pro', label: 'Pro' }
      ]
    }
  ],
  testimonial: [
    { id: 'name', label: "Customer's Name", placeholder: "e.g., Mike R." },
    { id: 'quote', label: "What Did They Say?", placeholder: "e.g., Best service ever!", multiline: true },
    { id: 'product', label: "What's It About?", placeholder: "e.g., Our Cleaning Service" },
    {
      id: 'tone',
      label: "How Should It Feel?",
      type: 'select',
      options: [
        { value: 'happy', label: 'Happy' },
        { value: 'thankful', label: 'Thankful' },
        { value: 'real', label: 'Real' }
      ]
    }
  ],
  event: [
    { id: 'name', label: "What's the Event?", placeholder: "e.g., Holiday Sale" },
    { id: 'datetime', label: "When Is It?", placeholder: "e.g., Dec 15, 10 AM-4 PM" },
    { id: 'location', label: "Where's It Happening?", placeholder: "e.g., Our Store or Online" },
    {
      id: 'cta',
      label: "What Should They Do?",
      type: 'select',
      options: [
        { value: 'Join Us', label: 'Join Us' },
        { value: 'RSVP Now', label: 'RSVP Now' },
        { value: 'Don\'t Miss Out', label: 'Don\'t Miss Out' }
      ]
    },
    {
      id: 'tone',
      label: "How Should It Sound?",
      type: 'select',
      options: [
        { value: 'exciting', label: 'Exciting' },
        { value: 'welcoming', label: 'Welcoming' },
        { value: 'urgent', label: 'Urgent' }
      ]
    }
  ],
  'product-launch': [
    { id: 'product', label: "What's the New Product?", placeholder: "e.g., Eco-Friendly Mug" },
    { id: 'feature', label: "What Makes It Special?", placeholder: "e.g., Keeps Drinks Hot for 12 Hours" },
    { id: 'avail', label: "When Can They Get It?", placeholder: "e.g., Available Now" },
    {
      id: 'cta',
      label: "What Should They Do?",
      type: 'select',
      options: [
        { value: 'Shop Now', label: 'Shop Now' },
        { value: 'Get Yours', label: 'Get Yours' },
        { value: 'Learn More', label: 'Learn More' }
      ]
    },
    {
      id: 'tone',
      label: "How Should It Sound?",
      type: 'select',
      options: [
        { value: 'exciting', label: 'Exciting' },
        { value: 'bold', label: 'Bold' },
        { value: 'friendly', label: 'Friendly' }
      ]
    }
  ]
};

const STEPS = ['Choose Type', 'Business Info', 'Post Details', 'Generate'];

/**
 * Main Generation component for creating social media captions
 */
const Generation = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useCustomTheme();
  const { trackAction } = usePositiveMessage();
  const [mounted, setMounted] = useState<boolean>(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [formState, setFormState] = useState<FormState>({
    postType: '',
    businessType: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Apply theme to document body with synchronized transition
    document.body.style.transition = `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`;
    document.body.style.backgroundColor = isDarkMode ? '#121212' : '#ffffff';
    document.body.style.color = isDarkMode ? '#ffffff' : '#121212';
  }, [isDarkMode]);

  const validateField = (field: string, value: string): string => {
    if (!value) return 'This field is required';
    return '';
  };

  const handlePostTypeChange = (type: PostType) => {
    setFormState(prev => ({ ...prev, postType: type }));
  };

  const handleChange = (field: string, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => ({ ...prev, [field]: validateField(field, value) }));
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setError('');
      // TODO: Implement actual caption generation logic here
      await new Promise(resolve => setTimeout(resolve, 2000));
      setGeneratedCaption("This is a sample generated caption based on your inputs.");
      setShowPreview(true);
      trackAction(true);
    } catch (err) {
      setError('Failed to generate captions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(generatedCaption);
    // Show success message
    trackAction(true);
  };

  if (!mounted) return null;

  return (
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
        <MdArrowBack />
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

      {/* Floating Settings Button */}
      <FloatingSettingsButton position="bottom-right" />

      <Container maxWidth="lg" sx={{ mb: 5, pt: 2 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: { xs: 2, sm: 4 },
          }}
        >
          <Box
            component={motion.div}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            sx={{
              mb: { xs: 1, sm: 1.5 },
              p: { xs: 1, sm: 1.5 },
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FaMagic size={isMobile ? 20 : 28} color="white" />
          </Box>
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
            Generate Your Caption
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
            Create engaging captions that capture attention and drive engagement
          </Typography>
        </Box>

        {/* Form Content */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          }}
        >
          {/* Post Type Selection */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: isDarkMode ? '#fff' : '#000',
                textAlign: 'center'
              }}
            >
              Choose Your Post Type
            </Typography>
            <Grid container spacing={2}>
              {POST_TYPES.map((type) => (
                <Grid 
                  item 
                  xs={12} 
                  sm={6} 
                  md={4} 
                  key={type.value}
                  sx={{
                    display: formState.postType && formState.postType !== type.value ? 'none' : 'block',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {formState.postType === type.value ? (
                    <FormControl fullWidth>
                      <Select
                        value={formState.postType}
                        onChange={(e) => handlePostTypeChange(e.target.value as PostType)}
                        sx={{
                          py: 2,
                          px: 3,
                          height: 'auto',
                          borderRadius: 2,
                          background: isDarkMode 
                            ? 'linear-gradient(45deg, rgba(64,93,230,0.2), rgba(88,81,219,0.2), rgba(131,58,180,0.2))'
                            : 'linear-gradient(45deg, rgba(64,93,230,0.1), rgba(88,81,219,0.1), rgba(131,58,180,0.1))',
                          border: `1px solid ${
                            isDarkMode
                              ? 'rgba(64,93,230,0.5)'
                              : 'rgba(64,93,230,0.3)'
                          }`,
                          color: isDarkMode ? '#fff' : '#000',
                          '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                          },
                          '&:hover': {
                            background: isDarkMode 
                              ? 'linear-gradient(45deg, rgba(64,93,230,0.3), rgba(88,81,219,0.3), rgba(131,58,180,0.3))'
                              : 'linear-gradient(45deg, rgba(64,93,230,0.2), rgba(88,81,219,0.2), rgba(131,58,180,0.2))',
                          },
                          '& .MuiSelect-select': {
                            py: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          },
                        }}
                      >
                        {POST_TYPES.map((option) => (
                          <MenuItem 
                            key={option.value} 
                            value={option.value}
                            sx={{
                              py: 2,
                              px: 3,
                              '&:hover': {
                                background: isDarkMode 
                                  ? 'rgba(64,93,230,0.1)'
                                  : 'rgba(64,93,230,0.05)',
                              },
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{ 
                                fontWeight: 600,
                              }}
                            >
                              {option.label}
                            </Typography>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <FeedbackButton
                      fullWidth
                      variant="outlined"
                      isKeyAction={false}
                      onClick={() => handlePostTypeChange(type.value as PostType)}
                      sx={{
                        py: 2,
                        px: 3,
                        height: 'auto',
                        borderRadius: 2,
                        border: `1px solid ${
                          isDarkMode
                            ? 'rgba(255,255,255,0.1)'
                            : 'rgba(0,0,0,0.1)'
                        }`,
                        color: isDarkMode ? '#fff' : '#000',
                        '&:hover': {
                          background: isDarkMode
                            ? 'rgba(255,255,255,0.05)'
                            : 'rgba(0,0,0,0.05)',
                          borderColor: isDarkMode
                            ? 'rgba(64,93,230,0.8)'
                            : 'rgba(64,93,230,0.5)',
                        },
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ 
                          fontWeight: 600,
                        }}
                      >
                        {type.label}
                      </Typography>
                    </FeedbackButton>
                  )}
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Business Type Selection */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Business Type</InputLabel>
            <Select
              value={formState.businessType}
              onChange={(e) => handleChange('businessType', e.target.value)}
              label="Business Type"
              error={!!formErrors.businessType}
              sx={{
                color: isDarkMode ? '#fff' : '#000',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                },
              }}
            >
              {BUSINESS_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
            {formErrors.businessType && (
              <Typography color="error" sx={{ mt: 1, fontSize: '0.75rem' }}>
                {formErrors.businessType}
              </Typography>
            )}
          </FormControl>

          {/* Post Type Specific Fields */}
          {formState.postType && (
            <Box>
              {FORM_FIELDS[formState.postType].map((field) => (
                <Box key={field.id} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ mr: 1 }}>
                      {field.label}
                    </Typography>
                    {field.tooltip && (
                      <Tooltip title={field.tooltip}>
                        <IconButton size="small" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                          <FaInfoCircle />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                  {field.type === 'select' ? (
                    <FormControl fullWidth error={!!formErrors[field.id]}>
                      <Select
                        value={formState[field.id] || ''}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        label={field.label}
                        sx={{
                          color: isDarkMode ? '#fff' : '#000',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                          },
                        }}
                      >
                        {field.options?.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {formErrors[field.id] && (
                        <Typography color="error" sx={{ mt: 1, fontSize: '0.75rem' }}>
                          {formErrors[field.id]}
                        </Typography>
                      )}
                    </FormControl>
                  ) : (
                    <TextField
                      fullWidth
                      placeholder={field.placeholder}
                      value={formState[field.id] || ''}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      error={!!formErrors[field.id]}
                      multiline={field.type === 'multiline'}
                      rows={field.type === 'multiline' ? 4 : 1}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: isDarkMode ? '#fff' : '#000',
                          '& fieldset': {
                            borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                          },
                          '&:hover fieldset': {
                            borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                        },
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          )}

          {/* Generate Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <FeedbackButton
              variant="contained"
              disabled={isGenerating}
              isKeyAction={true}
              onClick={handleGenerate}
              startIcon={isGenerating ? <CircularProgress size={isMobile ? 16 : 20} color="inherit" /> : <FaMagic />}
              sx={{
                py: { xs: 1.5, sm: 2 },
                px: { xs: 3, sm: 4 },
                borderRadius: 3,
                background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                boxShadow: isDarkMode ? '0 4px 15px rgba(64,93,230,0.3)' : '0 4px 15px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                '&:hover': {
                  background: 'linear-gradient(45deg, #833AB4, #5851DB, #405DE6)',
                  transform: 'translateY(-2px)',
                  boxShadow: isDarkMode ? '0 6px 20px rgba(64,93,230,0.4)' : '0 6px 20px rgba(0,0,0,0.3)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                '&.Mui-disabled': {
                  background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  color: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                },
              }}
            >
              {isGenerating ? 'Generating...' : 'Generate Caption'}
            </FeedbackButton>
          </Box>

          {/* Generated Caption Preview */}
          {showPreview && (
            <Paper
              elevation={3}
              sx={{
                p: 3,
                mt: 4,
                background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: isDarkMode ? '#fff' : '#000' }}>
                Generated Caption
              </Typography>
              <Typography
                sx={{
                  mb: 2,
                  color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
                  fontStyle: 'italic',
                }}
              >
                {generatedCaption}
              </Typography>
              <FeedbackButton
                startIcon={<FaCopy />}
                onClick={handleCopyCaption}
                isKeyAction={false}
                sx={{
                  background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  color: isDarkMode ? '#fff' : '#000',
                  '&:hover': {
                    background: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                  },
                }}
              >
                Copy Caption
              </FeedbackButton>
            </Paper>
          )}
        </Paper>
      </Container>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setError('')}
          severity="error"
          sx={{
            width: '100%',
            backgroundColor: isDarkMode ? '#ff5252' : '#ffebee',
            color: isDarkMode ? '#fff' : '#c62828',
          }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* Footer */}
      <Box sx={{ 
        position: 'relative',
        zIndex: 1,
        mt: 'auto',
        background: isDarkMode 
          ? 'linear-gradient(to top, rgba(30, 30, 40, 0.9), transparent)'
          : 'linear-gradient(to top, rgba(245, 247, 250, 0.9), transparent)',
        paddingTop: 5
      }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default Generation;