import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { StepProvider } from './context/StepContext';
import { Analytics } from '@vercel/analytics/react';
import Routes from './Routes';
import GoogleAnalytics from './components/GoogleAnalytics';
import './config/firebase'; // Initialize Firebase
import Layout from './components/Layout';
import { useState, useEffect } from 'react';
import { Box } from '@mui/material';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add a small delay to ensure smooth loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
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
          <GoogleAnalytics />
          <Layout>
            <Routes />
          </Layout>
          <Analytics />
        </StepProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
