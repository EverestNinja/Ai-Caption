import { Global, css } from '@emotion/react';
import { animationStyles } from '../utils/feedbackUtils';

const GlobalStyles = () => {
  return (
    <Global
      styles={css`
        /* Import animation styles from feedbackUtils */
        ${animationStyles}
        
        /* Additional global styles for feedback buttons */
        .feedback-button {
          position: relative;
          overflow: visible;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        /* Ensure particles are displayed properly */
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
          box-shadow: 0 0 2px rgba(255, 255, 255, 0.6);
        }
        
        /* Custom particle for key actions */
        .star-particle {
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
        }
      `}
    />
  );
};

export default GlobalStyles;