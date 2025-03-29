import React, { createContext, useContext, useState, useEffect } from 'react';

interface FeedbackContextType {
  soundsEnabled: boolean;
  animationsEnabled: boolean;
  soundVolume: number;
  toggleSounds: () => void;
  toggleAnimations: () => void;
  setSoundVolume: (volume: number) => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundsEnabled, setSoundsEnabled] = useState<boolean>(true);
  const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(true);
  const [soundVolume, setSoundVolume] = useState<number>(0.4);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const storedSoundsEnabled = localStorage.getItem('soundsEnabled');
    if (storedSoundsEnabled !== null) {
      setSoundsEnabled(storedSoundsEnabled !== 'false');
    }

    const storedAnimationsEnabled = localStorage.getItem('animationsEnabled');
    if (storedAnimationsEnabled !== null) {
      setAnimationsEnabled(storedAnimationsEnabled !== 'false');
    }

    const storedSoundVolume = localStorage.getItem('soundVolume');
    if (storedSoundVolume !== null) {
      setSoundVolume(parseFloat(storedSoundVolume));
    }
  }, []);

  // Toggle sound effects
  const toggleSounds = () => {
    const newValue = !soundsEnabled;
    setSoundsEnabled(newValue);
    localStorage.setItem('soundsEnabled', String(newValue));
  };

  // Toggle animations
  const toggleAnimations = () => {
    const newValue = !animationsEnabled;
    setAnimationsEnabled(newValue);
    localStorage.setItem('animationsEnabled', String(newValue));
  };

  // Set sound volume
  const handleSetSoundVolume = (volume: number) => {
    setSoundVolume(volume);
    localStorage.setItem('soundVolume', String(volume));
  };

  return (
    <FeedbackContext.Provider
      value={{
        soundsEnabled,
        animationsEnabled,
        soundVolume,
        toggleSounds,
        toggleAnimations,
        setSoundVolume: handleSetSoundVolume,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = (): FeedbackContextType => {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};