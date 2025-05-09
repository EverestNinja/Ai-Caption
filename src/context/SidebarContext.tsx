import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SidebarContextProps {
  isExpanded: boolean;
  sidebarWidth: number;
  collapsedWidth: number;
  expandedWidth: number;
  toggleSidebar: () => void;
  setSidebarExpanded: (expanded: boolean) => void;
}

const SidebarContext = createContext<SidebarContextProps>({
  isExpanded: false,
  sidebarWidth: 52,
  collapsedWidth: 52,
  expandedWidth: 270,
  toggleSidebar: () => {}, // Default empty function
  setSidebarExpanded: () => {} // Default empty function
});

export const useSidebar = () => useContext(SidebarContext);

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  // Initialize isExpanded state from localStorage, defaulting to false (closed)
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    try {
      const savedState = localStorage.getItem('sidebarExpanded');
      return savedState !== null ? JSON.parse(savedState) : false;
    } catch (error) {
      console.error('Error parsing sidebar state from localStorage:', error);
      return false; // Default to collapsed if there's an error
    }
  });
  
  // Sidebar width constants from CSS
  const collapsedWidth = 52; // 3.25rem in pixels (--collapsed in sidebar.css)
  const expandedWidth = 270; // 16.875rem in pixels (--expanded in sidebar.css)
  
  // Current width based on expansion state
  const sidebarWidth = isExpanded ? expandedWidth : collapsedWidth;
  
  // Function to directly set sidebar state
  const setSidebarExpanded = (expanded: boolean) => {
    setIsExpanded(expanded);
    saveStateToLocalStorage(expanded);
    updateDOMElements(expanded);
  };
  
  // Function to toggle sidebar expansion
  const toggleSidebar = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    saveStateToLocalStorage(newState);
    updateDOMElements(newState);
  };
  
  // Helper function to save state to localStorage
  const saveStateToLocalStorage = (state: boolean) => {
    try {
      localStorage.setItem('sidebarExpanded', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving sidebar state to localStorage:', error);
    }
  };
  
  // Helper function to update DOM elements
  const updateDOMElements = (expanded: boolean) => {
    // Update checkbox if it exists
    const checkbox = document.getElementById('checkbox-input') as HTMLInputElement;
    if (checkbox && checkbox.checked !== expanded) {
      checkbox.checked = expanded;
    }
    
    // Dispatch custom event for other components to listen to
    const event = new CustomEvent('sidebarStateChanged', { 
      detail: { isExpanded: expanded }
    });
    document.dispatchEvent(event);
  };

  // Effect to initialize and sync with DOM on mount
  useEffect(() => {
    // Initialize DOM on mount
    updateDOMElements(isExpanded);
    
    // Listen for storage events (for multi-tab consistency)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sidebarExpanded' && e.newValue !== null) {
        try {
          const newState = JSON.parse(e.newValue);
          if (newState !== isExpanded) {
            setIsExpanded(newState);
            updateDOMElements(newState);
          }
        } catch (error) {
          console.error('Error parsing sidebar state from storage event:', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isExpanded]);

  return (
    <SidebarContext.Provider value={{ 
      isExpanded, 
      sidebarWidth, 
      collapsedWidth, 
      expandedWidth,
      toggleSidebar,
      setSidebarExpanded
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarProvider; 