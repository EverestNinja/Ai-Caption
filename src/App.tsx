import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { StepProvider } from './context/StepContext';
import { SidebarProvider } from './context/SidebarContext';
import { Analytics } from '@vercel/analytics/react';
import Routes from './Routes';
import GoogleAnalytics from './components/GoogleAnalytics';
import './config/firebase'; // Initialize Firebase
import Layout from './components/Layout';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Box } from '@mui/material';
import MobileMenu from './components/Sidebar/MobileMenu';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  // Use ref to track toggle state to prevent race conditions
  const toggleInProgress = useRef(false);

  // Enhanced toggleSidebar function for better mobile behavior
  const toggleSidebar = useCallback(() => {
    // Prevent duplicate toggle calls in rapid succession
    if (toggleInProgress.current) return;
    
    toggleInProgress.current = true;
    
    setSidebarOpen(prevState => {
      const newState = !prevState;
      
      // Handle body scrolling when sidebar open/closed
      if (isMobile) {
        if (newState) {
          // Save scroll position before locking for iOS
          if (isIOS) {
            const scrollY = window.scrollY;
            document.body.style.top = `-${scrollY}px`;
          }
          document.body.classList.add('menu-open');
        } else {
          document.body.classList.remove('menu-open');
          // Restore scroll position for iOS
          if (isIOS) {
            const scrollY = parseInt(document.body.style.top || '0') * -1;
            document.body.style.top = '';
            window.scrollTo(0, scrollY);
          }
        }
      }
      
      // Release the lock after a delay to prevent rapid toggling
      setTimeout(() => {
        toggleInProgress.current = false;
      }, 100);
      
      return newState;
    });
  }, [isMobile, isIOS]);
  
  // Handle resize and viewport height
  useEffect(() => {
    // Set the viewport height variable for mobile
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    // Set initial height
    setViewportHeight();
    
    // Add a small delay to ensure smooth loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    // Check for mobile screen size and handle sidebar state
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Close sidebar when switching to mobile view
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
        document.body.classList.remove('menu-open');
        // Restore scroll position for iOS
        if (isIOS) {
          const scrollY = parseInt(document.body.style.top || '0') * -1;
          document.body.style.top = '';
          window.scrollTo(0, scrollY);
        }
      }
      
      // Update viewport height
      setViewportHeight();
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      // Add delay for orientation change to ensure accurate measurements
      setTimeout(setViewportHeight, 250);
    });
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, [sidebarOpen, isIOS]);

  // Clean up menu-open class when component unmounts
  useEffect(() => {
    return () => {
      // Ensure body can scroll when component unmounts
      document.body.classList.remove('menu-open');
      document.body.style.top = '';
    };
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          backgroundColor: '#ffffff',
          margin: 0,
          padding: 0,
        }}
      />
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <StepProvider>
          <SidebarProvider>
            <GoogleAnalytics />
            {isMobile && <MobileMenu toggleSidebar={toggleSidebar} isOpen={sidebarOpen} />}
            <Layout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
              <Routes />
            </Layout>
            <Analytics />
          </SidebarProvider>
        </StepProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
