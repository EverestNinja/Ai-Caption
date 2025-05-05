// Common theme colors for consistent styling across all pages
export const themeColors = {
  // Light mode colors
  light: {
    background: '#bdb3fa', // Lilac color for light mode background
    textPrimary: '#121212',
    textSecondary: 'rgba(0,0,0,0.7)',
    cardBackground: 'rgba(255,255,255,0.8)',
    overlay: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
    inputBackground: '#ffffff',
    inputBackgroundHover: '#F9FAFB',
    inputBorder: '#D0D5DD',
    inputBorderHover: '#B9BEC7',
    disabledBackground: '#E9D7FE',
    disabledText: '#ffffff',
    
    // Sidebar specific colors
    sidebar: {
      background: '#cfcaee', // Updated to lighter lilac color
      hoverBackground: 'rgba(255, 255, 255, 0.2)',
      activeBackground: 'rgba(255, 255, 255, 0.3)',
      activeBorder: '#ffffff',
      textColor: '#121212',
      iconColor: '#333333',
      divider: 'rgba(0,0,0,0.1)'
    },
    
    // Footer specific colors
    footer: {
      background: '#cfcaee', // Updated to lighter lilac color
      textColor: '#121212',
      linkColor: '#405DE6',
      borderColor: 'rgba(0,0,0,0.1)'
    }
  },
  
  // Dark mode colors
  dark: {
    background: 'linear-gradient(135deg, #121212 0%, #1e1e2d 100%)', // Match Generation page
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255,255,255,0.7)',
    cardBackground: 'rgba(30,30,45,0.6)',
    overlay: 'radial-gradient(circle at 50% 50%, rgba(64, 93, 230, 0.15) 0%, rgba(131, 58, 180, 0.08) 50%, transparent 100%)',
    inputBackground: '#2d2d3d',
    inputBackgroundHover: '#33333f',
    inputBorder: '#41415e',
    inputBorderHover: '#5c5c7c',
    disabledBackground: '#444461',
    disabledText: 'rgba(255,255,255,0.6)',
    
    // Sidebar specific colors
    sidebar: {
      background: '#121218',
      hoverBackground: '#25252e',
      activeBackground: 'rgba(189, 179, 250, 0.15)',
      activeBorder: '#bdb3fa',
      textColor: '#ffffff',
      iconColor: '#dddddd',
      divider: 'rgba(255,255,255,0.1)'
    },
    
    // Footer specific colors
    footer: {
      background: 'linear-gradient(180deg, #121212 0%, #1e1e2d 100%)',
      textColor: '#ffffff',
      linkColor: '#bdb3fa',
      borderColor: 'rgba(255,255,255,0.1)'
    }
  },
  
  // Common transition values
  transition: {
    timing: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    properties: 'background, color, border-color, box-shadow, transform, opacity, filter'
  },
  
  // Common accent/primary colors
  primary: '#405DE6',
  secondary: '#833AB4',
  accent: '#bdb3fa',
  
  // Common gradients
  gradients: {
    primary: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
    secondary: 'linear-gradient(45deg, #833AB4, #5851DB, #405DE6)',
    purple: 'linear-gradient(45deg, #bdb3fa, #a097e3, #867ad0)',
  }
};

/**
 * Applies the themeColors to CSS variables and document styles
 * @param isDarkMode - Whether dark mode is active
 */
export const applyTheme = (isDarkMode: boolean) => {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  const body = document.body;
  
  // Helper function to set CSS variables more concisely
  const setCSSVar = (name: string, value: string) => {
    root.style.setProperty(name, value);
  };
  
  // Set sidebar CSS variables
  const sidebarVars = {
    '--theme-sidebar-bg': themeColors.light.sidebar.background,
    '--theme-sidebar-hover': themeColors.light.sidebar.hoverBackground,
    '--theme-sidebar-active': themeColors.light.sidebar.activeBackground,
    '--theme-sidebar-active-border': themeColors.light.sidebar.activeBorder,
    '--theme-sidebar-text': themeColors.light.sidebar.textColor,
    '--theme-sidebar-icon': themeColors.light.sidebar.iconColor,
    '--theme-sidebar-active-text': themeColors.accent,
    
    '--theme-sidebar-bg-dark': themeColors.dark.sidebar.background,
    '--theme-sidebar-hover-dark': themeColors.dark.sidebar.hoverBackground,
    '--theme-sidebar-active-dark': themeColors.dark.sidebar.activeBackground,
    '--theme-sidebar-active-border-dark': themeColors.dark.sidebar.activeBorder,
    '--theme-sidebar-text-dark': themeColors.dark.sidebar.textColor,
    '--theme-sidebar-icon-dark': themeColors.dark.sidebar.iconColor,
    '--theme-sidebar-active-text-dark': themeColors.accent,
    
    '--theme-transition': `${themeColors.transition.properties} ${themeColors.transition.timing}`
  };
  
  // Apply all CSS variables
  Object.entries(sidebarVars).forEach(([name, value]) => {
    setCSSVar(name, value);
  });

  // Apply theme to document body
  if (isDarkMode) {
    root.classList.add('dark-mode');
    body.classList.add('dark-theme');
    body.style.background = themeColors.dark.background;
    body.style.color = themeColors.dark.textPrimary;
  } else {
    root.classList.remove('dark-mode');
    body.classList.remove('dark-theme');
    body.style.background = themeColors.light.background;
    body.style.color = themeColors.light.textPrimary;
  }
};

export default themeColors; 