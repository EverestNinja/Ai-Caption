import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { IoIosArrowForward } from 'react-icons/io';

export interface Step {
  id: number;
  label: string;
  path: string;
}

interface StepNavigationProps {
  currentStep: number;
  steps: Step[];
  onNextStep?: () => void;
  nextStepLabel?: string;
  nextStepPath?: string;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  steps,
  onNextStep,
  nextStepLabel,
  nextStepPath
}) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleStepClick = (step: Step) => {
    if (step.id <= currentStep) {
      navigate(step.path);
    }
  };

  const handleNextClick = () => {
    if (onNextStep) {
      onNextStep();
    } else if (nextStepPath) {
      navigate(nextStepPath);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
        px: 2,
      }}
    >
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        alignItems: 'center'
      }}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <Box
              onClick={() => handleStepClick(step)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: step.id <= currentStep ? 'pointer' : 'default',
                opacity: step.id > currentStep ? 0.5 : 1,
                transition: 'all 0.3s ease',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: step.id === currentStep ? 700 : 600,
                  color: isDarkMode ? '#fff' : '#000',
                  fontSize: { xs: '0.85rem', sm: '1rem' },
                  opacity: step.id === currentStep ? 1 : 0.8,
                  '&:hover': {
                    opacity: step.id <= currentStep ? 1 : 0.8,
                  },
                }}
              >
                {`Step ${step.id}: ${step.label}`}
              </Typography>
            </Box>
            {index < steps.length - 1 && (
              <Box 
                sx={{ 
                  mx: { xs: 1, sm: 2 },
                  color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <IoIosArrowForward />
              </Box>
            )}
          </React.Fragment>
        ))}
      </Box>

      {nextStepLabel && (
        <Button
          variant="contained"
          onClick={handleNextClick}
          sx={{
            ml: 2,
            py: 1,
            px: { xs: 2, sm: 3 },
            borderRadius: 2,
            background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
            color: '#fff',
            textTransform: 'none',
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            fontWeight: 600,
            '&:hover': {
              background: 'linear-gradient(45deg, #833AB4, #5851DB, #405DE6)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)'
            },
          }}
        >
          {nextStepLabel}
        </Button>
      )}
    </Box>
  );
};

export default StepNavigation; 