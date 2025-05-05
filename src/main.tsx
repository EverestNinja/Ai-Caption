import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './components/Footer/footer-fixes.css'

// Mobile compatibility fixes
const fixMobileViewport = () => {
  // Set viewport height for mobile browsers (iOS Safari fix)
  const setViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  
  // Fix iOS sticky hover effect
  document.addEventListener('touchend', () => {}, { passive: true });
  
  // Fix iOS delayed click
  document.addEventListener('touchstart', () => {}, { passive: true });
  
  // Fix mobile viewport height on resize and orientation change
  window.addEventListener('resize', setViewportHeight);
  window.addEventListener('orientationchange', () => {
    setTimeout(setViewportHeight, 150);
  });
  
  // Initialize the viewport height
  setViewportHeight();
};

// Mobile detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Apply mobile-specific fixes
if (isMobile) {
  fixMobileViewport();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
