import { useState, useEffect } from 'react';
// MUI Components
import { 
  Container, Grid, Typography, TextField, MenuItem, Button, 
  FormControl, FormLabel, RadioGroup, FormControlLabel, Radio,
  Paper, Box, useTheme, IconButton, Tooltip, alpha, 
  Switch, TextFieldProps
} from "@mui/material";
// Icons
import { MdArrowBack } from 'react-icons/md';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { BsSunFill, BsMoonFill } from 'react-icons/bs';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
// Other imports
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme as useCustomTheme } from '../../context/ThemeContext';
import Footer from '../../components/Footer/Footer';

// ===== TYPES =====
type FormFieldId = keyof FormState;

interface FormState {
  businessNiche: string;
  primaryGoal: string;
  targetAudience: string;
  painPoint: string;
  customerMotivation: string;
  emotionalTrigger: string;
  brandVoice: string;
  contentStyle: string;
  engagementHook: string;
  callToAction: string;
  timingContext: string;
  trendTieIn: string;
  brandTagline: string;
  socialProof: string;
  productHighlight: string;
  uniqueSellingPoint: string;
  keyBenefit: string;
  keywordFocus: string;
}

interface SectionTitleProps {
  title: string;
  tooltip: string;
  number?: string;
}

interface FieldOption {
  value: string;
  label: string;
}

interface FormField {
  id: FormFieldId;
  label: string;
  type: 'select' | 'text' | 'radio';
  options?: FieldOption[];
  multiline?: boolean;
  rows?: number;
}

interface FormSection {
  id: string;
  title: string;
  tooltip: string;
  number: string;
  fields: FormField[];
}

interface ThemeStyles {
  card: React.CSSProperties & {
    [key: string]: any;
  };
  input: React.CSSProperties & {
    [key: string]: any;
  };
  text: {
    primary: string;
    secondary: string;
    accent: string;
  };
  button: React.CSSProperties & {
    [key: string]: any;
  };
  background: {
    main: string;
    paper: string;
  };
}

// ===== CONSTANTS =====
const TRANSITION_TIMING = '0.3s ease';
const TRANSITION_PROPERTIES = 'background-color, color, border-color, box-shadow, transform, opacity';

// Initial form state
const initialFormState: FormState = {
  businessNiche: 'None',
  primaryGoal: 'None',
  targetAudience: 'None',
  painPoint: 'None',
  customerMotivation: 'None',
  emotionalTrigger: 'None',
  brandVoice: 'None',
  contentStyle: 'None',
  engagementHook: 'no',
  callToAction: 'None',
  timingContext: 'None',
  trendTieIn: 'None',
  brandTagline: '',
  socialProof: 'None',
  productHighlight: '',
  uniqueSellingPoint: 'None',
  keyBenefit: 'None',
  keywordFocus: ''
};

