import { useState, useEffect } from 'react';
// MUI Components
import { 
  Container, Typography, Box, IconButton, 
  Paper, Switch, useMediaQuery, CircularProgress,
  Snackbar, Alert, Button, TextField, MenuItem, FormControl,
  InputLabel, Select, Grid, Dialog,
  DialogTitle, DialogContent, DialogActions, FormControlLabel, Slider
} from "@mui/material";
// Icons
import { MdArrowBack, MdRefresh } from 'react-icons/md';
import { BsSunFill, BsMoonFill } from 'react-icons/bs';
import { FaMagic, FaInfoCircle, FaCopy, FaTimes, FaHashtag, FaCheck } from 'react-icons/fa';
import { BsEmojiSmile } from 'react-icons/bs';
// Other imports
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme as useCustomTheme } from '../../context/ThemeContext';
import Footer from '../../components/Footer/Footer';
import Tooltip from '@mui/material/Tooltip'; // Explicit import for Tooltip
import Chip from '@mui/material/Chip'; // Explicit import for Chip
import { generateCaptions } from '../../services/api'; // Import the generateCaptions function

// ===== TYPES =====
type PostType = 'promotional' | 'engagement' | 'testimonial' | 'event' | 'product-launch' | 'custom';
type BusinessType = 'restaurant' | 'computer-shop' | 'clothing' | 'coffee-shop' | 'custom';

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
  customBusinessType?: string;
  numberOfGenerations: number;
  includeHashtags: boolean;
  includeEmojis: boolean;
  image?: File | null;
  [key: string]: any;
}

interface FormErrors {
  [key: string]: string;
}

interface GeneratedCaption {
  text: string;
  // Add any other necessary properties here
}

// ===== CONSTANTS =====
const TRANSITION_TIMING = '0.3s ease';
const TRANSITION_PROPERTIES = 'background-color, color, border-color, box-shadow, transform, opacity';

const POST_TYPES = [
  { value: 'promotional', label: 'Promotional Post' },
  { value: 'engagement', label: 'Engagement Post' },
  { value: 'testimonial', label: 'Testimonial Post' },
  { value: 'event', label: 'Event Post' },
  { value: 'product-launch', label: 'Product Launch Post' },
  { value: 'custom', label: 'Custom Post' }
];

const BUSINESS_TYPES = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'computer-shop', label: 'Computer Shop' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'coffee-shop', label: 'Coffee Shop' },
  { value: 'custom', label: 'Custom Business' }
];

const FORM_FIELDS: { [key in PostType]: FormField[] } = {
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
  ],
  custom: [
    {
      id: 'tone',
      label: 'Select Tone',
      type: 'select',
      options: [
        { value: 'funny', label: 'Funny' },
        { value: 'sarcastic', label: 'Sarcastic' },
        { value: 'professional', label: 'Professional' },
        { value: 'inspirational', label: 'Inspirational' },
        { value: 'romantic', label: 'Romantic' }
      ],
      tooltip: 'Choose a tone for your caption',
      multiline: false
    },
    {
      id: 'topic',
      label: 'Select Topic',
      type: 'select',
      options: [
        { value: 'fitness', label: 'Fitness' },
        { value: 'travel', label: 'Travel' },
        { value: 'business', label: 'Business' },
        { value: 'love', label: 'Love' },
        { value: 'gaming', label: 'Gaming' }
      ],
      tooltip: 'Choose the main topic for your caption'
    },
    {
      id: 'audience',
      label: 'Target Audience',
      type: 'select',
      options: [
        { value: 'general', label: 'General' },
        { value: 'millennials', label: 'Millennials' },
        { value: 'genz', label: 'Gen Z' },
        { value: 'professionals', label: 'Professionals' }
      ],
      tooltip: 'Select your target audience'
    },
    {
      id: 'style',
      label: 'Select Writing Style',
      type: 'select',
      options: [
        { value: 'casual', label: 'Casual' },
        { value: 'poetic', label: 'Poetic' },
        { value: 'witty', label: 'Witty' },
        { value: 'storytelling', label: 'Storytelling' },
        { value: 'corporate', label: 'Corporate' }
      ],
      tooltip: 'Choose a writing style',
      multiline: false
    },
    {
      id: 'cta',
      label: 'Select Call to Action',
      type: 'select',
      options: [
        { value: 'shop-now', label: 'Shop Now' },
        { value: 'tag-friend', label: 'Tag a Friend' },
        { value: 'comment-below', label: 'Comment Below' },
        { value: 'swipe-up', label: 'Swipe Up' }
      ],
      tooltip: 'Choose a call to action',
      multiline: false
    },
    {
      id: 'photoDescription',
      label: 'Describe the Photo',
      placeholder: 'e.g., A sunset over a calm beach',
      tooltip: 'Describe the photo that will accompany your caption',
      multiline: true,
      type: 'multiline'
    }
  ]
};

