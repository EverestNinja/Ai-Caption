import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Analytics } from '@vercel/analytics/react';
import Routes from './Routes';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes />
        <Analytics />
      </Router>
    </ThemeProvider>
  );
};

export default App;
