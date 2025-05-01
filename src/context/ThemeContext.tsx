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

// Apply theme to document
const applyTheme = (isDark: boolean) => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const body = document.body;

  if (isDark) {
    root.classList.add('dark-mode');
    body.style.backgroundColor = '#121212';
    body.style.color = '#ffffff';
  } else {
    root.classList.remove('dark-mode');
    body.style.backgroundColor = '#ffffff';
    body.style.color = '#121212';
  }
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const initialTheme = getInitialTheme();
    // Apply theme immediately during initialization
    applyTheme(initialTheme);
    return initialTheme;
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    try {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
      applyTheme(isDarkMode);
    } catch (e) {
      console.warn('Error saving theme:', e);
    }
  }, [isDarkMode, mounted]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Return early with a proper loading state
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    );
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