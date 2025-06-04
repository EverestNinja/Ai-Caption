/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './MobileNav.css';
import glocapLogo from '../../assets/Glocap.png';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../lib/supabase'; // Make sure you have initialized Supabase client here
import { User } from '@supabase/supabase-js';
import { useAuthStore } from '../../store/auth';
import { getSubscriptionById } from '../../services/subscriptions';
import { API_URL } from '../../config/const';
import { CircularProgress } from '@mui/material';

type MobileNavLinkProps = {
  to: string;
  text: string;
  icon: React.ReactNode;
  onClick: () => void;
};

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, text, icon, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li className="mobile-nav__item">
      <Link
        to={to}
        className={`mobile-nav__link ${isActive ? 'active' : ''}`}
        onClick={onClick}
      >
        <span className="mobile-nav__icon">{icon}</span>
        <span className="mobile-nav__text">{text}</span>
      </Link>
    </li>
  );
};

const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Replace Firebase-based auth state with Supabase
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const session = useAuthStore((state) => state.session);

  const navigate = useNavigate();

  // On mount, fetch current session & subscribe to auth changes
  useEffect(() => {
    let authListener: { data: { subscription: { unsubscribe: () => void } } } | null = null;

    const getInitialSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (!error && session) {
        setCurrentUser(session.user);
      } else {
        setCurrentUser(null);
      }

      // Subscribe to auth state changes
      authListener = supabase.auth.onAuthStateChange((event, session) => {
        setCurrentUser(session?.user ?? null);
      });
    };

    getInitialSession();

    return () => {
      // Cleanup subscription on unmount
      if (authListener && authListener.data.subscription) {
        authListener.data.subscription.unsubscribe();
      }
    };
  }, []);

  const [subscription, setSubscription] = useState(null);
  console.log('Subscription from mobile:', subscription);
  const [loadingData, setLoadingData] = useState(false);
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
          console.error('Error fetching subscription:', err);
          setLoadingData(false);
        }
      };
      fetchSubscription();
    } else {
      setLoadingData(false);
      setSubscription(null);
    }
  }, [session]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scrolling when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close mobile menu on navigation
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // Toggle menu
  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  // Handle login
  const handleLogin = () => {
    navigate('/login');
    setIsOpen(false);
  };

  // Handle logout via Supabase
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      setIsOpen(false);
    }
  };
  const [loading, setLoading] = useState(false);
  return (
    <>
      <div className="mobile-nav">
        <button
          ref={buttonRef}
          className={`hamburger-button ${isOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle mobile menu"
        >
          {isOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18.707 6.707a1 1 0 0 0-1.414-1.414L12 10.586 6.707 5.293a1 1 0 0 0-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 1 0 1.414 1.414L12 13.414l5.293 5.293a1 1 0 0 0 1.414-1.414L13.414 12l5.293-5.293z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div className={`mobile-menu-overlay ${isOpen ? 'open' : ''}`}>
        <div className="mobile-menu-container" ref={menuRef}>
          <div className="mobile-menu__header">
            <img src={glocapLogo} alt="GloCap AI Logo" className="mobile-menu__logo" />
            <button
              className="mobile-menu__close"
              onClick={() => setIsOpen(false)}
              aria-label="Close mobile menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M18.707 6.707a1 1 0 0 0-1.414-1.414L12 10.586 6.707 5.293a1 1 0 0 0-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 1 0 1.414 1.414L12 13.414l5.293 5.293a1 1 0 0 0 1.414-1.414L13.414 12z" />
              </svg>
            </button>
          </div>

          <nav className="mobile-menu__nav">
            <ul className="mobile-menu__list">
              <MobileNavLink
                to="/"
                text="Home"
                onClick={handleLinkClick}
                icon={
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z" />
                    <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6Z" />
                  </svg>
                }
              />
              <MobileNavLink
                to="/generate"
                text="Generate Caption"
                onClick={handleLinkClick}
                icon={
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
                    <path d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0zM7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z" />
                  </svg>
                }
              />
              <MobileNavLink
                to="/flyer"
                text="Generate Flyer"
                onClick={handleLinkClick}
                icon={
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z" />
                    <path d="M3 8.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m0-5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5z" />
                  </svg>
                }
              />
              <MobileNavLink
                to="/publish"
                text="Publish"
                onClick={handleLinkClick}
                icon={
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M12.5 5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm-2.5.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0v-5zm-3 0a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0v-5z" />
                    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178z" />
                  </svg>
                }
              />
              <MobileNavLink
                to="/favorites"
                text="Favorites"
                onClick={handleLinkClick}
                icon={
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
                  </svg>
                }
              />
            </ul>
          </nav>

          <div className="mobile-menu__footer">
            {/* upgrade button */}
            <button
              disabled={loading || loadingData}
              style={{ backgroundColor: isDarkMode ? 'white' : 'black', color: isDarkMode ? '#fff' : '#000' }}
              onClick={() => {
                if (subscription?.status === 'active') {
                  navigate('/manage-plan');
                } else {
                  setLoading(true);
                  navigate('/pricing');
                }
              }} className="upgrade-button" >
              {
                loadingData ? <>
                  <CircularProgress size={24} color="inherit" />
                </> : <>
                  {
                    subscription?.status === 'active' ? (
                      <span>{
                        loading ? 'Processing...' : 'Manage plan'
                      }</span>
                    ) : (
                      <span>Upgrade plan</span>
                    )
                  }
                </>
              }
            </button>
            <div className="mobile-theme-toggle">
              <span className="theme-label">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
              <label className="theme-switch">
                <input
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={toggleTheme}
                  aria-label="Toggle theme"
                />
                <span className="theme-slider"></span>
              </label>
            </div>

            {/* Login/Logout Button */}
            <div className="mobile-auth-button" onClick={currentUser ? handleLogout : handleLogin}>
              {currentUser ? (
                <>
                  <div className="mobile-avatar">
                    <img
                      src={
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (currentUser.user_metadata as any)?.avatar_url ||
                        'https://emedia1.nhs.wales/HEIW2/cache/file/F4C33EF0-69EE-4445-94018B01ADCF6FD4.png'
                      }
                      alt={

                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (currentUser.user_metadata as any)?.full_name ||
                        currentUser.email ||
                        'User'
                      }
                    />
                  </div>
                  <span>Logout</span>
                </>
              ) : (
                <>
                  <div className="mobile-login-icon">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                      <path
                        fillRule="evenodd"
                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                      />
                    </svg>
                  </div>
                  <span>Login</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNav;
