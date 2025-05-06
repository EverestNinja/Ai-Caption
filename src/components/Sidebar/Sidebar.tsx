import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Sidebar.css';
import './SidebarTheme.css';
import glocapLogo from '../../assets/Glocap.png';
import { useTheme } from '../../context/ThemeContext';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { applyTheme } from '../../utils/themeColors';

type SidebarLinkProps = {
  to: string;
  tooltip: string;
  icon: React.ReactNode;
  text: string;
};

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, tooltip, icon, text }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const isMobile = window.innerWidth <= 768;
  const linkRef = useRef<HTMLAnchorElement>(null);
  
  return (
    <li className="sidebar__item">
      <Link 
        ref={linkRef}
        to={to} 
        className={`sidebar__link ${isActive ? 'active' : ''}`} 
        data-tooltip={tooltip}
        onClick={(e) => {
          // Add a small delay for visual feedback on mobile
          if (isMobile) {
            const target = e.currentTarget;
            target.style.backgroundColor = 'var(--bg--active)';
            setTimeout(() => {
              target.style.backgroundColor = '';
              // Remove focus
              target.blur();
            }, 150);
          } else {
            // Remove focus on desktop too
            e.currentTarget.blur();
          }
        }}
        onMouseDown={(e) => {
          // Prevent default focus behavior on mousedown
          e.preventDefault();
        }}
      >
        <span className="icon">{icon}</span>
        <span className="text">{text}</span>
      </Link>
    </li>
  );
};

type SidebarSectionProps = {
  title: string;
  links: SidebarLinkProps[];
};

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, links }) => {
  return (
    <ul className="sidebar__list">
      <li className="sidebar__item item--heading">
        <h2 className="sidebar__item--heading">{title}</h2>
      </li>
      {links.map((link, index) => (
        <SidebarLink key={index} {...link} />
      ))}
    </ul>
  );
};

