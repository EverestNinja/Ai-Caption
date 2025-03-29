import React, { useRef } from 'react';
import { Button, ButtonProps } from '@mui/material';
import { getRandomAnimation } from '../utils/feedbackUtils';

// Define props for our enhanced button
interface FeedbackButtonProps extends ButtonProps {
  isKeyAction?: boolean;
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({ 
  children, 
  isKeyAction = false, 
  onClick,
  className,
  ...props 
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Direct DOM manipulation for animations
    if (buttonRef.current) {
      // Get random animation
      const animation = getRandomAnimation();
      console.log("Applying animation:", animation);
      
      // Set ripple position if ripple animation is selected
      if (animation === 'ripple') {
        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        buttonRef.current.style.setProperty('--x', `${x}px`);
        buttonRef.current.style.setProperty('--y', `${y}px`);
      }
      
      // Remove any existing animation classes
      buttonRef.current.classList.remove('scale', 'glow', 'colorBurst', 'bounce', 'ripple');
      
      // Force browser reflow to ensure animation starts fresh
      void buttonRef.current.offsetWidth;
      
      // Add the new animation class
      buttonRef.current.classList.add(animation);
      
      // Remove the animation class after it completes
      setTimeout(() => {
        if (buttonRef.current) {
          buttonRef.current.classList.remove(animation);
        }
      }, 500);
    }
    
    // Call the original onClick handler if provided
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Button
      ref={buttonRef}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
};

export default FeedbackButton;