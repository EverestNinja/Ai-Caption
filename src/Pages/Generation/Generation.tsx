import { useState, useEffect } from 'react';
import { 
  Container, Box, Paper, useMediaQuery, 
  Snackbar, Alert, Typography, Fade, Divider
} from "@mui/material";
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useStepContext } from '../../context/StepContext';
import BackButton from '../../components/BackButton';
import { generateCaptions } from '../../services/api';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

// Component imports
import SimpleMode from './SimpleMode';
import CustomMode from './CustomMode';
import ModeToggle from './ModeToggle';
import ResultDialog from './ResultDialog';

// Types
type PostType = 'promotional' | 'engagement' | 'testimonial' | 'event' | 'product-launch' | 'custom';
type BusinessType = 'restaurant' | 'computer-shop' | 'clothing' | 'coffee-shop' | 'custom';

interface FormState {
  postType: PostType | '';
  businessType: BusinessType | '';
  customBusinessType?: string;
  numberOfGenerations: number;
  includeHashtags: boolean;
  includeEmojis: boolean;
  captionLength: number;
  [key: string]: any;
}

interface FormErrors {
  [key: string]: string;
}

interface GeneratedCaption {
  text: string;
}

// Form field definitions
import { POST_TYPES, BUSINESS_TYPES, FORM_FIELDS } from './formConfig';

/**
 * Main Generation component that coordinates the caption generation UI
 */
