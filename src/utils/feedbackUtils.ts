import { useEffect, useState } from 'react';

// Animation types
type AnimationType = 'scale' | 'glow' | 'colorBurst' | 'ripple' | 'bounce';

// Sound files
const SOUND_FILES = {
  chime: '/sounds/chime.mp3',
  coin: '/sounds/coin.mp3',
  typewriter: '/sounds/typewriter.mp3',
  pop: '/sounds/pop.mp3',
  sparkle: '/sounds/sparkle.mp3',
  penScratch: '/sounds/pen-scratch.mp3',
  tinyApplause: '/sounds/tiny-applause.mp3',
  crystalTap: '/sounds/crystal-tap.mp3',
};

// Preload sounds
const soundBank: { [key: string]: HTMLAudioElement } = {};

// Initialize sound bank
export const initSoundBank = () => {
  Object.entries(SOUND_FILES).forEach(([name, path]) => {
    const audio = new Audio(path);
    audio.preload = 'auto';
    audio.volume = 0.4; // Default volume at 40%
    soundBank[name] = audio;
  });
};

// Get random animation type
export const getRandomAnimation = (): AnimationType => {
  const animations: AnimationType[] = ['scale', 'glow', 'colorBurst', 'ripple', 'bounce'];
  return animations[Math.floor(Math.random() * animations.length)];
};

// Get random sound
export const getRandomSound = (): string => {
  const sounds = Object.keys(SOUND_FILES);
  return sounds[Math.floor(Math.random() * sounds.length)];
};

// Play sound with frequency control
export const playSound = (isKeyAction: boolean = false) => {
  // Skip sound if settings disable it
  const soundsEnabled = localStorage.getItem('soundsEnabled') !== 'false';
  if (!soundsEnabled) return;

  // Check if we should play sound based on frequency
  const shouldPlay = isKeyAction || Math.random() < 0.3; // 30% chance for regular actions
  if (!shouldPlay) return;

  // Get volume from settings or use default
  const volume = parseFloat(localStorage.getItem('soundVolume') || '0.4');
  
  // Get a random sound
  const sound = getRandomSound();
  
  // Check if any sound is currently playing
  const isAnyPlaying = Object.values(soundBank).some(audio => !audio.paused);
  if (isAnyPlaying) return;
  
  // Play the sound
  if (soundBank[sound]) {
    soundBank[sound].volume = volume;
    soundBank[sound].currentTime = 0;
    soundBank[sound].play().catch(e => console.error("Error playing sound:", e));
  }
};

// Trigger haptic feedback on mobile devices
export const triggerHaptic = (isKeyAction: boolean = false) => {
  if (!isKeyAction) return;
  if ('vibrate' in navigator) {
    navigator.vibrate(50); // 50ms vibration
  }
};

// Custom hook for button feedback
export const useButtonFeedback = () => {
  const [animationClass, setAnimationClass] = useState<string>('');
  const [animationKey, setAnimationKey] = useState<number>(0);

  useEffect(() => {
    initSoundBank();
  }, []);

  const triggerFeedback = (e: React.MouseEvent, isKeyAction: boolean = false) => {
    // Animations enabled check
    const animationsEnabled = localStorage.getItem('animationsEnabled') !== 'false';
    
    if (animationsEnabled) {
      // Generate a new animation key to force re-render
      setAnimationKey(prev => prev + 1);
      
      // Get random animation
      const animation = getRandomAnimation();
      setAnimationClass(animation);
      
      // Reset animation class after animation completes
      setTimeout(() => {
        setAnimationClass('');
      }, 300);
    }
    
    // Play sound with frequency control
    playSound(isKeyAction);
    
    // Trigger haptic feedback for key actions
    triggerHaptic(isKeyAction);
  };

  return { 
    triggerFeedback, 
    animationClass, 
    animationKey 
  };
};

// Animation CSS classes (will be imported in button components)
export const animationStyles = `
  @keyframes scaleAnimation {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  
  @keyframes glowAnimation {
    0% { box-shadow: 0 0 0 rgba(64, 93, 230, 0); }
    50% { box-shadow: 0 0 10px rgba(64, 93, 230, 0.6); }
    100% { box-shadow: 0 0 0 rgba(64, 93, 230, 0); }
  }
  
  @keyframes colorBurstAnimation {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes bounceAnimation {
    0% { transform: translateY(0); }
    40% { transform: translateY(-6px); }
    60% { transform: translateY(-3px); }
    80% { transform: translateY(-1px); }
    100% { transform: translateY(0); }
  }
  
  .scale {
    animation: scaleAnimation 0.2s ease forwards;
  }
  
  .glow {
    animation: glowAnimation 0.3s ease forwards;
  }
  
  .colorBurst {
    background-size: 200% 200%;
    animation: colorBurstAnimation 0.4s ease forwards;
  }
  
  .bounce {
    animation: bounceAnimation 0.3s ease forwards;
  }
  
  .ripple {
    position: relative;
    overflow: hidden;
  }
  
  .ripple::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.4s linear;
    top: var(--y, 0);
    left: var(--x, 0);
    transform-origin: center;
    pointer-events: none;
  }
  
  @keyframes ripple {
    to {
      transform: scale(2.5);
      opacity: 0;
    }
  }
`;