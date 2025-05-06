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
    // Add a longer delay for orientation changes to ensure proper height calculation
    setTimeout(setViewportHeight, 250);
  });
  
  // Fix for iOS scroll position reset on orientation change
  window.addEventListener('orientationchange', () => {
    // Force redraw of the entire page
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
  });
  
  // Initialize the viewport height
  setViewportHeight();
  
  // Apply iOS-specific fixes
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
  if (isIOS) {
    // Fix for iOS momentum scrolling issues
    document.documentElement.style.setProperty('-webkit-overflow-scrolling', 'touch');
    
    // Fix for iOS sidebar scroll issues
    const preventTouchMove = (e: TouchEvent) => {
      if ((e.target as HTMLElement).closest('.mobile-overlay')) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('touchmove', preventTouchMove, { passive: false });
    
    // Update safe area insets when available
    const updateSafeAreaInsets = () => {
      // iOS 11.2+ safe area handling
      if (window.CSS && CSS.supports('padding-top: env(safe-area-inset-top)')) {
        document.documentElement.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)');
        document.documentElement.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
      }
    };
    
    updateSafeAreaInsets();
  }
};

// Mobile detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Apply mobile-specific fixes
if (isMobile) {
  fixMobileViewport();
  
  // Fix for Android mobile viewport issues
  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
  document.getElementsByTagName('head')[0].appendChild(meta);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
