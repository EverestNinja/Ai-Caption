// src/components/Sidebar.tsx
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import './Sidebar.css';
import './SidebarTheme.css';
import glocapLogo from '../../assets/Glocap.png';
import { useTheme } from '../../context/ThemeContext';

import { useNavigate, useLocation, Link } from 'react-router-dom';
import { applyTheme } from '../../utils/themeColors';
import { useSidebar } from '../../context/SidebarContext';
import { useAuthStore } from '../../store/auth';
import { supabase } from '../../lib/supabase';
import { getSubscriptionById } from '../../services/subscriptions';
import { API_URL } from '../../config/const';
import { Button, CircularProgress } from '@mui/material';

type SidebarLinkProps = {
  to: string;
  tooltip: string;
  icon: React.ReactNode;
  text: string;
};

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, tooltip, icon, text }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const linkRef = useRef<HTMLAnchorElement>(null);

  return (
    <li className="sidebar__item">
      <Link
        ref={linkRef}
        to={to}
        className={`sidebar__link ${isActive ? 'active' : ''}`}
        data-tooltip={tooltip}
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


const Sidebar = () => {
  // Theme + Sidebar context
  const { isDarkMode, toggleTheme } = useTheme();
  const { isExpanded, toggleSidebar } = useSidebar();

  // Snackbar / Logout state
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Supabase session from your Zustand store
  const session = useAuthStore((state) => state.session);
  const [currentUser, setCurrentUser] = useState(session?.user ?? null);

  const navigate = useNavigate();
  const navRef = useRef<HTMLElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);

  const [subscription, setSubscription] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  console.log('Subscription:', subscription);
  useEffect(() => {
    setLoadingData(true);
    if (session?.user) {

      // Fetch subscription data if user is logged in
      const fetchSubscription = async () => {
        try {
          // Assuming you have a function to fetch subscription data
          const sub = await getSubscriptionById(session.user.id);
          setSubscription(sub);
          setLoadingData(false);
        } catch (err) {
          setLoadingData(false);
          console.error('Error fetching subscription:', err);
        }
      };
      fetchSubscription();
    }
  }, [session, setLoadingData]);

  // Define sidebar navigation links
  const generalLinks: SidebarLinkProps[] = [
    {
      to: '/',
      tooltip: 'Home',
      icon: (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z" />
          <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6Z" />
        </svg>
      ),
      text: 'Home',
    },
    {
      to: '/generate',
      tooltip: 'Generate Caption',
      icon: (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
          <path d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0zM7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z" />
        </svg>
      ),
      text: 'Generate Caption',
    },
    {
      to: '/flyer',
      tooltip: 'Generate Flyer',
      icon: (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z" />
          <path d="M3 8.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m0-5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5z" />
        </svg>
      ),
      text: 'Generate Flyer',
    },
    {
      to: '/publish',
      tooltip: 'Publish',
      icon: (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path d="M12.5 5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm-2.5.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0v-5zm-3 0a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0v-5z" />
          <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178z" />
        </svg>
      ),
      text: 'Publish',
    },
    {
      to: '/favorites',
      tooltip: 'Favorites',
      icon: (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
        </svg>
      ),
      text: 'Favorites',
    },
  ];

  // Keep checkbox in sync with isExpanded
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.checked = isExpanded;
    }
    document.body.classList.toggle('sidebar-expanded', isExpanded);
    console.log('Sidebar state:', { isExpanded });
  }, [isExpanded]);

  // Update local currentUser when Zustand session changes
  useEffect(() => {
    setCurrentUser(session?.user ?? null);
  }, [session?.user]);

  // Apply theme colors when dark/light toggles
  useEffect(() => {
    applyTheme(isDarkMode);
  }, [isDarkMode]);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }

      // Optionally, clear session in your Zustand store (assuming you have an action for that)
      useAuthStore.getState().setSession(null);
      setShowLogoutPopup(false);

      setSnackbarMessage('You have been logged out successfully');
      setSnackbarOpen(true);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      setSnackbarMessage('Error signing out. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const toggleLogoutPopup = () => {
    setShowLogoutPopup((prev) => !prev);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleToggleSidebar = (e: React.MouseEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSidebar();
  };

  const [loading, setLoading] = useState(false);

  return (
    <aside
      className={`vertical-sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
      ref={sidebarRef}
    >
      <input
        type="checkbox"
        role="switch"
        id="checkbox-input"
        className="checkbox-input"
        ref={checkboxRef}
        checked={isExpanded}
        onChange={() => toggleSidebar()}
      />
      <nav ref={navRef}>
        <header>
          <div className="sidebar__toggle-container">
            <label
              tabIndex={0}
              htmlFor="checkbox-input"
              id="label-for-checkbox-input"
              className="nav__toggle"
              onClick={handleToggleSidebar}
            >
              <span className="toggle--icons" aria-hidden="true">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="toggle-svg-icon toggle--open"
                >
                  <path d="M3 5a1 1 0 1 0 0 2h18a1 1 0 1 0 0-2zM2 12a1 1 0 0 1 1-1h18a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1M2 18a1 1 0 0 1 1-1h18a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1"></path>
                </svg>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="toggle-svg-icon toggle--close"
                >
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
        </section>

        <div className="sidebar__footer">
          <div className="theme-toggle-container" data-tooltip="Theme">
            <span className="theme-icon sun-icon">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
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
                <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" />
              </svg>
            </span>
          </div>

          {/* User Profile Section */}
          {currentUser ? (
            <>
              <div>
                {/* upgrade button */}
                <Button
                  variant="contained"
                  fullWidth
                  disabled={loadingData || loading}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    fontSize: '1rem',
                    borderRadius: 3,
                    background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #833AB4, #5851DB, #405DE6)',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      animation: 'shine 3s infinite',
                    },
                    '@keyframes shine': {
                      '0%': { left: '-100%' },
                      '20%': { left: '100%' },
                      '100%': { left: '100%' },
                    },
                  }}

                  onClick={() => {
                    if (subscription?.status === 'active') {
                      // call api for billing portal
                      setLoading(true);
                      fetch(`${API_URL}/create-billing-portal`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: currentUser.email })
                      })
                        .then(response => {
                          if (response.ok) {
                            return response.json();
                          }
                          throw new Error('Failed to create billing portal');
                        })
                        .then(data => {
                          if (data.url) {
                            window.location.href = data.url;
                          }
                        })
                        .catch(error => {
                          setLoading(false);
                          console.error('Error:', error);
                        });
                    } else {
                      setLoading(true);
                      navigate('/pricing');
                    }
                  }} className="upgrade-button" >
                  {
                    loadingData ? <>
                      <CircularProgress size={24} sx={{ color: isDarkMode ? '#fff' : '#000' }} />
                    </> : <>
                      {
                        subscription?.status === 'active' ? (
                          <span>{
                            loading ? 'Processing...' : 'Manage plan'
                          }</span>
                        ) : (
                          <span>Upgrade plan</span>
                        )
                      }</>
                  }
                </Button>
              </div>
              <div
                className="user-profile"
                onClick={toggleLogoutPopup}
                data-tooltip="User Profile"
              >
                <div className="user-avatar-container">
                  <img
                    src={
                      // Supabase user object might have user.user_metadata.avatar_url, etc.
                      (currentUser.user_metadata?.avatar_url as string) ||
                      'https://emedia1.nhs.wales/HEIW2/cache/file/F4C33EF0-69EE-4445-94018B01ADCF6FD4.png'
                    }
                    alt={(currentUser.user_metadata?.full_name as string) || 'User'}
                    className="user-avatar"
                  />
                </div>
                <div className="user-info">
                  <p className="user-name">
                    {(currentUser.user_metadata?.full_name as string) || 'User'}
                  </p>
                  <p className="user-email">{(currentUser.email as string) || 'user@example.com'}</p>
                </div>

                {/* Logout Popup */}
                {showLogoutPopup && (
                  <div className="logout-popup">
                    <button className="logout-button" onClick={handleLogout}>
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path
                          fillRule="evenodd"
                          d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
                        />
                        <path
                          fillRule="evenodd"
                          d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
                        />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="login-button-container" data-tooltip="Login" onClick={handleLogin}>
              <div className="login-icon">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                  <path
                    fillRule="evenodd"
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                  />
                </svg>
              </div>
              <span className="login-text">Login</span>
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
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
