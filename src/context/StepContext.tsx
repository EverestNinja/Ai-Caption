import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export interface Step {
  id: number;
  label: string;
  path: string;
}

// Define the application steps
export const APP_STEPS: Step[] = [
  { id: 1, label: 'Create Your Caption', path: '/generate' },
  { id: 2, label: 'Create Your Visual Content', path: '/flyer' },
  { id: 3, label: 'Publish Your Content', path: '/publish' }
];

interface StepContextType {
  currentStep: number;
  steps: Step[];
  goToStep: (stepId: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  setCaption: (caption: string) => void;
  setHashtags: (hashtags: string[]) => void;
  caption: string;
  hashtags: string[];
}

const defaultStepContext: StepContextType = {
  currentStep: 1,
  steps: APP_STEPS,
  goToStep: () => {},
  goToNextStep: () => {},
  goToPreviousStep: () => {},
  setCaption: () => {},
  setHashtags: () => {},
  caption: '',
  hashtags: []
};

const StepContext = createContext<StepContextType>(defaultStepContext);

export const useStepContext = () => useContext(StepContext);

interface StepProviderProps {
  children: ReactNode;
}

export const StepProvider: React.FC<StepProviderProps> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const navigate = useNavigate();

  const goToStep = (stepId: number) => {
    if (stepId >= 1 && stepId <= APP_STEPS.length) {
      const step = APP_STEPS.find(s => s.id === stepId);
      if (step) {
        setCurrentStep(stepId);
        navigate(step.path);
      }
    }
  };

  const goToNextStep = () => {
    if (currentStep < APP_STEPS.length) {
      goToStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const value = {
    currentStep,
    steps: APP_STEPS,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    setCaption,
    setHashtags,
    caption,
    hashtags
  };

  return (
    <StepContext.Provider value={value}>
      {children}
    </StepContext.Provider>
  );
};

export default StepContext; 