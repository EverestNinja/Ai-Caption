import React, { useRef, useEffect } from 'react';
import { Button, ButtonProps } from '@mui/material';
import { 
  getRandomAnimation, 
  playSound, 
  triggerHaptic,
  initSoundBank
} from '../utils/feedbackUtils';

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
  
  // Initialize sound bank on component mount
  useEffect(() => {
    initSoundBank();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Check if animations are enabled
    const animationsEnabled = localStorage.getItem('animationsEnabled') !== 'false';
    
    // Direct DOM manipulation for animations
    if (buttonRef.current && animationsEnabled) {
      // Get random animation
      const animation = getRandomAnimation(isKeyAction);
      
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
      
      // Handle particle effect for key actions
      if (isKeyAction) {
        addParticleEffect(e);
      }
      
      // Remove the animation class after it completes
      setTimeout(() => {
        if (buttonRef.current) {
          buttonRef.current.classList.remove(animation);
        }
      }, 300); // Reduced from 500ms to 300ms for snappier feedback
    }
    
    // Play sound with frequency control based on action importance
    playSound(isKeyAction);
    
    // Trigger haptic feedback for key actions
    triggerHaptic(isKeyAction);
    
    // Call the original onClick handler if provided
    if (onClick) {
      onClick(e);
    }
  };
  
  // Create particle effect at click position
  const addParticleEffect = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Create particle container
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.position = 'absolute';
    particleContainer.style.left = `${x}px`;
    particleContainer.style.top = `${y}px`;
    particleContainer.style.pointerEvents = 'none';
    
    // Create particles
    const particleCount = 3 + Math.floor(Math.random() * 3); // 3-5 particles
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Randomize particle properties
      const size = 2 + Math.random() * 2; // 2-4px
      const angle = Math.random() * Math.PI * 2; // Random direction
      const distance = 5 + Math.random() * 15; // How far the particle travels
      const duration = 100 + Math.random() * 200; // 100-300ms duration
      
      // Style the particle
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.position = 'absolute';
      particle.style.backgroundColor = `rgba(255, 255, 255, 0.8)`;
      particle.style.borderRadius = '50%';
      particle.style.transform = 'translate(-50%, -50%)';
      particle.style.animation = `particle-fade ${duration}ms forwards`;
      
      // Position calculation for animation
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;
      
      // Apply animation
      particle.animate(
        [
          { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.8 },
          { transform: `translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) scale(0)`, opacity: 0 }
        ],
        { duration, easing: 'ease-out', fill: 'forwards' }
      );
      
      particleContainer.appendChild(particle);
    }
    
    buttonRef.current.appendChild(particleContainer);
    
    // Remove particle container after animation completes
    setTimeout(() => {
      if (buttonRef.current && buttonRef.current.contains(particleContainer)) {
        buttonRef.current.removeChild(particleContainer);
      }
    }, 300);
  };

  return (
    <Button
      ref={buttonRef}
      onClick={handleClick}
      className={`feedback-button ${className || ''}`}
      {...props}
    >
      {children}
    </Button>
  );
};

export default FeedbackButton;