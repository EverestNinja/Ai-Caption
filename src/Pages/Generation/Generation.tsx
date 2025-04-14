import { useState, useEffect } from 'react';
// MUI Components
import { 
  Container, Typography, Box, IconButton, 
  Paper, Switch, useMediaQuery, CircularProgress,
  Snackbar, Alert, Button, TextField, MenuItem, FormControl, Select, Grid, Dialog,
  DialogTitle, DialogContent, DialogActions, FormControlLabel, Slider
} from "@mui/material";
// Icons
import { MdArrowBack, MdRefresh } from 'react-icons/md';
import { BsSunFill, BsMoonFill } from 'react-icons/bs';
import { FaMagic, FaInfoCircle, FaCopy, FaTimes, FaHashtag, FaCheck, FaUpload, FaImage, FaTimesCircle } from 'react-icons/fa';
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
  rows?: number;
  dependsOn?: { field: string; value: string; };
}

interface FormState {
  postType: PostType | '';
  businessType: BusinessType | '';
  customBusinessType?: string;
  numberOfGenerations: number;
  includeHashtags: boolean;
  includeEmojis: boolean;
  image?: File | null;
  imagePreview?: string | null;
  captionLength: number; // Added new field
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
        { value: 'Check It Out', label: 'Check It Out' },
        { value: 'custom', label: 'Custom CTA' }
      ],
      tooltip: "Choose a call-to-action for your post"
    },
    {
      id: 'customCta',
      label: 'Enter Custom CTA',
      placeholder: 'e.g., Limited Time Offer, Act Fast',
      tooltip: 'Enter your custom call to action',
      required: false,
      dependsOn: { field: 'cta', value: 'custom' }
    },
    {
      id: 'tone',
      label: "How Should It Sound?",
      type: 'select',
      options: [
        { value: 'exciting', label: 'Exciting' },
        { value: 'urgent', label: 'Urgent' },
        { value: 'friendly', label: 'Friendly' },
        { value: 'custom', label: 'Custom Tone' }
      ],
      tooltip: "Select the tone for your promotional message"
    },
    {
      id: 'customTone',
      label: 'Enter Custom Tone',
      placeholder: 'e.g., Mysterious, Energetic, Bold',
      tooltip: 'Describe your custom tone',
      required: false,
      dependsOn: { field: 'tone', value: 'custom' }
    },
    { 
      id: 'description', 
      label: "Describe Your Post", 
      placeholder: "e.g., Promoting our new summer collection with a special discount",
      tooltip: "Describe your post in at least 3 words",
      required: true,
      multiline: true,
      rows: 3
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
        { value: 'shares', label: 'Get Shares' },
        { value: 'custom', label: 'Custom Goal' }
      ]
    },
    {
      id: 'customGoal',
      label: 'Enter Custom Goal',
      placeholder: 'e.g., Gather Testimonials, Build Community',
      tooltip: 'Describe your custom engagement goal',
      required: false,
      dependsOn: { field: 'goal', value: 'custom' }
    },
    {
      id: 'tone',
      label: "How Should It Feel?",
      type: 'select',
      options: [
        { value: 'casual', label: 'Casual' },
        { value: 'fun', label: 'Fun' },
        { value: 'curious', label: 'Curious' },
        { value: 'custom', label: 'Custom Tone' }
      ]
    },
    {
      id: 'customTone',
      label: 'Enter Custom Tone',
      placeholder: 'e.g., Thoughtful, Provocative, Intriguing',
      tooltip: 'Describe your custom tone',
      required: false,
      dependsOn: { field: 'tone', value: 'custom' }
    },
    { 
      id: 'description', 
      label: "Describe Your Post", 
      placeholder: "e.g., Asking customers about their favorite menu items",
      tooltip: "Describe your post in at least 3 words",
      required: true,
      multiline: true,
      rows: 3
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
        { value: 'real', label: 'Real' },
        { value: 'custom', label: 'Custom Tone' }
      ]
    },
    {
      id: 'customTone',
      label: 'Enter Custom Tone',
      placeholder: 'e.g., Emotional, Inspirational, Genuine',
      tooltip: 'Describe your custom tone',
      required: false,
      dependsOn: { field: 'tone', value: 'custom' }
    },
    { 
      id: 'description', 
      label: "Describe Your Post", 
      placeholder: "e.g., Sharing a customer's positive experience with our service",
      tooltip: "Describe your post in at least 3 words",
      required: true,
      multiline: true,
      rows: 3
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
        { value: 'Don\'t Miss Out', label: 'Don\'t Miss Out' },
        { value: 'custom', label: 'Custom CTA' }
      ]
    },
    {
      id: 'customCta',
      label: 'Enter Custom CTA',
      placeholder: 'e.g., Secure Your Spot, Register Today',
      tooltip: 'Enter your custom call to action',
      required: false,
      dependsOn: { field: 'cta', value: 'custom' }
    },
    {
      id: 'tone',
      label: "How Should It Sound?",
      type: 'select',
      options: [
        { value: 'exciting', label: 'Exciting' },
        { value: 'welcoming', label: 'Welcoming' },
        { value: 'urgent', label: 'Urgent' },
        { value: 'custom', label: 'Custom Tone' }
      ]
    },
    {
      id: 'customTone',
      label: 'Enter Custom Tone',
      placeholder: 'e.g., Exclusive, Celebratory, Prestigious',
      tooltip: 'Describe your custom tone',
      required: false,
      dependsOn: { field: 'tone', value: 'custom' }
    },
    { 
      id: 'description', 
      label: "Describe Your Post", 
      placeholder: "e.g., Announcing our annual summer sale event",
      tooltip: "Describe your post in at least 3 words",
      required: true,
      multiline: true,
      rows: 3
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
        { value: 'Learn More', label: 'Learn More' },
        { value: 'custom', label: 'Custom CTA' }
      ]
    },
    {
      id: 'customCta',
      label: 'Enter Custom CTA',
      placeholder: 'e.g., Pre-Order Today, Be The First',
      tooltip: 'Enter your custom call to action',
      required: false,
      dependsOn: { field: 'cta', value: 'custom' }
    },
    {
      id: 'tone',
      label: "How Should It Sound?",
      type: 'select',
      options: [
        { value: 'exciting', label: 'Exciting' },
        { value: 'bold', label: 'Bold' },
        { value: 'friendly', label: 'Friendly' },
        { value: 'custom', label: 'Custom Tone' }
      ]
    },
    {
      id: 'customTone',
      label: 'Enter Custom Tone',
      placeholder: 'e.g., Innovative, Futuristic, Revolutionary',
      tooltip: 'Describe your custom tone',
      required: false,
      dependsOn: { field: 'tone', value: 'custom' }
    },
    { 
      id: 'description', 
      label: "Describe Your Post", 
      placeholder: "e.g., Introducing our new eco-friendly product line",
      tooltip: "Describe your post in at least 3 words",
      required: true,
      multiline: true,
      rows: 3
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
        { value: 'romantic', label: 'Romantic' },
        { value: 'custom', label: 'Custom Tone' }
      ],
      tooltip: 'Choose a tone for your caption',
      multiline: false
    },
    {
      id: 'customTone',
      label: 'Enter Custom Tone',
      placeholder: 'e.g., Mysterious, Energetic, Bold',
      tooltip: 'Describe your custom tone',
      required: false,
      dependsOn: { field: 'tone', value: 'custom' }
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
        { value: 'gaming', label: 'Gaming' },
        { value: 'custom', label: 'Custom Topic' }
      ],
      tooltip: 'Choose the main topic for your caption'
    },
    {
      id: 'customTopic',
      label: 'Enter Custom Topic',
      placeholder: 'e.g., Sustainability, Education, Photography',
      tooltip: 'Describe your custom topic',
      required: false,
      dependsOn: { field: 'topic', value: 'custom' }
    },
    {
      id: 'audience',
      label: 'Target Audience',
      type: 'select',
      options: [
        { value: 'general', label: 'General' },
        { value: 'millennials', label: 'Millennials' },
        { value: 'genz', label: 'Gen Z' },
        { value: 'professionals', label: 'Professionals' },
        { value: 'custom', label: 'Custom Audience' }
      ],
      tooltip: 'Select your target audience'
    },
    {
      id: 'customAudience',
      label: 'Enter Custom Audience',
      placeholder: 'e.g., Parents, Dog Owners, Tech Enthusiasts',
      tooltip: 'Describe your custom audience',
      required: false,
      dependsOn: { field: 'audience', value: 'custom' }
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
        { value: 'corporate', label: 'Corporate' },
        { value: 'custom', label: 'Custom Style' }
      ],
      tooltip: 'Choose a writing style',
      multiline: false
    },
    {
      id: 'customStyle',
      label: 'Enter Custom Style',
      placeholder: 'e.g., Minimalist, Technical, Philosophical',
      tooltip: 'Describe your custom writing style',
      required: false,
      dependsOn: { field: 'style', value: 'custom' }
    },
    {
      id: 'cta',
      label: 'Select Call to Action',
      type: 'select',
      options: [
        { value: 'shop-now', label: 'Shop Now' },
        { value: 'tag-friend', label: 'Tag a Friend' },
        { value: 'comment-below', label: 'Comment Below' },
        { value: 'swipe-up', label: 'Swipe Up' },
        { value: 'custom', label: 'Custom CTA' }
      ],
      tooltip: 'Choose a call to action',
      multiline: false
    },
    {
      id: 'customCta',
      label: 'Enter Custom CTA',
      placeholder: 'e.g., Join our community, Try for free',
      tooltip: 'Enter your custom call to action',
      required: false,
      dependsOn: { field: 'cta', value: 'custom' }
    },
    { 
      id: 'description', 
      label: "Describe Your Post", 
      placeholder: "e.g., Creating a fun and engaging post for our followers",
      tooltip: "Describe your post in at least 3 words",
      required: true,
      multiline: true,
      rows: 3
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
    image: null,
    imagePreview: null,
    captionLength: 2, // Default to medium length
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

  // Update validateField function for better custom field validation
  const validateField = (field: string, value: any): string => {
    if (field === 'numberOfGenerations') {
      if (value < 1 || value > 5) return 'Number of generations must be between 1 and 5';
      return '';
    }
    
    if (field === 'businessType' && value === 'custom' && !formState.customBusinessType) {
      return 'Please enter your custom business type';
    }

    if (field === 'description' && value) {
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount < 3) return 'Description must be at least 3 words long';
    }

    // Custom fields validations using a mapping approach
    if (field === 'tone' && value === 'custom' && !formState.customTone) {
      return 'Please enter your custom tone';
    }
    
    if (field === 'topic' && value === 'custom' && !formState.customTopic) {
      return 'Please enter your custom topic';
    }
    
    if (field === 'audience' && value === 'custom' && !formState.customAudience) {
      return 'Please enter your custom audience';
    }
    
    if (field === 'style' && value === 'custom' && !formState.customStyle) {
      return 'Please enter your custom writing style';
    }
    
    if (field === 'cta' && value === 'custom' && !formState.customCta) {
      return 'Please enter your custom call to action';
    }
    
    if (field === 'goal' && value === 'custom' && !formState.customGoal) {
      return 'Please enter your custom goal';
    }

    // General required field validation
    if (!value && field !== 'includeHashtags' && field !== 'includeEmojis' && 
        !field.startsWith('custom')) { // Don't validate custom fields unless needed
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
      // Pass the complete formState which includes image data
      const captions = await generateCaptions(formState);
      
      if (captions && captions.length > 0) {
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
        } else if (err.message.includes('image')) {
          setError(`Image error: ${err.message}`);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      
      // Check file size (limit to 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('Image file size should not exceed 5MB');
        return;
      }
      
      // Check file type
      if (!selectedFile.type.match('image.*')) {
        setError('Please select an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormState(prev => ({
          ...prev,
          image: selectedFile,
          imagePreview: e.target?.result as string
        }));
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeImage = () => {
    setFormState(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
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

      <Container maxWidth="lg" sx={{ 
        mb: 5, 
        pt: { xs: 1, sm: 2 },
        px: { xs: 2, sm: 3 } // Less horizontal padding on mobile
      }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: { xs: 1, sm: 4 }, // Less margin on mobile
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
              p: { xs: 1.5, sm: 3 }, // Less padding on mobile
              background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: { xs: '12px', sm: '16px' }, // Smaller border radius on mobile
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              boxShadow: isDarkMode 
                ? '0 10px 30px rgba(0, 0, 0, 0.2)' 
                : '0 10px 30px rgba(0, 0, 0, 0.05)',
              transition: `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`,
            }}
          >
            <Box sx={{ mb: { xs: 2, sm: 4 } }}> {/* Less margin on mobile */}
              <Typography
                variant="h6"
                sx={{
                  mb: { xs: 1, sm: 2 }, // Less margin on mobile
                  color: isDarkMode ? '#fff' : '#000',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' } // Smaller heading on mobile
                }}
              >
                Choose Your Post Type
              </Typography>
              <Grid container spacing={isMobile ? 1 : 2} alignItems="center">
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
                            height: '56px',
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
                          height: '56px',
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

                {/* Business Type Selection */}
                {formState.postType && (
                  <Grid item xs={6} sm={6} md={6}>
                    <FormControl fullWidth>
                      <Select
                        value={formState.businessType}
                        onChange={(e) => handleChange('businessType', e.target.value)}
                        displayEmpty
                        MenuProps={darkModeMenuProps}
                        sx={{
                          height: '56px',
                          borderRadius: 2,
                          background: isDarkMode 
                            ? 'rgba(255,255,255,0.05)'
                            : 'rgba(255,255,255,0.8)',
                          color: isDarkMode ? '#fff' : '#000',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                          },
                          '& .MuiSelect-select': {
                            py: 0,
                            display: 'flex',
                            alignItems: 'center',
                          },
                        }}
                        renderValue={(selected) => {
                          if (!selected) {
                            return <Typography sx={{ color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                              Business Type
                            </Typography>;
                          }
                          return BUSINESS_TYPES.find(type => type.value === selected)?.label || selected;
                        }}
                      >
                        {BUSINESS_TYPES.map((type) => (
                          <MenuItem 
                            key={type.value} 
                            value={type.value}
                            sx={{
                              py: 1.5,
                              px: 2,
                            }}
                          >
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

              {/* Custom Business Type Input */}
              {formState.businessType === 'custom' && (
                <Box sx={{ 
                  mt: 2, 
                  width: '100%',
                  px: 1
                }}>
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

            {formState.postType && (
            <Box>
                {/* Form Fields Section - Rendered in a 2x2 grid */}
                <Grid container spacing={isMobile ? 1.5 : 3}>
                  {FORM_FIELDS[formState.postType]
                    .filter(field => {
                      // Show field if it doesn't depend on another field, or if its dependency is satisfied
                      if (!field.dependsOn) return true;
                      return formState[field.dependsOn.field] === field.dependsOn.value;
                    })
                    .map((field) => (
                    <Grid item xs={12} md={field.id === 'description' ? 12 : 6} key={field.id}>
                      <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          mb: { xs: 0.5, sm: 1 }, 
                          flexWrap: 'wrap' // Allow wrapping on very small screens
                        }}>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              mr: 1, 
                              fontWeight: 500, 
                              color: isDarkMode ? '#fff' : '#000',
                              fontSize: { xs: '0.9rem', sm: '1rem' } // Smaller text on mobile
                            }}
                          >
                            {field.label}
                          </Typography>
                          {field.tooltip && (
                            <Tooltip title={field.tooltip}>
                              <IconButton 
                                size="small" 
                                sx={{ 
                                  color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                                  padding: { xs: 0.1, sm: 0.2 }, // Smaller padding on mobile
                                  '&:hover': {
                                    background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                  }
                                }}
                              >
                                <FaInfoCircle size={isMobile ? 12 : 14} />
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
                            multiline={field.multiline}
                            rows={field.rows || 1}
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
                    mt: { xs: 2, sm: 4 }, // Less margin on mobile
                    mb: { xs: 2, sm: 3 }, // Less margin on mobile
                    p: { xs: 2, sm: 3 }, // Less padding on mobile
                    borderRadius: 2,
                    background: isDarkMode 
                      ? 'rgba(255,255,255,0.03)' 
                      : 'rgba(0,0,0,0.02)',
                    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: { xs: 1.5, sm: 3 }, // Less margin on mobile
                      color: isDarkMode ? '#fff' : '#000', 
                      fontWeight: 600,
                      fontSize: { xs: '1rem', sm: '1.25rem' } // Smaller text on mobile
                    }}
                  >
                    Generation Options
                  </Typography>
                  
                  <Grid container spacing={isMobile ? 1.5 : 3}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ width: '100%', mb: 2 }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            mb: { xs: 1, sm: 1.5 }, 
                            color: isDarkMode ? '#fff' : '#000', 
                            fontWeight: 500,
                            fontSize: { xs: '0.9rem', sm: '1rem' }
                          }}
                        >
                          Number of Generations
                        </Typography>
                        <Box sx={{ 
                          px: { xs: 1, sm: 2 },
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
                              maxWidth: { xs: '100%', sm: '280px' },
                              '& .MuiSlider-rail': {
                                height: isMobile ? 3 : 4,
                                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                opacity: 0.8,
                              },
                              '& .MuiSlider-track': {
                                height: isMobile ? 3 : 4,
                                backgroundColor: isDarkMode ? 'rgba(64,93,230,0.8)' : 'rgba(64,93,230,0.6)',
                                border: 'none',
                              },
                              '& .MuiSlider-thumb': {
                                width: isMobile ? 22 : 28,
                                height: isMobile ? 22 : 28,
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
                                  width: isMobile ? 16 : 20,
                                  height: isMobile ? 16 : 20,
                                  borderRadius: '50%',
                                  backgroundColor: '#405DE6',
                                },
                              },
                              '& .MuiSlider-mark': {
                                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                                height: isMobile ? 3 : 4,
                                width: isMobile ? 3 : 4,
                                borderRadius: '50%',
                              },
                              '& .MuiSlider-markActive': {
                                backgroundColor: isDarkMode ? '#fff' : '#405DE6',
                              },
                              '& .MuiSlider-markLabel': {
                                fontSize: isMobile ? '0.8rem' : '0.9rem',
                                color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                                marginTop: 1,
                              },
                              '& .MuiSlider-valueLabel': {
                                background: isDarkMode ? 'rgba(64,93,230,0.8)' : 'rgba(64,93,230,0.7)',
                                borderRadius: '6px',
                                padding: '2px 6px',
                                fontSize: isMobile ? '0.75rem' : '0.85rem',
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

                      <Box sx={{ width: '100%', mb: 2 }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            mb: { xs: 1, sm: 1.5 }, 
                            color: isDarkMode ? '#fff' : '#000', 
                            fontWeight: 500,
                            fontSize: { xs: '0.9rem', sm: '1rem' }
                          }}
                        >
                          Caption Length
                        </Typography>
                        <Box sx={{ 
                          px: { xs: 1, sm: 2 },
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center' 
                        }}>
                          <Slider
                            value={formState.captionLength}
                            onChange={(_, value) => handleChange('captionLength', value as number)}
                            step={1}
                            marks={[
                              { value: 1, label: 'Short (≤30 words)' },
                              { value: 2, label: 'Medium (30-60)' },
                              { value: 3, label: 'Long (60-100)' },
                            ]}
                            min={1}
                            max={3}
                            sx={{
                              width: '100%',
                              maxWidth: { xs: '100%', sm: '280px' },
                              '& .MuiSlider-rail': {
                                height: isMobile ? 3 : 4,
                                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                opacity: 0.8,
                              },
                              '& .MuiSlider-track': {
                                height: isMobile ? 3 : 4,
                                backgroundColor: isDarkMode ? 'rgba(64,93,230,0.8)' : 'rgba(64,93,230,0.6)',
                                border: 'none',
                              },
                              '& .MuiSlider-thumb': {
                                width: isMobile ? 22 : 28,
                                height: isMobile ? 22 : 28,
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
                                  width: isMobile ? 16 : 20,
                                  height: isMobile ? 16 : 20,
                                  borderRadius: '50%',
                                  backgroundColor: '#405DE6',
                                },
                              },
                              '& .MuiSlider-mark': {
                                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                                height: isMobile ? 3 : 4,
                                width: isMobile ? 3 : 4,
                                borderRadius: '50%',
                              },
                              '& .MuiSlider-markActive': {
                                backgroundColor: isDarkMode ? '#fff' : '#405DE6',
                              },
                              '& .MuiSlider-markLabel': {
                                fontSize: isMobile ? '0.8rem' : '0.9rem',
                                color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                                marginTop: 1,
                              },
                              '& .MuiSlider-valueLabel': {
                                display: 'none',
                              },
                            }}
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
                              <FaHashtag size={isMobile ? 14 : 16} />
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontSize: { xs: '0.85rem', sm: '0.95rem' } 
                                }}
                              >
                                Include Hashtags
                              </Typography>
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
                              <BsEmojiSmile size={isMobile ? 14 : 16} />
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontSize: { xs: '0.85rem', sm: '0.95rem' } 
                                }}
                              >
                                Include Emojis
                              </Typography>
                            </Box>
                          }
                          sx={{ color: isDarkMode ? '#fff' : '#000' }}
                        />
                      </Box>
                    </Grid>

                    {/* Image Upload Section */}
                    <Grid item xs={12}>
                      <Box sx={{ 
                        mt: 2, 
                        p: { xs: 2, sm: 3 },
                        border: formState.imagePreview 
                          ? `2px solid ${isDarkMode ? 'rgba(64,93,230,0.8)' : 'rgba(64,93,230,0.6)'}` 
                          : `1px dashed ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
                        borderRadius: 2,
                        backgroundColor: formState.imagePreview
                          ? isDarkMode ? 'rgba(64,93,230,0.1)' : 'rgba(64,93,230,0.05)'
                          : isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                        transition: 'all 0.3s ease',
                      }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            mb: { xs: 1, sm: 2 },
                            color: isDarkMode ? '#fff' : '#000', 
                            fontWeight: 500,
                            fontSize: { xs: '0.9rem', sm: '1rem' }
                          }}
                        >
                          <FaImage style={{ marginRight: '8px', fontSize: '0.9rem' }} />
                          {formState.imagePreview ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <span style={{ color: isDarkMode ? 'rgba(64,93,230,1)' : 'rgba(64,93,230,1)' }}>
                                Image Uploaded
                              </span>
                              <Typography variant="caption" sx={{ 
                                color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                                fontStyle: 'italic'
                              }}>
                                (Caption will focus on image content)
                              </Typography>
                            </Box>
                          ) : (
                            'Upload Image (Optional)'
                          )}
                        </Typography>
                        
                        {formState.imagePreview ? (
                          <Box sx={{ position: 'relative', mb: 1 }}>
                            <Box 
                              component="img"
                              src={formState.imagePreview}
                              alt="Preview"
                              sx={{ 
                                width: '100%',
                                maxHeight: { xs: '150px', sm: '200px' },
                                objectFit: 'contain',
                                borderRadius: 1,
                              }}
                            />
                            <IconButton
                              onClick={removeImage}
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                color: '#fff',
                                padding: { xs: '4px', sm: '8px' },
                                '&:hover': {
                                  backgroundColor: 'rgba(0,0,0,0.7)',
                                }
                              }}
                            >
                              <FaTimesCircle size={isMobile ? 14 : 16} />
                            </IconButton>
                          </Box>
                        ) : (
                          <Box 
                            sx={{ 
                              textAlign: 'center',
                              p: { xs: 1.5, sm: 3 },
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                              }
                            }}
                            onClick={() => document.getElementById('image-upload')?.click()}
                          >
                            <FaUpload size={isMobile ? 20 : 28} color={isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'} />
                            <Typography 
                              variant="body2"
                              sx={{ 
                                mt: 1, 
                                color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                                fontSize: { xs: '0.8rem', sm: '0.95rem' }
                              }}
                            >
                              Click to upload an image
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                display: 'block', 
                                mt: 0.5, 
                                color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                                fontSize: { xs: '0.7rem', sm: '0.75rem' }
                              }}
                            >
                              PNG, JPG or JPEG (max. 5MB)
                            </Typography>
                          </Box>
                        )}
                        
                        <input
                          type="file"
                          id="image-upload"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleFileChange}
                        />
                        
                        {!formState.imagePreview && (
                          <Button
                            startIcon={<FaUpload size={isMobile ? 12 : 14} />}
                            variant="outlined"
                            size="small"
                            onClick={() => document.getElementById('image-upload')?.click()}
                            sx={{
                              mt: { xs: 1, sm: 2 },
                              py: { xs: 0.5, sm: 1 },
                              borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                              color: isDarkMode ? '#fff' : '#000',
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              '&:hover': {
                                borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                              }
                            }}
                          >
                            Browse Files
                          </Button>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 2, sm: 4 } }}>
              <Button
                variant="contained"
                disabled={isGenerating}
                onClick={handleGenerate}
                startIcon={isGenerating ? 
                  <CircularProgress size={isMobile ? 14 : 20} color="inherit" /> : 
                  <FaMagic size={isMobile ? 16 : 20} />
                }
                sx={{
                  py: { xs: 1, sm: 2 },
                  px: { xs: 3, sm: 5 },
                  borderRadius: 3,
                  background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                  boxShadow: isDarkMode ? '0 4px 15px rgba(64,93,230,0.3)' : '0 4px 15px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease',
                  fontSize: { xs: '0.8rem', sm: '1rem' }, // Smaller text on mobile
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
              borderRadius: { xs: '12px', sm: '16px' }, // Smaller border radius on mobile
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
              maxWidth: { xs: '95%', sm: '600px' }, // Wider on mobile
              margin: { xs: '10px', sm: '20px' }, // Less margin on mobile
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
              pb: { xs: 1, sm: 2 }, // Less padding on mobile
              pt: { xs: 1.5, sm: 2 }, // Less padding on mobile
              px: { xs: 2, sm: 3 }, // Less padding on mobile
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(64,93,230,0.2), rgba(88,81,219,0.2))' 
                : 'linear-gradient(135deg, rgba(64,93,230,0.1), rgba(88,81,219,0.1))',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FaMagic size={isMobile ? 16 : 20} color={isDarkMode ? '#fff' : '#000'} />
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600,
                  color: isDarkMode ? '#fff' : '#000',
                  fontSize: { xs: '1.2rem', sm: '1.5rem' }, // Smaller heading on mobile
                }}
              >
                Generated Caption
              </Typography>
            </Box>
            <IconButton
              onClick={() => setShowResultDialog(false)}
              size={isMobile ? "small" : "medium"} // Smaller button on mobile
              sx={{
                color: isDarkMode ? '#fff' : '#000',
                '&:hover': {
                  background: isDarkMode 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(0, 0, 0, 0.1)',
                }
                }}
              >
                <FaTimes size={isMobile ? 16 : 24} />
              </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: { xs: 2, sm: 3 } }}> {/* Less padding on mobile */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 }, // Less padding on mobile
                background: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.02)',
                borderRadius: { xs: '8px', sm: '12px' }, // Smaller border radius on mobile
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              }}
            >
              <Box
                sx={{
                  maxHeight: { xs: '50vh', sm: '60vh' }, // Smaller height on mobile
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    width: { xs: '6px', sm: '8px' }, // Thinner scrollbar on mobile
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
                        p: { xs: 2, sm: 3 }, // Less padding on mobile
                        mb: { xs: 2, sm: 3 }, // Less margin on mobile
                        background: isDarkMode 
                          ? 'rgba(255, 255, 255, 0.03)'
                          : 'rgba(0, 0, 0, 0.02)',
                        borderRadius: { xs: '8px', sm: '12px' }, // Smaller border radius on mobile
                        border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                      }}
                    >
                      {/* Caption header with number and copy button */}
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        mb: { xs: 1, sm: 2 } // Less margin on mobile
                      }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                            fontSize: { xs: '0.9rem', sm: '1rem' } // Smaller text on mobile
                          }}
                        >
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
                            padding: { xs: '4px', sm: '8px' }, // Smaller padding on mobile
                            '&:hover': {
                              color: isDarkMode ? '#fff' : '#000',
                            },
                          }}
                        >
                          <FaCopy size={isMobile ? 14 : 16} />
                        </IconButton>
                      </Box>
                      {/* Caption text */}
                      <Typography
                        variant="body1"
                        sx={{
                          whiteSpace: 'pre-wrap',
                          lineHeight: 1.8,
                          color: isDarkMode ? '#fff' : '#000',
                          fontFamily: '"Inter", sans-serif',
                          fontSize: { xs: '0.95rem', sm: '1.1rem' }, // Smaller text on mobile
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
                      
                      {/* Hashtags */}
                      {caption.text.includes('#') && (
                        <Box sx={{ 
                          mt: { xs: 1.5, sm: 2 }, // Less margin on mobile
                          pt: { xs: 1.5, sm: 2 }, // Less padding on mobile
                          borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                        }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                              fontFamily: '"Inter", sans-serif',
                              fontSize: { xs: '0.85rem', sm: '0.95rem' }, // Smaller text on mobile
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
                                      m: { xs: 0.3, sm: 0.5 }, // Less margin on mobile
                                      background: isDarkMode 
                                        ? 'rgba(64,93,230,0.2)' 
                                        : 'rgba(64,93,230,0.1)',
                                      color: isDarkMode ? '#fff' : '#000',
                                      fontSize: { xs: '0.7rem', sm: '0.8rem' }, // Smaller text on mobile
                                      height: { xs: '24px', sm: '32px' }, // Smaller height on mobile
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
              p: { xs: 2, sm: 3 }, // Less padding on mobile
              pt: { xs: 1, sm: 2 }, // Less padding top on mobile
              borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' }, // Stack buttons on mobile
              justifyContent: { xs: 'center', sm: 'space-between' },
              alignItems: 'center',
              gap: { xs: 1, sm: 0 }, // Add gap on mobile
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(64,93,230,0.1), rgba(88,81,219,0.1))' 
                : 'linear-gradient(135deg, rgba(64,93,230,0.05), rgba(88,81,219,0.05))',
            }}
          >
            <Box sx={{ width: { xs: '100%', sm: 'auto' }, mb: { xs: 1, sm: 0 } }}>
              {canRegenerate && (
                <Button
                  onClick={handleRegenerate}
                  variant="outlined"
                  fullWidth={isMobile}
                  startIcon={isRegenerating ? <CircularProgress size={isMobile ? 16 : 20} /> : <MdRefresh size={isMobile ? 14 : 18} />}
                  disabled={isRegenerating}
                  sx={{
                    mr: { xs: 0, sm: 1 },
                    py: { xs: 0.75, sm: 1 }, // Smaller padding on mobile
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                    color: isDarkMode ? '#fff' : '#000',
                    fontSize: { xs: '0.8rem', sm: '0.875rem' }, // Smaller text on mobile
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
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, // Stack buttons on mobile
              width: { xs: '100%', sm: 'auto' },
              gap: { xs: 1, sm: 0 } // Add gap on mobile
            }}>
              <Button
                onClick={handleCopyCaption}
                variant="contained"
                fullWidth={isMobile}
                startIcon={copiedToClipboard ? <FaCheck size={isMobile ? 12 : 14} /> : <FaCopy size={isMobile ? 12 : 14} />}
                sx={{
                  mr: { xs: 0, sm: 1 },
                  py: { xs: 0.75, sm: 1 }, // Smaller padding on mobile
                  background: copiedToClipboard
                    ? 'linear-gradient(45deg, #00c853, #00e676)'
                    : 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                  color: 'white',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }, // Smaller text on mobile
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
                fullWidth={isMobile}
                sx={{
                  py: { xs: 0.75, sm: 1 }, // Smaller padding on mobile
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                  color: isDarkMode ? '#fff' : '#000',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }, // Smaller text on mobile
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