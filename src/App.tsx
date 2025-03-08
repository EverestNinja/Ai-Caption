import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Routes from './Routes';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes />
      </Router>
    </ThemeProvider>
  );
};

export default App;
