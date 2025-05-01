import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

// Get initial theme from localStorage or system preference
const getInitialTheme = () => {
  if (typeof window === 'undefined') return false;
  
  try {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch (e) {
    console.warn('Error accessing localStorage:', e);
    return false;
  }
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDarkMode(getInitialTheme());
  }, []);

  useEffect(() => {
    if (!mounted) return;

    try {
      // Save theme preference to localStorage
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
      
      // Apply theme to document
      if (isDarkMode) {
        document.documentElement.classList.add('dark-mode');
        document.body.style.backgroundColor = '#121212';
        document.body.style.color = '#ffffff';
      } else {
        document.documentElement.classList.remove('dark-mode');
        document.body.style.backgroundColor = '#ffffff';
        document.body.style.color = '#121212';
      }
    } catch (e) {
      console.warn('Error saving theme:', e);
    }
  }, [isDarkMode, mounted]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 