import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Analytics } from '@vercel/analytics/react';
import Routes from './Routes';
import GoogleAnalytics from './components/GoogleAnalytics';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <GoogleAnalytics />
        <Routes />
        <Analytics />
      </Router>
    </ThemeProvider>
  );
};

export default App;
