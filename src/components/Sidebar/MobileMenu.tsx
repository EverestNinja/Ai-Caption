import React, { memo, useCallback } from 'react';
import './Sidebar.css';
import './SidebarTheme.css';
import themeColors from '../../utils/themeColors';

interface MobileMenuProps {
  toggleSidebar: () => void;
  isOpen: boolean;
}

// Using memo to prevent unnecessary re-renders
const MobileMenu: React.FC<MobileMenuProps> = memo(({ toggleSidebar, isOpen }) => {
  // Create a memoized handler to prevent event bubbling issues
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    // Stop propagation to prevent it from reaching document or other elements
    e.stopPropagation();
    // Prevent the default behavior
    e.preventDefault();
    // Ensure the button doesn't lose focus immediately
    e.currentTarget.focus();
    // Add a small delay to ensure the event is fully processed before toggling
    setTimeout(() => {
      toggleSidebar();
    }, 10);
  }, [toggleSidebar]);

  return (
    <button 
      className={`mobile-hamburger ${isOpen ? 'open' : ''}`}
      onClick={handleClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      aria-controls="main-navigation"
      style={{
        transition: themeColors.transition.timing
      }}
    >
      <div 
        className="hamburger-lines" 
        aria-hidden="true"
        onClick={(e) => e.stopPropagation()} // Additional safety to prevent bubbling
      >
        <span className="line line1"></span>
        <span className="line line2"></span>
        <span className="line line3"></span>
      </div>
    </button>
  );
});

// Add display name for debugging
MobileMenu.displayName = 'MobileMenu';

export default MobileMenu; 