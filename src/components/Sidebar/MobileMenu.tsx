import React, { memo } from 'react';
import './Sidebar.css';
import './SidebarTheme.css';
import themeColors from '../../utils/themeColors';

interface MobileMenuProps {
  toggleSidebar: () => void;
  isOpen: boolean;
}

// Using memo to prevent unnecessary re-renders
const MobileMenu: React.FC<MobileMenuProps> = memo(({ toggleSidebar, isOpen }) => {
  return (
    <div 
      className={`mobile-hamburger ${isOpen ? 'open' : ''}`}
      onClick={(e) => {
        e.stopPropagation(); // Prevent event bubbling
        toggleSidebar();
      }}
      aria-label="Menu"
      style={{
        transition: themeColors.transition.timing
      }}
    >
      <div className="hamburger-lines">
        <span className="line line1"></span>
        <span className="line line2"></span>
        <span className="line line3"></span>
      </div>
    </div>
  );
});

// Add display name for debugging
MobileMenu.displayName = 'MobileMenu';

export default MobileMenu; 