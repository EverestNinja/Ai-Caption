import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { StepProvider } from './context/StepContext';
import { SidebarProvider } from './context/SidebarContext';
import { Analytics } from '@vercel/analytics/react';
import Routes from './Routes';
import GoogleAnalytics from './components/GoogleAnalytics';

import Layout from './components/Layout';
import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useAuthStore } from './store/auth';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const session = useAuthStore((state) => state.session);
  console.log(session);
  // Handle resize and viewport height
  useEffect(() => {
    // Set the viewport height variable
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

    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', () => {
      // Add delay for orientation change to ensure accurate measurements
      setTimeout(setViewportHeight, 250);
    });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, []);

  // Debug sidebar state on page load
  useEffect(() => {
    // Check localStorage for sidebar state
    try {
      const sidebarState = localStorage.getItem('sidebarExpanded');
      console.log('Initial sidebar state from localStorage:', sidebarState);

      // Set default if not found
      if (sidebarState === null) {
        localStorage.setItem('sidebarExpanded', 'true');
        console.log('Set default sidebar state to expanded');
      }
    } catch (error) {
      console.error('Error reading sidebar state:', error);
    }
  }, []);

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
            <Layout>
              <Routes session={session} />
            </Layout>
            <Analytics />
          </SidebarProvider>
        </StepProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
