import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PositiveToast from '../components/PositiveToast';

// Message data
const SURPRISE_COMPLIMENTS = [
  "You're paving the way to sales glory—keep shining!",
  "Your marketing instincts are spot-on—big wins ahead!",
  "You're unstoppable—success is just around the corner!",
  "Every step you take is pure gold—stay the course!",
  "You're crafting a sales revolution—brilliant work!",
  "The right moves, the right time—sales are calling!",
  "Your energy is magnetic—marketing magic in progress!",
  "You're on fire—sales success is yours to claim!",
  "Keep pushing—you're building a winning strategy!",
  "You're exactly where you need to be—destined for greatness!"
];

const ACHIEVEMENT_SPARKS = [
  "Boom! Two captions down—you're crushing your goals!",
  "This is how legends are made—sales-boosting brilliance!",
  "You're a caption titan—marketing domination unlocked!",
  "Two masterpieces in—your dreams are taking flight!",
  "Sales surge activated—your captions are unstoppable!",
  "You're rewriting success, one caption at a time—wow!",
  "Double caption victory—your empire is rising fast!",
  "Target obliterated—your creativity is a sales weapon!",
  "Two captions, pure power—you're a marketing maestro!",
  "Milestone smashed—your path to glory is blazing!"
];

interface PositiveMessageContextType {
  trackAction: (isCaption?: boolean) => void;
  triggerCompliment: () => void;
  triggerAchievement: () => void;
  setMessagesEnabled: (enabled: boolean) => void;
}

const PositiveMessageContext = createContext<PositiveMessageContextType | undefined>(undefined);

export const PositiveMessageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'compliment' | 'achievement'>('compliment');
  const [captionCounter, setCaptionCounter] = useState(0);
  const [actionCounter, setActionCounter] = useState(0);
  const [lastMessageTime, setLastMessageTime] = useState(0);
  const [messagesEnabled, setMessagesEnabled] = useState(true);
  
  // Load user preference from localStorage
  useEffect(() => {
    const storedPreference = localStorage.getItem('positiveMessagesEnabled');
    if (storedPreference !== null) {
      setMessagesEnabled(storedPreference === 'true');
    }
  }, []);
  
  // Get random message
  const getRandomMessage = (isAchievement: boolean): string => {
    const messages = isAchievement ? ACHIEVEMENT_SPARKS : SURPRISE_COMPLIMENTS;
    return messages[Math.floor(Math.random() * messages.length)];
  };
  
  // Check if we can show a message based on time
  const canShowMessage = useCallback((): boolean => {
    if (!messagesEnabled) return false;
    
    const now = Date.now();
    const timeSinceLastMessage = now - lastMessageTime;
    
    // Limit to no more than one message every 5 minutes (300000ms)
    return timeSinceLastMessage > 300000;
  }, [lastMessageTime, messagesEnabled]);
  
  // Track user actions
  const trackAction = useCallback((isCaption = false) => {
    if (!messagesEnabled) return;
    
    // Track general actions
    setActionCounter(prev => prev + 1);
    
    // For caption-related actions, update caption counter
    if (isCaption) {
      setCaptionCounter(prev => {
        const newCount = prev + 1;
        
        // Every 2nd caption action, trigger achievement
        if (newCount % 2 === 0 && canShowMessage()) {
          const message = getRandomMessage(true);
          setCurrentMessage(message);
          setMessageType('achievement');
          setLastMessageTime(Date.now());
          return 0; // Reset counter after achievement
        }
        return newCount;
      });
    } 
    // For general actions, randomly trigger compliments (5-10% chance)
    else {
      const randomChance = Math.random() * 100;
      if (randomChance <= 7.5 && actionCounter > 5 && canShowMessage()) {
        const message = getRandomMessage(false);
        setCurrentMessage(message);
        setMessageType('compliment');
        setLastMessageTime(Date.now());
        setActionCounter(0); // Reset action counter
      }
    }
  }, [canShowMessage, actionCounter, messagesEnabled]);
  
  // Force trigger a compliment
  const triggerCompliment = useCallback(() => {
    if (!messagesEnabled) return;
    
    const message = getRandomMessage(false);
    setCurrentMessage(message);
    setMessageType('compliment');
    setLastMessageTime(Date.now());
  }, [messagesEnabled]);
  
  // Force trigger an achievement
  const triggerAchievement = useCallback(() => {
    if (!messagesEnabled) return;
    
    const message = getRandomMessage(true);
    setCurrentMessage(message);
    setMessageType('achievement');
    setLastMessageTime(Date.now());
    setCaptionCounter(0); // Reset caption counter
  }, [messagesEnabled]);
  
  // Handle setting messages enabled/disabled
  const handleSetMessagesEnabled = useCallback((enabled: boolean) => {
    setMessagesEnabled(enabled);
    localStorage.setItem('positiveMessagesEnabled', String(enabled));
  }, []);
  
  // Clear current message
  const clearMessage = () => {
    setCurrentMessage(null);
  };
  
  return (
    <PositiveMessageContext.Provider 
      value={{ 
        trackAction, 
        triggerCompliment,
        triggerAchievement,
        setMessagesEnabled: handleSetMessagesEnabled
      }}
    >
      {children}
      
      {/* Toast container */}
      {currentMessage && (
        <PositiveToast
          message={currentMessage}
          type={messageType}
          onClose={clearMessage}
        />
      )}
    </PositiveMessageContext.Provider>
  );
};

// Custom hook for using the context
export const usePositiveMessage = (): PositiveMessageContextType => {
  const context = useContext(PositiveMessageContext);
  if (!context) {
    throw new Error('usePositiveMessage must be used within a PositiveMessageProvider');
  }
  return context;
};