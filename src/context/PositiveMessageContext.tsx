import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PositiveToast from '../components/PositiveToast';

// Message data
const SURPRISE_COMPLIMENTS = [
  "You're on the perfect path—keep it up!",
  "Your sales game is about to soar—great move!",
  "You're doing it right—marketing magic incoming!",
  "Stay positive—your efforts are paying off!",
  "You've got the vision—success is yours!",
  "You're paving the way to sales glory—keep shining!",
  "Your marketing instincts are spot-on—big wins ahead!",
  "You're unstoppable—success is just around the corner!",
  "Every step you take is pure gold—stay the course!",
  "You're crafting a sales revolution—brilliant work!"
];

const ACHIEVEMENT_SPARKS = [
  "Wow, you're smashing your caption goals!",
  "This is how you conquer your dreams—epic caption!",
  "You're soaring toward sales stardom—brilliant!",
  "Another big win—your marketing is unstoppable!",
  "Caption mastery: You're building a sales empire!",
  "You're crushing targets with every word—amazing!",
  "This caption? A giant step to your next sale!",
  "Legend status achieved—two captions, pure fire!",
  "Your success streak is unstoppable—wow!",
  "Dreams in action: This caption seals the deal!"
];

interface PositiveMessageContextType {
  trackAction: (isCaption?: boolean) => void;
  triggerCompliment: () => void;
  triggerAchievement: () => void;
  setMessagesEnabled: (enabled: boolean) => void;
  messagesEnabled: boolean;
}

const PositiveMessageContext = createContext<PositiveMessageContextType | undefined>(undefined);

export const PositiveMessageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'compliment' | 'achievement'>('compliment');
  const [captionCounter, setCaptionCounter] = useState(0);
  const [actionCounter, setActionCounter] = useState(0);
  const [lastMessageTime, setLastMessageTime] = useState(0);
  const [messagesEnabled, setMessagesEnabled] = useState(true);
  const [recentMessageCount, setRecentMessageCount] = useState(0);
  
  // Load user preference from localStorage
  useEffect(() => {
    const storedPreference = localStorage.getItem('positiveMessagesEnabled');
    if (storedPreference !== null) {
      setMessagesEnabled(storedPreference === 'true');
    }
  }, []);
  
  // Reset message count every 5 minutes
  useEffect(() => {
    const resetInterval = setInterval(() => {
      setRecentMessageCount(0);
    }, 300000); // 5 minutes
    
    return () => clearInterval(resetInterval);
  }, []);
  
  // Get random message
  const getRandomMessage = (isAchievement: boolean): string => {
    const messages = isAchievement ? ACHIEVEMENT_SPARKS : SURPRISE_COMPLIMENTS;
    return messages[Math.floor(Math.random() * messages.length)];
  };
  
  // Check if we can show a message based on time and message count
  const canShowMessage = useCallback((): boolean => {
    if (!messagesEnabled) return false;
    
    const now = Date.now();
    const timeSinceLastMessage = now - lastMessageTime;
    
    // Don't show messages too close together (at least 10 seconds apart)
    if (timeSinceLastMessage < 10000) return false;
    
    // Cap at 1-2 messages (combined) per 5-minute window
    return recentMessageCount < 2;
  }, [lastMessageTime, messagesEnabled, recentMessageCount]);
  
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
          setRecentMessageCount(prev => prev + 1);
          return 0; // Reset counter after achievement
        }
        return newCount;
      });
    } 
    // For general actions, randomly trigger compliments (5-10% chance)
    else {
      const randomChance = Math.random() * 100;
      const triggerThreshold = Math.min(10, 5 + (actionCounter * 0.5)); // 5-10% chance, increasing with actions
      
      if (randomChance <= triggerThreshold && actionCounter >= 3 && canShowMessage()) {
        const message = getRandomMessage(false);
        setCurrentMessage(message);
        setMessageType('compliment');
        setLastMessageTime(Date.now());
        setRecentMessageCount(prev => prev + 1);
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
    setRecentMessageCount(prev => Math.min(prev + 1, 2));
  }, [messagesEnabled]);
  
  // Force trigger an achievement
  const triggerAchievement = useCallback(() => {
    if (!messagesEnabled) return;
    
    const message = getRandomMessage(true);
    setCurrentMessage(message);
    setMessageType('achievement');
    setLastMessageTime(Date.now());
    setRecentMessageCount(prev => Math.min(prev + 1, 2));
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
        setMessagesEnabled: handleSetMessagesEnabled,
        messagesEnabled
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