/**
 * Main Generation component for creating social media captions
 */
const Generation = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useCustomTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [formState, setFormState] = useState<FormState>({
    postType: '',
    businessType: '',
    numberOfGenerations: 1,
    includeHashtags: false,
    includeEmojis: false,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [generatedCaptions, setGeneratedCaptions] = useState<GeneratedCaption[]>([]);
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [showPreview] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [canRegenerate, setCanRegenerate] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Reusable menu props for consistent dropdown styling
  const darkModeMenuProps = {
    PaperProps: {
      sx: {
        bgcolor: isDarkMode ? '#1e1e2d' : 'background.paper',
        color: isDarkMode ? '#fff' : 'inherit',
        '& .MuiMenuItem-root': {
          color: isDarkMode ? '#fff !important' : 'inherit',
          '&:hover': {
            backgroundColor: isDarkMode ? 'rgba(64,93,230,0.15)' : 'rgba(0,0,0,0.04)'
          }
        }
      }
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.transition = `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`;
    document.body.style.backgroundColor = isDarkMode ? '#121212' : '#ffffff';
    document.body.style.color = isDarkMode ? '#ffffff' : '#121212';
    
    // Add global styles for form inputs in dark mode
    const style = document.createElement('style');
    if (isDarkMode) {
      style.innerHTML = `
        /* Text colors */
        .MuiInputBase-input, 
        .MuiMenuItem-root,
        .MuiTypography-root,
        .MuiFormControlLabel-label,
        .MuiListItemText-primary {
          color: white !important;
        }
        
        /* Secondary text colors */
        .MuiFormLabel-root,
        .MuiFormHelperText-root,
        .MuiSelect-icon,
        .MuiListItemText-secondary {
          color: rgba(255,255,255,0.7) !important;
        }
        
        /* Accent colors */
        .MuiFormLabel-root.Mui-focused {
          color: #405DE6 !important;
        }
        
        /* Dropdown/Menu backgrounds */
        .MuiMenu-paper,
        .MuiPopover-paper,
        .MuiMenu-list {
          background-color: #1e1e2d !important;
          color: white !important;
          border-radius: 8px !important;
        }
        
        /* Menu item hover state */
        .MuiMenuItem-root:hover {
          background-color: rgba(64,93,230,0.15) !important;
        }
        
        /* Table styles */
        .MuiTableCell-head {
          color: white !important;
        }
        .MuiTableCell-body {
          color: rgba(255,255,255,0.8) !important;
        }
      `;
    } else {
      style.innerHTML = '';
    }
    style.id = 'dark-mode-styles';
    
    const existingStyle = document.getElementById('dark-mode-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    document.head.appendChild(style);
    
    return () => {
      if (document.getElementById('dark-mode-styles')) {
        document.getElementById('dark-mode-styles')?.remove();
      }
    };
  }, [isDarkMode]);

  const validateField = (field: string, value: any): string => {
    if (field === 'numberOfGenerations') {
      if (value < 1 || value > 5) return 'Number of generations must be between 1 and 5';
      return '';
    }
    
    if (field === 'businessType' && value === 'custom' && !formState.customBusinessType) {
      return 'Please enter your custom business type';
    }

    if (!value && field !== 'includeHashtags' && field !== 'includeEmojis') {
      return 'This field is required';
    }
    
    return '';
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    // Validate required fields
    if (!formState.postType) errors.postType = 'Please select a post type';
    if (!formState.businessType) errors.businessType = 'Please select a business type';
    if (formState.businessType === 'custom' && !formState.customBusinessType) {
      errors.customBusinessType = 'Please enter your custom business type';
    }

    // Validate form fields based on post type
    if (formState.postType && FORM_FIELDS[formState.postType]) {
      FORM_FIELDS[formState.postType].forEach(field => {
        if (field.required && !formState[field.id]) {
          errors[field.id] = `${field.label} is required`;
        }
      });
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePostTypeChange = (type: PostType) => {
    setFormState(prev => ({ 
      ...prev, 
      postType: type,
      // Clear other post type related fields when changing post type
      ...Object.fromEntries(
        Object.keys(prev)
          .filter(key => key !== 'postType' && key !== 'businessType' && key !== 'customBusinessType' && key !== 'numberOfGenerations' && key !== 'includeHashtags' && key !== 'includeEmojis' && key !== 'image')
          .map(key => [key, ''])
      )
    }));
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormState(prev => ({ 
      ...prev, 
      [field]: value,
      // Clear other fields when changing business type
      ...(field === 'businessType' ? {
        customBusinessType: '',
        ...Object.fromEntries(
          Object.keys(prev)
            .filter(key => key !== 'postType' && key !== 'businessType' && key !== 'customBusinessType' && key !== 'numberOfGenerations' && key !== 'includeHashtags' && key !== 'includeEmojis' && key !== 'image')
            .map(key => [key, ''])
        )
      } : {})
    }));
    setFormErrors(prev => ({ ...prev, [field]: validateField(field, value) }));
  };

  const handleGenerate = async () => {
    if (!validateForm()) {
      setError('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedCaptions([]);

    try {
      const captions = await generateCaptions(formState);
      if (captions.length > 0) {
        setGeneratedCaptions(captions);
        setGeneratedCaption(captions[0].text);
        setShowResultDialog(true);
        setCanRegenerate(true);
      } else {
        setError('No captions were generated. Please try again.');
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('API key is missing')) {
          setError('API key is missing. Please check your environment configuration.');
        } else if (err.message.includes('API authentication failed')) {
          setError('Invalid API key. Please check your API key configuration.');
        } else if (err.message.includes('Network error')) {
          setError('Network error. Please check your internet connection.');
        } else if (err.message.includes('rate limit')) {
          setError('API rate limit exceeded. Please try again in a few minutes.');
        } else {
          setError(`Failed to generate caption: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    if (!canRegenerate) return;
    setIsRegenerating(true);
    await handleGenerate();
    setIsRegenerating(false);
  };

  const handleCopyCaption = () => {
    if (generatedCaption) {
      navigator.clipboard.writeText(generatedCaption);
      setCopiedToClipboard(true);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedToClipboard(false);
      }, 2000);
    }
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

      <Container maxWidth="lg" sx={{ mb: 5, pt: 2 }}>
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

          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 3 },
              background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              boxShadow: isDarkMode 
                ? '0 10px 30px rgba(0, 0, 0, 0.2)' 
                : '0 10px 30px rgba(0, 0, 0, 0.05)',
              transition: `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`,
            }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: isDarkMode ? '#fff' : '#000',
                  textAlign: 'center',
                  fontWeight: 600
                }}
              >
                Choose Your Post Type
              </Typography>
              <Grid container spacing={2}>
                {POST_TYPES.map((type) => (
                  <Grid 
                    item 
                    xs={6}
                    sm={formState.postType ? 6 : 4} 
                    md={formState.postType ? 6 : 4} 
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
                          MenuProps={darkModeMenuProps}
                          sx={{
                            py: 1.5,
                            px: 2,
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
                                py: 1.5,
                                px: 2,
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
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => handlePostTypeChange(type.value as PostType)}
                        sx={{ 
                          py: 1.5,
                          px: 1,
                          height: '100%',
                          minHeight: '56px',
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
                          variant="subtitle2"
                          sx={{ 
                            fontWeight: 600,
                            fontSize: { xs: '0.8rem', sm: '0.9rem' }
                          }}
                        >
                          {type.label}
                        </Typography>
                      </Button>
                    )}
                  </Grid>
                ))}
                
                {/* Business Type right next to Post Type when selected */}
                {formState.postType && (
                  <Grid item xs={6} sm={6} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Business Type</InputLabel>
                      <Select
                        value={formState.businessType}
                        onChange={(e) => handleChange('businessType', e.target.value)}
                        label="Business Type"
                        error={!!formErrors.businessType}
                        MenuProps={darkModeMenuProps}
                        sx={{
                          height: '56px',
                          color: isDarkMode ? '#fff' : '#000',
                          borderRadius: 2,
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
                        <Typography color="error" sx={{ mt: 0.5, fontSize: '0.75rem' }}>
                          {formErrors.businessType}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                )}
              </Grid>

              {/* Custom Business Type Input Field */}
              {formState.businessType === 'custom' && (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Custom Business Type"
                    placeholder="Enter your business type"
                    value={formState.customBusinessType || ''}
                    onChange={(e) => handleChange('customBusinessType', e.target.value)}
                    size="small"
                    error={!!formErrors.customBusinessType}
                    helperText={formErrors.customBusinessType}
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
                </Box>
              )}
            </Box>

            {/* Remove the separate Business Type Section since it's now integrated above */}
            {!formState.postType && (
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Business Type</InputLabel>
                    <Select
                      value={formState.businessType}
                      onChange={(e) => handleChange('businessType', e.target.value)}
                      label="Business Type"
                      error={!!formErrors.businessType}
                      MenuProps={darkModeMenuProps}
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
                      <Typography color="error" sx={{ mt: 0.5, fontSize: '0.75rem' }}>
                        {formErrors.businessType}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                
                {formState.businessType === 'custom' && (
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Custom Business Type"
                      placeholder="Enter your business type"
                      value={formState.customBusinessType || ''}
                      onChange={(e) => handleChange('customBusinessType', e.target.value)}
                      size="small"
                      error={!!formErrors.customBusinessType}
                      helperText={formErrors.customBusinessType}
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
                  </Grid>
                )}
              </Grid>
            )}

            {formState.postType && (
              <Box>
                {/* Form Fields Section - Rendered in a 2x2 grid */}
                <Grid container spacing={3}>
                  {FORM_FIELDS[formState.postType].map((field) => (
                    <Grid item xs={12} md={6} key={field.id}>
                      <Box sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ mr: 1, fontWeight: 500, color: isDarkMode ? '#fff' : '#000' }}>
                            {field.label}
                          </Typography>
                          {field.tooltip && (
                            <Tooltip title={field.tooltip}>
                              <IconButton size="small" sx={{ 
                                color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                                padding: 0.2,
                                '&:hover': {
                                  background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                }
                              }}>
                                <FaInfoCircle size={14} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                        {field.type === 'select' ? (
                          <FormControl fullWidth error={!!formErrors[field.id]} size="small">
                            <Select
                              value={formState[field.id] || ''}
                              onChange={(e) => handleChange(field.id, e.target.value)}
                              MenuProps={darkModeMenuProps}
                              renderValue={(selected) => {
                                const option = field.options?.find(opt => opt.value === selected);
                                return option ? option.label : '';
                              }}
                              sx={{
                                color: isDarkMode ? '#fff' : '#000',
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                                },
                                '& .MuiSelect-select': {
                                  padding: '8px 14px',
                                }
                              }}
                            >
                              {field.options?.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                            {formErrors[field.id] && (
                              <Typography color="error" sx={{ mt: 0.5, fontSize: '0.75rem' }}>
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
                            helperText={formErrors[field.id]}
                            multiline={field.type === 'multiline'}
                            rows={field.type === 'multiline' ? 3 : 1}
                            size="small"
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
                    </Grid>
                  ))}
                </Grid>

                {/* Generation Options */}
                <Paper 
                  elevation={0}
                  sx={{ 
                    mt: 4, 
                    mb: 3, 
                    p: 3, 
                    borderRadius: 2,
                    background: isDarkMode 
                      ? 'rgba(255,255,255,0.03)' 
                      : 'rgba(0,0,0,0.02)',
                    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 3, color: isDarkMode ? '#fff' : '#000', fontWeight: 600 }}>
                    Generation Options
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ width: '100%', mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ mb: 1.5, color: isDarkMode ? '#fff' : '#000', fontWeight: 500 }}>
                          Number of Generations
                        </Typography>
                        <Box sx={{ 
                          px: 2, 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center' 
                        }}>
                          <Slider
                            value={formState.numberOfGenerations}
                            onChange={(_, value) => handleChange('numberOfGenerations', value as number)}
                            step={1}
                            marks={[
                              { value: 1, label: '1' },
                              { value: 2, label: '2' },
                              { value: 3, label: '3' },
                              { value: 4, label: '4' },
                              { value: 5, label: '5' },
                            ]}
                            min={1}
                            max={5}
                            sx={{
                              width: '100%',
                              maxWidth: '280px',
                              '& .MuiSlider-rail': {
                                height: 4,
                                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                opacity: 0.8,
                              },
                              '& .MuiSlider-track': {
                                height: 4,
                                backgroundColor: isDarkMode ? 'rgba(64,93,230,0.8)' : 'rgba(64,93,230,0.6)',
                                border: 'none',
                              },
                              '& .MuiSlider-thumb': {
                                width: 28,
                                height: 28,
                                backgroundColor: isDarkMode ? '#fff' : '#fff',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                '&::before': {
                                  boxShadow: '0 0 1px 8px rgba(64,93,230,0.1)',
                                },
                                '&:hover, &.Mui-focusVisible': {
                                  boxShadow: '0 0 0 8px rgba(64,93,230,0.16)',
                                },
                                '&::after': {
                                  content: '""',
                                  position: 'absolute',
                                  width: 20,
                                  height: 20,
                                  borderRadius: '50%',
                                  backgroundColor: '#405DE6',
                                },
                              },
                              '& .MuiSlider-mark': {
                                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                                height: 4,
                                width: 4,
                                borderRadius: '50%',
                              },
                              '& .MuiSlider-markActive': {
                                backgroundColor: isDarkMode ? '#fff' : '#405DE6',
                              },
                              '& .MuiSlider-markLabel': {
                                fontSize: '0.9rem',
                                color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                                marginTop: 1,
                              },
                              '& .MuiSlider-valueLabel': {
                                background: isDarkMode ? 'rgba(64,93,230,0.8)' : 'rgba(64,93,230,0.7)',
                                borderRadius: '6px',
                                padding: '2px 6px',
                                fontSize: '0.85rem',
                                fontWeight: 'bold',
                                '&:before': {
                                  display: 'none',
                                },
                              },
                            }}
                            valueLabelDisplay="auto"
                          />
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%', justifyContent: 'center' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formState.includeHashtags}
                              onChange={(e) => handleChange('includeHashtags', e.target.checked)}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: '#405DE6',
                                },
                              }}
                            />
                          }
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <FaHashtag />
                              <span>Include Hashtags</span>
                            </Box>
                          }
                          sx={{ color: isDarkMode ? '#fff' : '#000' }}
                        />

                        <FormControlLabel
                          control={
                            <Switch
                              checked={formState.includeEmojis}
                              onChange={(e) => handleChange('includeEmojis', e.target.checked)}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: '#405DE6',
                                },
                              }}
                            />
                          }
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <BsEmojiSmile />
                              <span>Include Emojis</span>
                            </Box>
                          }
                          sx={{ color: isDarkMode ? '#fff' : '#000' }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                variant="contained"
                disabled={isGenerating}
                onClick={handleGenerate}
                startIcon={isGenerating ? <CircularProgress size={isMobile ? 16 : 20} color="inherit" /> : <FaMagic />}
                sx={{
                  py: { xs: 1.5, sm: 2 },
                  px: { xs: 4, sm: 5 },
                  borderRadius: 3,
                  background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                  boxShadow: isDarkMode ? '0 4px 15px rgba(64,93,230,0.3)' : '0 4px 15px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  fontWeight: 'bold',
                  letterSpacing: '0.5px',
                  textTransform: 'none',
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
              </Button>
            </Box>

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
                <Button
                  startIcon={<FaCopy />}
                  onClick={handleCopyCaption}
                  sx={{
                    background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    color: isDarkMode ? '#fff' : '#000',
                    '&:hover': {
                      background: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  Copy Caption
                </Button>
              </Paper>
            )}
          </Paper>
        </Container>

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

        <Dialog
          open={showResultDialog}
          onClose={() => setShowResultDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: isDarkMode 
                ? 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
              borderRadius: '16px',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
              maxWidth: '600px',
              margin: '20px',
              overflow: 'hidden',
            }
          }}
        >
          <DialogTitle 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              pb: 2,
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(64,93,230,0.2), rgba(88,81,219,0.2))' 
                : 'linear-gradient(135deg, rgba(64,93,230,0.1), rgba(88,81,219,0.1))',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FaMagic size={20} color={isDarkMode ? '#fff' : '#000'} />
              <Typography variant="h5" sx={{ 
                fontWeight: 600,
                color: isDarkMode ? '#fff' : '#000',
              }}>
                Generated Caption
              </Typography>
            </Box>
            <IconButton
              onClick={() => setShowResultDialog(false)}
              sx={{
                color: isDarkMode ? '#fff' : '#000',
                '&:hover': {
                  background: isDarkMode 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(0, 0, 0, 0.1)',
                }
              }}
            >
              <FaTimes />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                background: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.02)',
                borderRadius: '12px',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              }}
            >
              <Box
                sx={{
                  maxHeight: '60vh',
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                    borderRadius: '4px',
                    '&:hover': {
                      background: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                    },
                  },
                }}
              >
                {generatedCaptions.map((caption, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        mb: 3,
                        background: isDarkMode 
                          ? 'rgba(255, 255, 255, 0.03)'
                          : 'rgba(0, 0, 0, 0.02)',
                        borderRadius: '12px',
                        border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
                          Caption {index + 1}
                        </Typography>
                        <IconButton
                          onClick={() => {
                            navigator.clipboard.writeText(caption.text);
                            setCopiedToClipboard(true);
                            setTimeout(() => setCopiedToClipboard(false), 2000);
                          }}
                          size="small"
                          sx={{
                            color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                            '&:hover': {
                              color: isDarkMode ? '#fff' : '#000',
                            },
                          }}
                        >
                          <FaCopy />
                        </IconButton>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          whiteSpace: 'pre-wrap',
                          lineHeight: 1.8,
                          color: isDarkMode ? '#fff' : '#000',
                          fontFamily: '"Inter", sans-serif',
                          fontSize: '1.1rem',
                        }}
                      >
                        {caption.text.split('\n\n').map((part, partIndex) => {
                          const isHashtags = part.startsWith('#');
                          return isHashtags ? null : (
                            <span key={partIndex}>
                              {part}
                              {partIndex < caption.text.split('\n\n').length - 1 && <><br /><br /></>}
                            </span>
                          );
                        })}
                      </Typography>
                      {caption.text.includes('#') && (
                        <Box sx={{ 
                          mt: 2,
                          pt: 2,
                          borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                        }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                              fontFamily: '"Inter", sans-serif',
                              fontSize: '0.95rem',
                              lineHeight: 1.8,
                            }}
                          >
                            {caption.text.split('\n\n').map((part, partIndex) => {
                              if (part.startsWith('#')) {
                                return part.split(' ').map((tag, i) => (
                                  <Chip
                                    key={`${partIndex}-${i}`}
                                    label={tag}
                                    size="small"
                                    sx={{
                                      m: 0.5,
                                      background: isDarkMode 
                                        ? 'rgba(64,93,230,0.2)' 
                                        : 'rgba(64,93,230,0.1)',
                                      color: isDarkMode ? '#fff' : '#000',
                                      '&:hover': {
                                        background: isDarkMode 
                                          ? 'rgba(64,93,230,0.3)' 
                                          : 'rgba(64,93,230,0.2)',
                                        cursor: 'pointer'
                                      },
                                    }}
                                  />
                                ));
                              }
                              return null;
                            })}
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </motion.div>
                ))}
              </Box>
            </Paper>
          </DialogContent>

          <DialogActions 
            sx={{ 
              p: 3, 
              pt: 2,
              borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              display: 'flex',
              justifyContent: 'space-between',
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(64,93,230,0.1), rgba(88,81,219,0.1))' 
                : 'linear-gradient(135deg, rgba(64,93,230,0.05), rgba(88,81,219,0.05))',
            }}
          >
            <Box>
              {canRegenerate && (
                <Button
                  onClick={handleRegenerate}
                  variant="outlined"
                  startIcon={isRegenerating ? <CircularProgress size={20} /> : <MdRefresh />}
                  disabled={isRegenerating}
                  sx={{
                    mr: 1,
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                    color: isDarkMode ? '#fff' : '#000',
                    '&:hover': {
                      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                      background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                    },
                    '&.Mui-disabled': {
                      color: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  {isRegenerating ? 'Regenerating...' : 'Regenerate'}
                </Button>
              )}
            </Box>
            <Box>
              <Button
                onClick={handleCopyCaption}
                variant="contained"
                startIcon={copiedToClipboard ? <FaCheck /> : <FaCopy />}
                sx={{
                  mr: 1,
                  background: copiedToClipboard
                    ? 'linear-gradient(45deg, #00c853, #00e676)'
                    : 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                  color: 'white',
                  transition: 'background 0.3s ease',
                  '&:hover': {
                    background: copiedToClipboard
                      ? 'linear-gradient(45deg, #00e676, #00c853)'
                      : 'linear-gradient(45deg, #833AB4, #5851DB, #405DE6)',
                  },
                }}
              >
                {copiedToClipboard ? 'Copied!' : 'Copy Caption'}
              </Button>
              <Button
                onClick={() => setShowResultDialog(false)}
                variant="outlined"
                sx={{
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                  color: isDarkMode ? '#fff' : '#000',
                  '&:hover': {
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                    background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                  },
                }}
              >
                Close
              </Button>
            </Box>
          </DialogActions>
        </Dialog>

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