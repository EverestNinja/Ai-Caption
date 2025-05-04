import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SidebarContextProps {
  isExpanded: boolean;
  sidebarWidth: number;
  collapsedWidth: number;
  expandedWidth: number;
}

const SidebarContext = createContext<SidebarContextProps>({
  isExpanded: false,
  sidebarWidth: 52,
  collapsedWidth: 52,
  expandedWidth: 270
});

export const useSidebar = () => useContext(SidebarContext);

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  // Initialize isExpanded state from localStorage, defaulting to false (closed)
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    const savedState = localStorage.getItem('sidebarExpanded');
    return savedState !== null ? JSON.parse(savedState) : false;
  });
  
  // Sidebar width constants from CSS
  const collapsedWidth = 52; // 3.25rem in pixels (--collapsed in sidebar.css)
  const expandedWidth = 270; // 16.875rem in pixels (--expanded in sidebar.css)
  
  // Current width based on expansion state
  const sidebarWidth = isExpanded ? expandedWidth : collapsedWidth;

  // Monitor checkbox changes
  useEffect(() => {
    const checkSidebarState = () => {
      // Get the checkbox that controls sidebar expansion
      const sidebarCheckbox = document.getElementById('checkbox-input') as HTMLInputElement;
      if (sidebarCheckbox) {
        const isChecked = sidebarCheckbox.checked;
        if (isChecked !== isExpanded) {
          setIsExpanded(isChecked);
          localStorage.setItem('sidebarExpanded', JSON.stringify(isChecked));
        }
      }
    };

    // Initial sync with checkbox
    setTimeout(() => {
      const sidebarCheckbox = document.getElementById('checkbox-input') as HTMLInputElement;
      if (sidebarCheckbox) {
        sidebarCheckbox.checked = isExpanded;
      }
    }, 100);

    // Set up a mutation observer to watch for checkbox changes
    const observer = new MutationObserver(checkSidebarState);
    const sidebarElement = document.querySelector('.vertical-sidebar');
    
    if (sidebarElement) {
      observer.observe(sidebarElement, { 
        attributes: true, 
        attributeFilter: ['class'],
        childList: true,
        subtree: true
      });
    }

    // Listen for custom events from Sidebar component
    const handleSidebarStateChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.isExpanded !== undefined) {
        setIsExpanded(customEvent.detail.isExpanded);
      }
    };

    // Additional event listener for direct checkbox changes
    document.addEventListener('change', checkSidebarState);
    document.addEventListener('sidebarStateChanged', handleSidebarStateChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('change', checkSidebarState);
      document.removeEventListener('sidebarStateChanged', handleSidebarStateChange);
    };
  }, [isExpanded]);

  return (
    <SidebarContext.Provider value={{ isExpanded, sidebarWidth, collapsedWidth, expandedWidth }}>
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarProvider; 