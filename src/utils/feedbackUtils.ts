import { useEffect, useState } from 'react';

// Animation types
type AnimationType = 'scale' | 'glow' | 'colorBurst' | 'ripple' | 'bounce';

// Sound files
const SOUND_FILES = {
  chime: '/sounds/chime.wav',
  coin: '/sounds/coin.wav',
  typewriter: '/sounds/typewriter.wav',
  pop: '/sounds/pop.wav',
  sparkle: '/sounds/sparkle.wav',
  penScratch: '/sounds/pen-scratch.wav',
  tinyApplause: '/sounds/tiny-applause.wav',
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

// Get random animation type, with different weighting based on action importance
export const getRandomAnimation = (isKeyAction: boolean = false): AnimationType => {
  const animations: AnimationType[] = ['scale', 'glow', 'colorBurst', 'ripple', 'bounce'];
  
  // For key actions, prefer more noticeable animations
  if (isKeyAction) {
    // Higher chance of colorBurst or bounce for key actions (more visually rewarding)
    const keyActionAnimations = ['colorBurst', 'bounce', 'colorBurst', 'bounce', 'glow'];
    return keyActionAnimations[Math.floor(Math.random() * keyActionAnimations.length)] as AnimationType;
  }
  
  // For regular actions, use any of the animations with equal probability
  return animations[Math.floor(Math.random() * animations.length)];
};

// Get random sound, with preferences based on action type
export const getRandomSound = (isKeyAction: boolean = false): string => {
  // All available sounds
  const allSounds = Object.keys(SOUND_FILES);
  
  if (isKeyAction) {
    // For key actions, prefer more rewarding sounds
    const keyActionSounds = ['chime', 'sparkle', 'coin', 'tinyApplause', 'crystalTap'];
    return keyActionSounds[Math.floor(Math.random() * keyActionSounds.length)];
  } else {
    // For secondary actions, prefer subtle sounds
    const secondarySounds = ['typewriter', 'pop', 'penScratch', 'typewriter', 'pop'];
    return secondarySounds[Math.floor(Math.random() * secondarySounds.length)];
  }
};

// Play sound with frequency control
export const playSound = (isKeyAction: boolean = false) => {
  // Skip sound if settings disable it
  const soundsEnabled = localStorage.getItem('soundsEnabled') !== 'false';
  if (!soundsEnabled) return;

  // Check if we should play sound based on frequency
  // Key actions: 100% chance
  // Regular actions: 20-30% chance (using 25%)
  const shouldPlay = isKeyAction || Math.random() < 0.25;
  if (!shouldPlay) return;

  // Get volume from settings or use default
  const volume = parseFloat(localStorage.getItem('soundVolume') || '0.4');
  
  // Get an appropriate sound for the action type
  const sound = getRandomSound(isKeyAction);
  
  // Check if any sound is currently playing
  const isAnyPlaying = Object.values(soundBank).some(audio => !audio.paused);
  if (isAnyPlaying) return; // Skip if another sound is playing to avoid overlap
  
  // Play the sound
  if (soundBank[sound]) {
    // Apply fade-out effect for a polished feel
    const audio = soundBank[sound];
    audio.volume = volume;
    audio.currentTime = 0;
    
    // Play with fade-out
    audio.play()
      .then(() => {
        // Fade out at the end (last 50ms)
        const fadeStartTime = audio.duration - 0.05;
        const fadeInterval = setInterval(() => {
          if (audio.currentTime >= fadeStartTime) {
            if (audio.volume > 0.05) {
              audio.volume = Math.max(0, audio.volume - 0.05);
            } else {
              clearInterval(fadeInterval);
            }
          }
        }, 5);
        
        // Clear interval if audio ends or is stopped
        audio.addEventListener('ended', () => clearInterval(fadeInterval), { once: true });
        audio.addEventListener('pause', () => clearInterval(fadeInterval), { once: true });
      })
      .catch(e => console.error("Error playing sound:", e));
  }
};

// Trigger haptic feedback on mobile devices
export const triggerHaptic = (isKeyAction: boolean = false) => {
  if (!isKeyAction) return;
  
  // Only trigger haptic on key actions and if supported
  if ('vibrate' in navigator) {
    navigator.vibrate(50); // 50ms vibration for a "tap reward" feel
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
      const animation = getRandomAnimation(isKeyAction);
      setAnimationClass(animation);
      
      // Reset animation class after animation completes
      setTimeout(() => {
        setAnimationClass('');
      }, 200); // Faster duration for snappier feedback
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

// Animation CSS classes (will be imported in global styles)
export const animationStyles = `
  /* Button animations */
  @keyframes scaleAnimation {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  
  @keyframes glowAnimation {
    0% { box-shadow: 0 0 0 rgba(64, 93, 230, 0); }
    50% { box-shadow: 0 0 10px rgba(64, 93, 230, 0.3); }
    100% { box-shadow: 0 0 0 rgba(64, 93, 230, 0); }
  }
  
  @keyframes colorBurstAnimation {
    0% { background-position: 0% 50%; background-image: linear-gradient(45deg, rgba(64, 93, 230, 0.5), rgba(88, 81, 219, 0.5), rgba(131, 58, 180, 0.5)); }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; background-image: none; }
  }
  
  @keyframes bounceAnimation {
    0% { transform: translateY(0); }
    40% { transform: translateY(-4px); }
    60% { transform: translateY(-2px); }
    80% { transform: translateY(-1px); }
    100% { transform: translateY(0); }
  }
  
  /* Particle animation */
  @keyframes particle-fade {
    0% { opacity: 0.8; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(0); }
  }
  
  /* Animation classes */
  .scale {
    animation: scaleAnimation 0.2s ease forwards;
  }
  
  .glow {
    animation: glowAnimation 0.2s ease forwards;
  }
  
  .colorBurst {
    background-size: 200% 200%;
    animation: colorBurstAnimation 0.2s ease forwards;
  }
  
  .bounce {
    animation: bounceAnimation 0.2s ease forwards;
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
    animation: ripple 0.3s linear;
    top: var(--y, 0);
    left: var(--x, 0);
    transform-origin: center;
    pointer-events: none;
  }
  
  @keyframes ripple {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }
  
  /* Particle styling */
  .particle-container {
    position: absolute;
    pointer-events: none;
    z-index: 1000;
  }
  
  .particle {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    pointer-events: none;
  }
`;