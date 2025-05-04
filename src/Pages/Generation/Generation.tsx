import { useState } from 'react';
import { 
  Container, Box, Paper, useMediaQuery, 
  Snackbar, Alert
} from "@mui/material";
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useStepContext } from '../../context/StepContext';
import BackButton from '../../components/BackButton';
import { getAuth } from 'firebase/auth';
import { generateCaptions } from '../../services/api';

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
  const auth = getAuth();
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
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

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

  return (
    <AnimatePresence mode="wait">
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: isDarkMode 
          ? 'linear-gradient(135deg, #121212, #1e1e2d)' 
          : 'linear-gradient(135deg, #f5f7fa, #f8f9fa)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <BackButton />

        <Container maxWidth="lg" sx={{ 
          py: { xs: 3, sm: 5 }, 
          px: { xs: 2, sm: 3 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Mode toggle component */}
          <ModeToggle 
            captionMode={captionMode}
            handleModeChange={handleModeChange}
            isDarkMode={isDarkMode}
          />

          {/* Main content based on mode */}
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 3 },
              width: '100%',
              background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              boxShadow: isDarkMode 
                ? '0 10px 30px rgba(0, 0, 0, 0.2)' 
                : '0 10px 30px rgba(0, 0, 0, 0.05)',
              mb: 4,
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
        >
          <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
        
        {/* General messages */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity="success">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </AnimatePresence>
  );
};

export default Generation;