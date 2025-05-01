import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { StepProvider } from './context/StepContext';
import { Analytics } from '@vercel/analytics/react';
import Routes from './Routes';
import GoogleAnalytics from './components/GoogleAnalytics';
import './config/firebase'; // Initialize Firebase
import Layout from './components/Layout';

const App = () => {
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
