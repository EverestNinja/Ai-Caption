import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { StepProvider } from './context/StepContext';
import { SidebarProvider } from './context/SidebarContext';
import { Analytics } from '@vercel/analytics/react';
import Routes from './Routes';
import GoogleAnalytics from './components/GoogleAnalytics';
import './config/firebase'; // Initialize Firebase
import Layout from './components/Layout';
import { useState, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import MobileMenu from './components/Sidebar/MobileMenu';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Use useCallback to memoize the toggleSidebar function
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prevState => {
      const newState = !prevState;
      // Update body class only when state changes
      if (isMobile) {
        if (newState) {
          document.body.classList.add('menu-open');
        } else {
          document.body.classList.remove('menu-open');
        }
      }
      return newState;
    });
  }, [isMobile]);
  
  // Handle resize separately from the toggle function
  useEffect(() => {
    // Add a small delay to ensure smooth loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    // Check for mobile screen size
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Close sidebar when switching to mobile
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
        document.body.classList.remove('menu-open');
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [sidebarOpen]); // Only include sidebarOpen as dependency

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
