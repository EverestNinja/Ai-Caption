import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Landing from './Pages/Landing/Landing';
import Generation from './Pages/Generation/Generation';
import Footer from './components/Footer/Footer';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box'
        },
        html: {
          height: '100%',
          width: '100%',
          overflowX: 'hidden'
        },
        body: {
          minHeight: '100vh',
          width: '100%',
          overflowX: 'hidden',
          margin: 0,
          padding: 0
        },
        '#root': {
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          margin: 0,
          padding: 0
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          width: '100%',
          margin: 0,
          padding: 0
        }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/generate" element={<Generation />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
