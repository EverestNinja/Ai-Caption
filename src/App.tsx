import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Analytics } from '@vercel/analytics/react';
import Routes from './Routes';
import { FeedbackProvider } from './context/FeedbackContext';
// import { GlobalStyles } from '@mui/material';
import GlobalStyles from './components/GlobalStyles';
import { PositiveMessageProvider } from './context/PositiveMessageContext';

const App = () => {
  return (
    <ThemeProvider>
      <FeedbackProvider>
        <PositiveMessageProvider>
          <GlobalStyles />
          <Router>
            <Routes />
            <Analytics />
          </Router>
        </PositiveMessageProvider>
      </FeedbackProvider>
    </ThemeProvider>
  );
};

export default App;