// ===== FORM OPTIONS =====
const BUSINESS_NICHES = [
  { value: 'None', label: 'None' },
  { value: 'Fitness', label: 'Fitness' },
  { value: 'Fashion', label: 'Fashion' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Food & Beverage', label: 'Food & Beverage' },
  { value: 'Beauty', label: 'Beauty' },
  { value: 'Travel', label: 'Travel' },
  { value: 'Health & Wellness', label: 'Health & Wellness' },
  { value: 'Education', label: 'Education' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Real Estate', label: 'Real Estate' }
];

const PRIMARY_GOALS = [
  { value: 'None', label: 'None' },
  { value: 'Share News', label: 'Share News' },
  { value: 'Boost Engagement', label: 'Boost Engagement' },
  { value: 'Increase Conversions', label: 'Increase Conversions' },
  { value: 'Brand Awareness', label: 'Brand Awareness' },
  { value: 'Drive Traffic', label: 'Drive Traffic' },
  { value: 'Educate Audience', label: 'Educate Audience' },
  { value: 'Generate Leads', label: 'Generate Leads' },
  { value: 'Promote Offers', label: 'Promote Offers' },
  { value: 'Build Community', label: 'Build Community' },
  { value: 'Increase Followers', label: 'Increase Followers' }
];

const TARGET_AUDIENCES = [
  { value: 'None', label: 'None' },
  { value: 'Loyal Fans', label: 'Loyal Fans' },
  { value: 'New Customers', label: 'New Customers' },
  { value: 'Young Professionals', label: 'Young Professionals' },
  { value: 'Parents', label: 'Parents' },
  { value: 'Students', label: 'Students' },
  { value: 'Entrepreneurs', label: 'Entrepreneurs' },
  { value: 'Fitness Enthusiasts', label: 'Fitness Enthusiasts' },
  { value: 'Tech Lovers', label: 'Tech Lovers' },
  { value: 'Travelers', label: 'Travelers' },
  { value: 'Luxury Shoppers', label: 'Luxury Shoppers' }
];

const PAIN_POINTS = [
  { value: 'None', label: 'None' },
  { value: 'Lack of Skills', label: 'Lack of Skills' },
  { value: 'Time Constraints', label: 'Time Constraints' },
  { value: 'Expensive Solutions', label: 'Expensive Solutions' },
  { value: 'Lack of Motivation', label: 'Lack of Motivation' },
  { value: 'Low Confidence', label: 'Low Confidence' },
  { value: 'Difficulty Finding Quality', label: 'Difficulty Finding Quality' },
  { value: 'Overwhelming Choices', label: 'Overwhelming Choices' },
  { value: 'Trust Issues', label: 'Trust Issues' },
  { value: 'Poor Customer Service', label: 'Poor Customer Service' },
  { value: 'Need for Convenience', label: 'Need for Convenience' }
];

const CUSTOMER_MOTIVATIONS = [
  { value: 'None', label: 'None' },
  { value: 'Feel Good', label: 'Feel Good' },
  { value: 'Save Money', label: 'Save Money' },
  { value: 'Save Time', label: 'Save Time' },
  { value: 'Improve Health', label: 'Improve Health' },
  { value: 'Gain Knowledge', label: 'Gain Knowledge' },
  { value: 'Be More Productive', label: 'Be More Productive' },
  { value: 'Look Better', label: 'Look Better' },
  { value: 'Achieve Goals', label: 'Achieve Goals' },
  { value: 'Have Fun', label: 'Have Fun' },
  { value: 'Stay Updated', label: 'Stay Updated' }
];

const EMOTIONAL_TRIGGERS = [
  { value: 'None', label: 'None' },
  { value: 'Curiosity', label: 'Curiosity' },
  { value: 'Fear of Missing Out (FOMO)', label: 'Fear of Missing Out (FOMO)' },
  { value: 'Inspiration', label: 'Inspiration' },
  { value: 'Happiness', label: 'Happiness' },
  { value: 'Urgency', label: 'Urgency' },
  { value: 'Nostalgia', label: 'Nostalgia' },
  { value: 'Empowerment', label: 'Empowerment' },
  { value: 'Trust', label: 'Trust' },
  { value: 'Exclusivity', label: 'Exclusivity' },
  { value: 'Surprise', label: 'Surprise' }
];

const BRAND_VOICES = [
  { value: 'None', label: 'None' },
  { value: 'Witty', label: 'Witty' },
  { value: 'Casual', label: 'Casual' },
  { value: 'Professional', label: 'Professional' },
  { value: 'Inspirational', label: 'Inspirational' },
  { value: 'Funny', label: 'Funny' },
  { value: 'Educational', label: 'Educational' },
  { value: 'Bold', label: 'Bold' },
  { value: 'Storytelling', label: 'Storytelling' },
  { value: 'Luxury', label: 'Luxury' },
  { value: 'Conversational', label: 'Conversational' }
];

const CONTENT_STYLES = [
  { value: 'None', label: 'None' },
  { value: 'List', label: 'List' },
  { value: 'Storytelling', label: 'Storytelling' },
  { value: 'Educational', label: 'Educational' },
  { value: 'Behind-the-Scenes', label: 'Behind-the-Scenes' },
  { value: 'Q&A', label: 'Q&A' },
  { value: 'Polls & Questions', label: 'Polls & Questions' },
  { value: 'User-Generated Content', label: 'User-Generated Content' },
  { value: 'Case Studies', label: 'Case Studies' },
  { value: 'Short & Snappy', label: 'Short & Snappy' },
  { value: 'Memes & Humor', label: 'Memes & Humor' }
];

const CALLS_TO_ACTION = [
  { value: 'None', label: 'None' },
  { value: 'Visit Site', label: 'Visit Site' },
  { value: 'Shop Now', label: 'Shop Now' },
  { value: 'Sign Up', label: 'Sign Up' },
  { value: 'Learn More', label: 'Learn More' },
  { value: 'Download Now', label: 'Download Now' },
  { value: 'Get Started', label: 'Get Started' },
  { value: 'Book Now', label: 'Book Now' },
  { value: 'Subscribe', label: 'Subscribe' },
  { value: 'Contact Us', label: 'Contact Us' },
  { value: 'Try for Free', label: 'Try for Free' }
];

const TIMING_CONTEXTS = [
  { value: 'None', label: 'None' },
  { value: 'Today Only', label: 'Today Only' },
  { value: 'Limited Time', label: 'Limited Time' },
  { value: 'Seasonal', label: 'Seasonal' },
  { value: 'Weekend Special', label: 'Weekend Special' },
  { value: 'Holiday Sale', label: 'Holiday Sale' },
  { value: 'New Launch', label: 'New Launch' },
  { value: 'Pre-Order', label: 'Pre-Order' },
  { value: 'Monthly Offer', label: 'Monthly Offer' },
  { value: 'Clearance Sale', label: 'Clearance Sale' },
  { value: 'Event Exclusive', label: 'Event Exclusive' }
];

const TREND_TIE_INS = [
  { value: 'None', label: 'None' },
  { value: 'Viral Trend', label: 'Viral Trend' },
  { value: 'Hashtag Challenge', label: 'Hashtag Challenge' },
  { value: 'Seasonal Trend', label: 'Seasonal Trend' },
  { value: 'Pop Culture Reference', label: 'Pop Culture Reference' },
  { value: 'Influencer Collaboration', label: 'Influencer Collaboration' }
];

const SOCIAL_PROOFS = [
  { value: 'None', label: 'None' },
  { value: 'Best Seller', label: 'Best Seller' },
  { value: 'Top Rated', label: 'Top Rated' },
  { value: 'Customer Favorite', label: 'Customer Favorite' }
];

const UNIQUE_SELLING_POINTS = [
  { value: 'None', label: 'None' },
  { value: 'Eco Friendly', label: 'Eco Friendly' },
  { value: 'Affordable', label: 'Affordable' },
  { value: 'Luxury', label: 'Luxury' },
  { value: 'Fast & Efficient', label: 'Fast & Efficient' },
  { value: 'Customizable', label: 'Customizable' },
  { value: 'Premium Quality', label: 'Premium Quality' },
  { value: 'Innovative', label: 'Innovative' },
  { value: 'Handmade', label: 'Handmade' },
  { value: 'Limited Edition', label: 'Limited Edition' },
  { value: 'Ethically Sourced', label: 'Ethically Sourced' }
];

const KEY_BENEFITS = [
  { value: 'None', label: 'None' },
  { value: 'Boost Confidence', label: 'Boost Confidence' },
  { value: 'Save Time', label: 'Save Time' },
  { value: 'Improve Health', label: 'Improve Health' },
  { value: 'Increase Productivity', label: 'Increase Productivity' },
  { value: 'Easy to Use', label: 'Easy to Use' },
  { value: 'Cost-Effective', label: 'Cost-Effective' },
  { value: 'Enhance Lifestyle', label: 'Enhance Lifestyle' },
  { value: 'Provide Security', label: 'Provide Security' },
  { value: 'Reduce Stress', label: 'Reduce Stress' },
  { value: 'Support Growth', label: 'Support Growth' }
];

// ===== FORM STRUCTURE =====
const FORM_SECTIONS: FormSection[] = [
  {
    id: 'business',
    title: 'Business Details',
    tooltip: 'Define your business characteristics and goals',
    number: '1',
    fields: [
      {
        id: 'businessNiche',
        label: 'Business Niche',
        type: 'select',
        options: BUSINESS_NICHES
      },
      {
        id: 'primaryGoal',
        label: 'Primary Goal',
        type: 'select',
        options: PRIMARY_GOALS
      }
    ]
  },
  {
    id: 'audience',
    title: 'Audience Details',
    tooltip: 'Understand and target your audience effectively',
    number: '2',
    fields: [
      {
        id: 'targetAudience',
        label: 'Target Audience',
        type: 'select',
        options: TARGET_AUDIENCES
      },
      {
        id: 'painPoint',
        label: 'Pain Point',
        type: 'select',
        options: PAIN_POINTS
      },
      {
        id: 'customerMotivation',
        label: 'Customer Motivation',
        type: 'select',
        options: CUSTOMER_MOTIVATIONS
      }
    ]
  },
  {
    id: 'content',
    title: 'Content Style',
    tooltip: "Define your content's tone and style",
    number: '3',
    fields: [
      {
        id: 'emotionalTrigger',
        label: 'Emotional Trigger',
        type: 'select',
        options: EMOTIONAL_TRIGGERS
      },
      {
        id: 'brandVoice',
        label: 'Brand Voice',
        type: 'select',
        options: BRAND_VOICES
      },
      {
        id: 'contentStyle',
        label: 'Content Style',
        type: 'select',
        options: CONTENT_STYLES
      },
      {
        id: 'engagementHook',
        label: 'Engagement Hook',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      }
    ]
  },
  {
    id: 'promotion',
    title: 'Promotion & Context',
    tooltip: 'Set your promotional strategy and context',
    number: '4',
    fields: [
      {
        id: 'callToAction',
        label: 'Call to Action',
        type: 'select',
        options: CALLS_TO_ACTION
      },
      {
        id: 'timingContext',
        label: 'Timing Context',
        type: 'select',
        options: TIMING_CONTEXTS
      },
      {
        id: 'trendTieIn',
        label: 'Trend Tie-In',
        type: 'select',
        options: TREND_TIE_INS
      },
      {
        id: 'brandTagline',
        label: 'Brand Tagline',
        type: 'text'
      },
      {
        id: 'socialProof',
        label: 'Social Proof',
        type: 'select',
        options: SOCIAL_PROOFS
      }
    ]
  },
  {
    id: 'product',
    title: 'Product/Service Details',
    tooltip: 'Highlight your product or service features',
    number: '5',
    fields: [
      {
        id: 'productHighlight',
        label: 'Product/Service Highlight',
        type: 'text',
        multiline: true,
        rows: 2
      },
      {
        id: 'uniqueSellingPoint',
        label: 'Unique Selling Point',
        type: 'select',
        options: UNIQUE_SELLING_POINTS
      },
      {
        id: 'keyBenefit',
        label: 'Key Benefit',
        type: 'select',
        options: KEY_BENEFITS
      },
      {
        id: 'keywordFocus',
        label: 'Keyword Focus',
        type: 'text'
      }
    ]
  }
];

// ===== THEME STYLES =====
const getThemeStyles = (isDarkMode: boolean, isThemeChanging: boolean): ThemeStyles => ({
  card: {
    backgroundColor: isDarkMode ? 'rgba(30, 30, 40, 0.4)' : 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    border: 'none',
    boxShadow: isDarkMode 
      ? '0 8px 32px rgba(0, 0, 0, 0.2)' 
      : '0 8px 32px rgba(0, 0, 0, 0.05)',
  },
  input: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: isDarkMode ? 'rgba(15, 15, 20, 0.5)' : 'rgba(255, 255, 255, 0.8)',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        backgroundColor: isDarkMode 
          ? 'rgba(30, 30, 40, 0.8)' 
          : 'rgba(122, 90, 248, 0.03)',
      },
      '&.Mui-focused': {
        backgroundColor: isDarkMode 
          ? 'rgba(30, 30, 40, 0.95)' 
          : 'rgba(122, 90, 248, 0.05)',
      }
    },
    '& .MuiInputLabel-root': {
      color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: isDarkMode 
        ? 'rgba(255, 255, 255, 0.15)' 
        : 'rgba(0, 0, 0, 0.15)'
    },
    '& .MuiMenuItem-root': {
      color: isDarkMode ? '#fff' : '#000'
    }
  },
  text: {
    primary: isDarkMode ? '#ffffff' : '#121212',
    secondary: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
    accent: 'linear-gradient(45deg, #7A5AF8, #6366f1)'
  },
  button: {
    background: isDarkMode 
      ? 'linear-gradient(45deg, #7A5AF8, #6366f1)' 
      : '#7A5AF8',
    color: '#ffffff',
    boxShadow: isDarkMode 
      ? '0 8px 16px rgba(122, 90, 248, 0.4)' 
      : '0 8px 16px rgba(122, 90, 248, 0.3)',
    '&:hover': {
      background: isDarkMode 
        ? 'linear-gradient(45deg, #6344d4, #5354d2)' 
        : '#6344d4',
      transform: 'translateY(-2px)',
      boxShadow: isDarkMode 
        ? '0 12px 20px rgba(122, 90, 248, 0.5)' 
        : '0 12px 20px rgba(122, 90, 248, 0.4)'
    }
  },
  background: {
    main: isDarkMode 
      ? 'linear-gradient(135deg, #121212, #1e1e2d)' 
      : 'linear-gradient(135deg, #f5f7fa, #f8f9fa)',
    paper: isDarkMode ? '#1e1e2d' : '#ffffff'
  }
});

