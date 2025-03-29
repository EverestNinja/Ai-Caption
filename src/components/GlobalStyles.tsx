import { Global, css } from '@emotion/react';

const GlobalStyles = () => {
  return (
    <Global
      styles={css`
        /* Animation keyframes */
        @keyframes scaleAnimation {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        @keyframes glowAnimation {
          0% { box-shadow: 0 0 0 rgba(64, 93, 230, 0); }
          50% { box-shadow: 0 0 15px rgba(64, 93, 230, 0.6); }
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
        
        @keyframes rippleAnimation {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        
        /* Animation classes */
        .scale {
          animation: scaleAnimation 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        .glow {
          animation: glowAnimation 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        .colorBurst {
          background-size: 200% 200% !important;
          background-image: linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #5851DB, #405DE6) !important;
          animation: colorBurstAnimation 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        .bounce {
          animation: bounceAnimation 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        .ripple {
          position: relative !important;
          overflow: hidden !important;
        }
        
        .ripple::after {
          content: "" !important;
          display: block !important;
          position: absolute !important;
          width: 100% !important;
          height: 100% !important;
          background: rgba(255, 255, 255, 0.3) !important;
          border-radius: 50% !important;
          transform: scale(0) !important;
          animation: rippleAnimation 0.4s linear !important;
          top: var(--y, 50%) !important;
          left: var(--x, 50%) !important;
          transform-origin: center !important;
          pointer-events: none !important;
          z-index: 9999 !important;
        }
      `}
    />
  );
};

export default GlobalStyles;