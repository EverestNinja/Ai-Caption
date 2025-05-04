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
    body.classList.add('dark-theme');
    body.style.backgroundColor = '#121212';
    body.style.color = '#ffffff';
  } else {
    root.classList.remove('dark-mode');
    body.classList.remove('dark-theme');
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

  // Set mounted state when component mounts
  useEffect(() => {
    setMounted(true);
    
    // Add a failsafe to ensure theme is applied correctly 
    // even after navigation
    const currentTheme = localStorage.getItem('theme');
    const shouldBeDark = currentTheme === 'dark';
    
    // Force reapply theme on navigation
    applyTheme(shouldBeDark);
    
    // Ensure state matches stored value
    if (shouldBeDark !== isDarkMode) {
      setIsDarkMode(shouldBeDark);
    }
  }, []);

  // Save theme to localStorage and apply changes when theme changes
  useEffect(() => {
    if (!mounted) return;

    try {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
      applyTheme(isDarkMode);
      
      // Dispatch event to notify other components about theme change
      window.dispatchEvent(new CustomEvent('themeChanged', { 
        detail: { isDarkMode } 
      }));
    } catch (e) {
      console.warn('Error saving theme:', e);
    }
  }, [isDarkMode, mounted]);
  
  // Listen for storage events to keep theme in sync across tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        const newIsDarkMode = e.newValue === 'dark';
        if (newIsDarkMode !== isDarkMode) {
          setIsDarkMode(newIsDarkMode);
          applyTheme(newIsDarkMode);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

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