interface SidebarProps {
  isOpen?: boolean;
  toggleSidebar?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, toggleSidebar }) => {
  // Use isOpen directly from props for better control
  const { isDarkMode, toggleTheme } = useTheme();
  const [showLogoutPopup, setShowLogoutPopup] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [currentUser, setCurrentUser] = useState(getAuth().currentUser);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  
  // Create a ref for the nav element
  const navRef = useRef<HTMLElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  
  // Get Firebase auth and React Router navigate
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for mobile screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // On desktop, ensure body can scroll
      if (!mobile && document.body.classList.contains('menu-open')) {
        document.body.classList.remove('menu-open');
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  // Memoize overlay click handler to close sidebar
  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Make sure the click is directly on the overlay and not on child elements
    if (e.target !== e.currentTarget) return;
    
    // Make sure we're on mobile and the sidebar is open
    if (isMobile && isOpen && toggleSidebar) {
      // Prevent any event bubbling that might interfere
      e.stopPropagation();
      // Add a small delay to ensure proper event handling
      setTimeout(() => {
        toggleSidebar();
      }, 50);
    }
  }, [isMobile, isOpen, toggleSidebar]);

  // Close sidebar on mobile when navigating to a new page
  useEffect(() => {
    if (isMobile && isOpen && toggleSidebar) {
      toggleSidebar();
    }
  }, [location.pathname, isMobile, isOpen, toggleSidebar]);

  // Update hamburger menu active state when isOpen changes
  useEffect(() => {
    if (isOpen) {
      document.querySelector('.mobile-hamburger')?.classList.add('open');
    } else {
      document.querySelector('.mobile-hamburger')?.classList.remove('open');
    }
  }, [isOpen]);

  // Apply theme colors when the theme changes
  useEffect(() => {
    applyTheme(isDarkMode);
  }, [isDarkMode]);

  const handleLogin = () => {
    // Navigate to login page
    navigate('/login');
    // Close sidebar if on mobile
    if (isMobile && isOpen && toggleSidebar) {
      toggleSidebar();
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowLogoutPopup(false);
      
      // Show success snackbar
      setSnackbarMessage('You have been logged out successfully');
      setSnackbarOpen(true);
      
      // Close sidebar if on mobile
      if (isMobile && isOpen && toggleSidebar) {
        toggleSidebar();
      }
      
      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      setSnackbarMessage('Error signing out. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const toggleLogoutPopup = () => {
    setShowLogoutPopup(!showLogoutPopup);
  };
  
  // Close snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Handle toggle button click on desktop
  const handleDesktopToggle = () => {
    if (toggleSidebar) {
      toggleSidebar();
    }
  };

  // Updated General section links with React Router
  const generalLinks: SidebarLinkProps[] = [
    {
      to: "/",
      tooltip: "Home",
      text: "Home",
      icon: (
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z"/>
          <path d="M2.5 9v5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5V9.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V14a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5V9" />
        </svg>
      )
    },
    {
      to: "/generate",
      tooltip: "Caption Generator",
      text: "Caption Generator",
      icon: (
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
          <path d="M6.854 4.646a.5.5 0 0 1 0 .708L4.207 8l2.647 2.646a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0zm2.292 0a.5.5 0 0 0 0 .708L11.793 8l-2.647 2.646a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708 0z"/>
        </svg>
      )
    },
    {
      to: "/flyer",
      tooltip: "Flyer Generator",
      text: "Flyer Generator",
      icon: (
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
          <path d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0zM7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z"/>
        </svg>
      )
    },
    {
      to: "/publish",
      tooltip: "Publish",
      text: "Publish",
      icon: (
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
        </svg>
      )
    }
  ];

  // Account section links
  const accountLinks: SidebarLinkProps[] = [
    {
      to: "/settings",
      tooltip: "Settings",
      text: "Settings",
      icon: (
        <svg width="16" height="16" fill="currentColor" className="bi bi-gear" viewBox="0 0 16 16">
          <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492a3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
          <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
        </svg>
      )
    }
  ];
          
  return (
    <aside className="vertical-sidebar" ref={sidebarRef}>
      <input 
        type="checkbox" 
        role="switch" 
        id="checkbox-input" 
        className="checkbox-input" 
        checked={isOpen}
        onChange={() => {
          // Prevent the checkbox from directly toggling the sidebar
          // This allows the toggleSidebar function to handle it properly
          if (toggleSidebar) toggleSidebar();
        }}
      />
      {/* Mobile overlay with improved event handling */}
      <div 
        className="mobile-overlay" 
        onClick={handleOverlayClick}
        role="button"
        tabIndex={-1}
        aria-label="Close sidebar"
        onTouchStart={(e) => {
          // Ensure touch events on overlay don't affect the sidebar toggle
          if (e.target === e.currentTarget && isMobile && isOpen) {
            e.stopPropagation();
          }
        }}
      ></div>
      <nav ref={navRef}>
        <header>
          <div className="sidebar__toggle-container">
            <label 
              tabIndex={0} 
              htmlFor="checkbox-input" 
              id="label-for-checkbox-input" 
              className="nav__toggle"
              onClick={handleDesktopToggle}
            >
              <span className="toggle--icons" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" className="toggle-svg-icon toggle--open">
                  <path d="M3 5a1 1 0 1 0 0 2h18a1 1 0 1 0 0-2zM2 12a1 1 0 0 1 1-1h18a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1M2 18a1 1 0 0 1 1-1h18a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1"></path>
                </svg>
                <svg width="24" height="24" viewBox="0 0 24 24" className="toggle-svg-icon toggle--close">
                  <path d="M18.707 6.707a1 1 0 0 0-1.414-1.414L12 10.586 6.707 5.293a1 1 0 0 0-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 1 0 1.414 1.414L12 13.414l5.293 5.293a1 1 0 0 0 1.414-1.414L13.414 12z"></path>
                </svg>
              </span>
            </label>
          </div>
          <figure>
            <img className="glocap-logo" src={glocapLogo} alt="GloCap AI Logo" />
            <figcaption>
              <p className="user-id">GloCap AI</p>
              <p className="user-role">Intelligent Assistant</p>
            </figcaption>
          </figure>
        </header>
        <section className="sidebar__wrapper">
          <SidebarSection title="General" links={generalLinks} />
          <SidebarSection title="Account" links={accountLinks} />
        </section>
        <div className="sidebar__footer">
          <div className="theme-toggle-container" data-tooltip="Theme">
            <span className="theme-icon sun-icon">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
              </svg>
            </span>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={isDarkMode} 
                onChange={toggleTheme} 
                aria-label="Toggle theme"
              />
              <span className="slider"></span>
            </label>
            <span className="theme-icon moon-icon">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
              </svg>
            </span>
          </div>
          
          {/* User Profile Section */}
          {currentUser ? (
            <div 
              className="user-profile" 
              onClick={toggleLogoutPopup}
              data-tooltip={isOpen ? "" : "User Profile"}
            >
              <div className="user-avatar-container">
                <img 
                  src={currentUser.photoURL || "https://randomuser.me/api/portraits/men/32.jpg"} 
                  alt={currentUser.displayName || "User"} 
                  className="user-avatar" 
                />
              </div>
              <div className="user-info">
                <p className="user-name">{currentUser.displayName || "User"}</p>
                <p className="user-email">{currentUser.email || "user@example.com"}</p>
              </div>
              
              {/* Logout Popup */}
              {showLogoutPopup && (
                <div className="logout-popup">
                  <button className="logout-button" onClick={handleLogout}>
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                      <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div 
              className="login-button-container" 
              data-tooltip={isOpen ? "" : "Login"}
              onClick={handleLogin}
            >
              <div className="login-icon">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                  <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                </svg>
              </div>
              {isOpen && (
                <span className="login-text">Login</span>
              )}
            </div>
          )}
        </div>
      </nav>
      
      {/* Snackbar for notifications */}
      {snackbarOpen && (
        <div className={`snackbar ${isDarkMode ? 'dark' : ''}`}>
          {snackbarMessage}
          <button onClick={handleSnackbarClose} className="snackbar-close">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar; 