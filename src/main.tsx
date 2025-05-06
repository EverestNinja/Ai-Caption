import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './components/Footer/footer-fixes.css'

// Enhanced mobile compatibility fixes
const fixMobileViewport = () => {
  // Set viewport height for mobile browsers (iOS Safari fix)
  const setViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  
  // Enhanced iOS fixes
  document.addEventListener('touchend', () => {}, { passive: true });
  document.addEventListener('touchstart', () => {}, { passive: true });
  document.addEventListener('touchmove', (e) => {
    // Only prevent default for overlay element
    if ((e.target as Element).closest('.mobile-overlay')) {
      e.preventDefault();
    }
  }, { passive: false });
  
  // Fix for proper height calculation
  window.addEventListener('resize', () => {
    setViewportHeight();
    // Fix known iOS rendering issues after resize
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const bodyStyle = document.body.style;
      bodyStyle.overflow = 'hidden';
      bodyStyle.height = '100%';
      setTimeout(() => {
        bodyStyle.height = '';
        bodyStyle.overflow = '';
        window.scrollTo(0, scrollY);
      }, 10);
    });
  });
  
  // Better handling for orientation change
  window.addEventListener('orientationchange', () => {
    // Add a longer delay for orientation changes on iOS
    setTimeout(() => {
      setViewportHeight();
      // Force refresh page layout to fix rendering glitches
      document.body.style.display = 'none';
      document.body.offsetHeight; // Trigger reflow
      document.body.style.display = '';
      
      // Ensure sidebar position is correct after orientation change
      const sidebar = document.querySelector('nav');
      if (sidebar) {
        sidebar.style.transition = 'none';
        setTimeout(() => {
          sidebar.style.transition = '';
        }, 100);
      }
      
      // Re-calculate safe area insets for notched devices
      if (window.CSS && CSS.supports('padding-top: env(safe-area-inset-top)')) {
        document.documentElement.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)');
        document.documentElement.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
      }
    }, 250);
  });
  
  // Initialize the viewport height
  setViewportHeight();
  
  // Apply device-specific fixes
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
  if (isIOS) {
    // iOS-specific fixes
    document.documentElement.style.setProperty('-webkit-overflow-scrolling', 'touch');
    
    // Fix iOS menu scrolling issues with body-scroll-lock technique
    const toggleBodyScrollLock = (isLocked: boolean) => {
      if (isLocked) {
        // Save current scroll position
        const scrollY = window.scrollY;
        // Apply fixed positioning with current scroll position
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.height = '100%';
      } else {
        // Restore scroll position
        const scrollY = parseInt(document.body.style.top || '0') * -1;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.height = '';
        window.scrollTo(0, scrollY);
      }
    };
    
    // Observer to detect menu-open class changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isMenuOpen = document.body.classList.contains('menu-open');
          toggleBodyScrollLock(isMenuOpen);
        }
      });
    });
    
    // Start observing the body element
    observer.observe(document.body, { attributes: true });
    
    // Fix for iOS safe area insets
    const updateSafeAreaInsets = () => {
      if (window.CSS && CSS.supports('padding-top: env(safe-area-inset-top)')) {
        document.documentElement.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)');
        document.documentElement.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
        document.documentElement.style.setProperty('--safe-area-inset-left', 'env(safe-area-inset-left)');
        document.documentElement.style.setProperty('--safe-area-inset-right', 'env(safe-area-inset-right)');
      }
    };
    
    updateSafeAreaInsets();
  }
  
  // Android-specific fixes
  const isAndroid = /Android/.test(navigator.userAgent);
  if (isAndroid) {
    // Fix for Android hiding address bar
    const fixAndroidHeight = () => {
      document.documentElement.style.height = 'initial';
      setTimeout(() => {
        const viewheight = window.innerHeight;
        const viewwidth = window.innerWidth;
        const viewport = document.querySelector('meta[name=viewport]') as HTMLMetaElement | null;
        if (viewport) {
          viewport.setAttribute('content', `height=${viewheight}px, width=${viewwidth}px, initial-scale=1.0`);
        }
        setTimeout(() => {
          document.documentElement.style.height = '100%';
        }, 100);
      }, 300);
    };
    
    // Apply Android fixes
    fixAndroidHeight();
    window.addEventListener('resize', fixAndroidHeight);
  }
};

// Mobile detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Apply mobile-specific fixes
if (isMobile) {
  fixMobileViewport();
  
  // Ensure meta viewport is correctly set
  let metaViewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;
  if (!metaViewport) {
    metaViewport = document.createElement('meta');
    metaViewport.name = 'viewport';
    document.head.appendChild(metaViewport);
  }
  
  // Set optimal viewport settings for both iOS and Android
  metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
