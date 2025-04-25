import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { StepProvider } from './context/StepContext';
import { Analytics } from '@vercel/analytics/react';
import Routes from './Routes';
import GoogleAnalytics from './components/GoogleAnalytics';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <StepProvider>
          <GoogleAnalytics />
          <Routes />
          <Analytics />
        </StepProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