const Generation = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const isMobile = useMediaQuery('(max-width:600px)');
  const { steps, setCaption, setHashtags } = useStepContext();
  
  // State management
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [captionMode, setCaptionMode] = useState<'simple' | 'custom'>('simple');
  const [formState, setFormState] = useState<FormState>({
    postType: '',
    businessType: '',
    numberOfGenerations: 1,
    includeHashtags: false,
    includeEmojis: false,
    captionLength: 2,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [generatedCaptions, setGeneratedCaptions] = useState<GeneratedCaption[]>([]);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [canRegenerate, setCanRegenerate] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [selectedCaptionIndex, setSelectedCaptionIndex] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage] = useState<string>('');

  // Menu props for consistent dropdown styling
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

  // Validate form fields
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (captionMode === 'custom') {
      if (!formState.postType) errors.postType = 'Please select a post type';
      if (!formState.businessType) errors.businessType = 'Please select a business type';
      if (formState.businessType === 'custom' && !formState.customBusinessType) {
        errors.customBusinessType = 'Please enter your custom business type';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle UI interactions
  const handlePostTypeChange = (type: PostType) => {
    setFormState(prev => ({ 
      ...prev, 
      postType: type,
      // Reset fields when post type changes
      ...Object.fromEntries(
        Object.keys(prev).filter(key => 
          key !== 'postType' && 
          key !== 'businessType'
        ).map(key => [key, ''])
      )
    }));
  };

  const handleBusinessTypeChange = (type: BusinessType) => {
    setFormState(prev => ({
      ...prev,
      businessType: type,
      customBusinessType: type === 'custom' ? prev.customBusinessType : ''
    }));
  };

  const handleChange = (field: string, value: any) => {
    setFormState(prev => ({ 
      ...prev, 
      [field]: value
    }));
    
    // Clear related form errors
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleModeChange = (mode: 'simple' | 'custom') => {
    setCaptionMode(mode);
  };

  // Caption generation
  const handleGenerate = async () => {
    // For simple mode, validate only the required fields
    if (captionMode === 'simple') {
      if (!formState.businessType?.trim()) {
        setError('Please enter your business type');
        return;
      }
      
      // Prepare data for simple mode
      const simpleFormData = {
        businessType: 'custom',
        customBusinessType: formState.businessType,
        product: formState.product || '',
        description: formState.additionalDetails || '',
        numberOfGenerations: 1,
        includeHashtags: true,
        includeEmojis: true,
        captionLength: 2
      };
      
      await generateWithFormData(simpleFormData);
      return;
    }
    
    // For custom mode, use full validation
    if (!validateForm()) {
      setError('Please fill in all required fields');
      return;
    }

    await generateWithFormData(formState);
  };
  
  const generateWithFormData = async (data: any) => {
    setIsGenerating(true);
    setError('');
    setGeneratedCaptions([]);
    setSelectedCaptionIndex(0);

    try {
      const captions = await generateCaptions(data);
      
      if (captions && captions.length > 0) {
        setGeneratedCaptions(captions);
        setShowResultDialog(true);
        setCanRegenerate(true);
      } else {
        setError('No captions were generated. Please try again.');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to generate caption: ${err.message}`);
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

  // Handle result actions
  const handleCopyCaption = (e?: React.MouseEvent, index?: number) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (generatedCaptions.length > 0) {
      const selectedCaption = generatedCaptions[index !== undefined ? index : selectedCaptionIndex].text;
      navigator.clipboard.writeText(selectedCaption);
      setCopiedToClipboard(true);
      
      // Save caption to context
      setCaption(selectedCaption);
      
      // Extract hashtags
      const hashtagRegex = /#[^\s#]+/g;
      const extractedHashtags = selectedCaption.match(hashtagRegex) || [];
      setHashtags(extractedHashtags);
      
      setTimeout(() => setCopiedToClipboard(false), 2000);
    }
  };

  const handleCreateFlyer = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (generatedCaptions.length > 0) {
      const selectedCaption = generatedCaptions[selectedCaptionIndex].text;
      setCaption(selectedCaption);
      
      const hashtagRegex = /#[^\s#]+/g;
      const extractedHashtags = selectedCaption.match(hashtagRegex) || [];
      setHashtags(extractedHashtags);
      
      localStorage.removeItem('generatedFlyerUrl');
      setShowResultDialog(false);
      
      const flyerStep = steps.find(step => step.id === 2);
      if (flyerStep) {
        navigate(flyerStep.path);
      }
    }
  };
  
  const handlePublishContent = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (generatedCaptions.length > 0) {
      const selectedCaption = generatedCaptions[selectedCaptionIndex].text;
      setCaption(selectedCaption);
      
      const hashtagRegex = /#[^\s#]+/g;
      const extractedHashtags = selectedCaption.match(hashtagRegex) || [];
      setHashtags(extractedHashtags);
      
      localStorage.removeItem('generatedFlyerUrl');
      
      const publishStep = steps.find(step => step.id === 3);
      if (publishStep) {
        navigate(publishStep.path);
        setTimeout(() => setShowResultDialog(false), 200);
      }
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  // We'll use an effect to add a subtle animation when component mounts
  useEffect(() => {
    // Any initialization can go here
  }, []);

  return (
    <AnimatePresence mode="wait">
      <Box 
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: isDarkMode 
            ? 'linear-gradient(135deg, #121212 0%, #1e1e2d 100%)' 
            : 'linear-gradient(135deg, #f5f7fa 0%, #f8f9fa 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isDarkMode 
              ? 'radial-gradient(circle at 20% 20%, rgba(64, 93, 230, 0.2), transparent 40%)' 
              : 'radial-gradient(circle at 20% 20%, rgba(64, 93, 230, 0.1), transparent 40%)',
            zIndex: 1
          }
        }}
      >
        <BackButton />

        <Container 
          maxWidth="md"
          sx={{ 
            py: { xs: 3, sm: 4 },
            px: { xs: 2, sm: 2 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            zIndex: 2
          }}
        >
          {/* Header Section */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              mb: 1,
              textAlign: 'center'
            }}
          >
            <Box sx={{ 
              bgcolor: 'primary.main', 
              borderRadius: '50%', 
              p: 1.5,
              mb: 1.5,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: `0 8px 20px ${isDarkMode ? 'rgba(64, 93, 230, 0.3)' : 'rgba(64, 93, 230, 0.2)'}`,
              transform: 'translateY(0)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: `0 12px 24px ${isDarkMode ? 'rgba(64, 93, 230, 0.4)' : 'rgba(64, 93, 230, 0.3)'}`,
              }
            }}>
              <AutoFixHighIcon sx={{ fontSize: 30, color: '#fff' }} />
            </Box>
            
            <Typography 
              variant="h3" 
              gutterBottom 
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
                fontWeight: 800,
                color: isDarkMode ? '#fff' : '#2d3748',
                textShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
                letterSpacing: '-0.5px'
              }}
            >
              Generate Your Content
            </Typography>
            
            <Typography 
              variant="subtitle1" 
              sx={{ 
                maxWidth: 600,
                mb: 1.5,
                fontSize: { xs: '0.9rem', sm: '1rem' },
                color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                lineHeight: 1.6
              }}
            >
              Create engaging content that captures attention and drives engagement
            </Typography>
            
            <Divider 
              sx={{ 
                width: '80%',
                maxWidth: '400px',
                mb: 1.5,
                opacity: 0.1,
                borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
              }} 
            />
          </Box>

          {/* Mode toggle component */}
          <Box mb={0}>
            <ModeToggle 
              captionMode={captionMode}
              handleModeChange={handleModeChange}
              isDarkMode={isDarkMode}
            />
          </Box>

          {/* Main content based on mode */}
          <Paper
            elevation={isDarkMode ? 4 : 2}
            sx={{
              p: { xs: 2, sm: 3 },
              mt: 1,
              width: '100%',
              background: isDarkMode 
                ? 'rgba(30,30,45,0.6)' 
                : 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
              boxShadow: isDarkMode 
                ? '0 15px 30px rgba(0, 0, 0, 0.3)'
                : '0 15px 30px rgba(0, 0, 0, 0.07)',
              mb: 3,
              overflow: 'hidden',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: isDarkMode 
                  ? '0 20px 40px rgba(0, 0, 0, 0.4)'
                  : '0 20px 40px rgba(0, 0, 0, 0.1)',
              }
            }}
          >
            {captionMode === 'simple' ? (
              <SimpleMode
                formState={formState}
                handleChange={handleChange}
                handleGenerate={handleGenerate}
                isDarkMode={isDarkMode}
                isGenerating={isGenerating}
              />
            ) : (
              <CustomMode
                formState={formState}
                formErrors={formErrors}
                POST_TYPES={POST_TYPES}
                BUSINESS_TYPES={BUSINESS_TYPES}
                FORM_FIELDS={FORM_FIELDS}
                handleChange={handleChange}
                handlePostTypeChange={handlePostTypeChange}
                handleBusinessTypeChange={handleBusinessTypeChange}
                handleGenerate={handleGenerate}
                isDarkMode={isDarkMode}
                isGenerating={isGenerating}
                darkModeMenuProps={darkModeMenuProps}
              />
            )}
          </Paper>
        </Container>

        {/* Result dialog */}
        <ResultDialog
          open={showResultDialog}
          onClose={() => setShowResultDialog(false)}
          generatedCaptions={generatedCaptions}
          selectedCaptionIndex={selectedCaptionIndex}
          setSelectedCaptionIndex={setSelectedCaptionIndex}
          copiedToClipboard={copiedToClipboard}
          isRegenerating={isRegenerating}
          canRegenerate={canRegenerate}
          handleRegenerate={handleRegenerate}
          handleCopyCaption={handleCopyCaption}
          handleCreateFlyer={handleCreateFlyer}
          handlePublishContent={handlePublishContent}
          isDarkMode={isDarkMode}
          isMobile={isMobile}
        />

        {/* Error messages */}
        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={() => setError('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          TransitionComponent={Fade}
        >
          <Alert 
            onClose={() => setError('')} 
            severity="error" 
            elevation={6}
            sx={{ 
              width: '100%',
              borderRadius: '12px',
              bgcolor: isDarkMode ? 'rgba(40, 40, 50, 0.9)' : undefined,
              color: isDarkMode ? '#fff' : undefined,
              '& .MuiAlert-icon': {
                color: isDarkMode ? '#ff5252' : undefined
              }
            }}
          >
            {error}
          </Alert>
        </Snackbar>
        
        {/* General messages */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          TransitionComponent={Fade}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity="success"
            elevation={6}
            sx={{ 
              width: '100%',
              borderRadius: '12px',
              bgcolor: isDarkMode ? 'rgba(40, 40, 50, 0.9)' : undefined,
              color: isDarkMode ? '#fff' : undefined,
              '& .MuiAlert-icon': {
                color: isDarkMode ? '#4caf50' : undefined
              }
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </AnimatePresence>
  );
};

export default Generation;