/**
 * Main Generation component for creating social media captions
 */
const Generation = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useCustomTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  const [isThemeChanging, setIsThemeChanging] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormState>(initialFormState);

  // Get theme-specific styles
  const themeStyles = getThemeStyles(isDarkMode, isThemeChanging);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Apply theme to document body with synchronized transition
    document.body.style.transition = `${TRANSITION_PROPERTIES} ${TRANSITION_TIMING}`;
    document.body.style.backgroundColor = isDarkMode ? '#121212' : '#ffffff';
    document.body.style.color = isDarkMode ? '#ffffff' : '#121212';
  }, [isDarkMode]);

  // Event Handlers
  const handleThemeToggle = (): void => {
    setIsThemeChanging(true);
    toggleTheme();
    setTimeout(() => setIsThemeChanging(false), 400);
  };

  const handleChange = (field: FormFieldId) => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: event.target.value
      }));
    };

  // UI Components
  const SectionTitle = ({ title, tooltip, number }: SectionTitleProps) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      {number && (
        <Box sx={{ 
          width: 30, 
          height: 30, 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: themeStyles.text.accent,
          color: 'white',
          fontWeight: 'bold',
          mr: 1.5
        }}>
          {number}
        </Box>
      )}
      <Typography variant="h6" sx={{ 
        fontWeight: 600,
        background: themeStyles.text.accent,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        {title}
      </Typography>
      <Tooltip title={tooltip} arrow>
        <IconButton size="small" sx={{ ml: 1 }}>
          <IoMdInformationCircleOutline style={{ 
            fontSize: 18, 
            color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
          }} />
        </IconButton>
      </Tooltip>
    </Box>
  );

  const StyledTextField = (props: TextFieldProps) => (
    <TextField
      {...props}
      size="small"
      sx={{
        ...themeStyles.input,
        mb: 2.5,
        ...(props.sx || {})
      }}
    />
  );

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'select':
        return (
          <StyledTextField
            key={field.id}
            select
            fullWidth
            label={field.label}
            value={formData[field.id]}
            onChange={handleChange(field.id)}
            margin="normal"
            helperText=""
          >
            {field.options?.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </StyledTextField>
        );
      
      case 'text':
        return (
          <StyledTextField
            key={field.id}
            fullWidth
            label={field.label}
            value={formData[field.id]}
            onChange={handleChange(field.id)}
            margin="normal"
            multiline={field.multiline}
            rows={field.rows}
            helperText=""
          />
        );
      
      case 'radio':
        return (
          <FormControl key={field.id} margin="normal">
            <FormLabel sx={{ 
              fontSize: '0.875rem', 
              color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
              '&.Mui-focused': {
                color: isDarkMode ? '#7A5AF8' : '#7A5AF8'
              }
            }}>
              {field.label}
            </FormLabel>
            <RadioGroup
              row
              value={formData[field.id]}
              onChange={handleChange(field.id)}
            >
              {field.options?.map(option => (
                <FormControlLabel
                  key={option.value}
                  value={option.value} 
                  control={
                    <Radio 
                      size="small" 
                      sx={{
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : undefined,
                        '&.Mui-checked': {
                          color: '#7A5AF8',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ 
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.87)' : undefined,
                      fontSize: '0.875rem'
                    }}>
                      {option.label}
                    </Typography>
                  } 
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
      
      default:
        return null;
    }
  };

  const renderFormSection = (section: FormSection) => (
    <Grid item xs={12} md={6} lg={4} key={section.id}>
      <Paper elevation={0} sx={{ 
        p: 3, 
        height: '100%', 
        borderRadius: 3,
        ...themeStyles.card
      }}>
        <SectionTitle 
          title={section.title} 
          tooltip={section.tooltip} 
          number={section.number} 
        />
        {section.fields.map(field => renderField(field))}
      </Paper>
    </Grid>
  );

  if (!mounted) return null;

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: themeStyles.background.main,
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
          color: isDarkMode ? themeStyles.text.primary : themeStyles.text.primary,
          bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
          zIndex: 1100,
          '&:hover': {
            bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : alpha(theme.palette.primary.main, 0.1),
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
          filter: isThemeChanging ? 'blur(0.3px)' : 'none',
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
          onChange={handleThemeToggle}
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

      <Container maxWidth="lg" sx={{ mb: 5 }}>
        {/* Header */}
        <Box component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ textAlign: 'center', mb: 6 }}
        >
          <Typography variant="h3" gutterBottom sx={{ 
            fontWeight: 700,
            background: themeStyles.text.accent,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
            textShadow: isDarkMode ? '0 0 30px rgba(122, 90, 248, 0.3)' : 'none'
          }}>
            ✨ Generate Your Caption
          </Typography>
          <Typography variant="h6" sx={{ 
            color: themeStyles.text.secondary, 
            fontWeight: 400,
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            Create engaging captions that capture attention and drive engagement
          </Typography>
        </Box>

        {/* Form Sections */}
        <Grid container spacing={3}>
          {FORM_SECTIONS.map(section => renderFormSection(section))}
        </Grid>
        
        {/* Generate Button */}
        <Box 
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 6,
            mb: 8
          }}
        >
          <Button 
            variant="contained" 
            startIcon={<AutoAwesomeIcon />}
            sx={{
              ...themeStyles.button,
              fontSize: "1.2rem", 
              px: 6, 
              py: 2,
              borderRadius: 3,
              textTransform: 'none',
              transition: 'all 0.3s ease-in-out',
            }}
          >
            Generate Caption
          </Button>
        </Box>
      </Container>

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