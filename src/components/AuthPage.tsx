// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../lib/supabase";
import GlocapLogo from '../assets/Glocap.png';
import { motion } from 'framer-motion';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useTheme } from '../context/ThemeContext';
import { IconButton, Switch, useMediaQuery } from "@mui/material";
import { BsMoonFill, BsSunFill } from "react-icons/bs";
import Layout from "./Layout";

export default function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [authView, setAuthView] = useState("sign_in");
  const { isDarkMode, toggleTheme } = useTheme();
  const isMobile = useMediaQuery('(max-width:600px)');

  // Create a dynamic MUI theme based on dark mode
  const dynamicTheme = useMemo(() => createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: { main: "#4F46E5" },
      secondary: { main: "#4338CA" },
      background: {
        default: isDarkMode ? "#121212" : "#F9FAFB",
        paper: isDarkMode ? "#1e1e1e" : "#FFFFFF",
      },
    },
    typography: { fontFamily: "'Inter', sans-serif" },
  }), [isDarkMode]);

  // Detect mode from URL and update state
  useEffect(() => {
    const mode = searchParams.get("mode") || "sign-in";
    setAuthView(
      mode === "sign-up"
        ? "sign_up"
        : mode === "forgotten-password"
          ? "forgotten_password"
          : "sign_in"
    );
  }, [searchParams]);

  // Update URL when user clicks custom links
  const handleAuthViewChange = (
    newView: "sign_up" | "sign_in" | "forgotten_password"
  ) => {
    setAuthView(newView);
    setSearchParams({
      mode:
        newView === "sign_up"
          ? "sign-up"
          : newView === "forgotten_password"
            ? "forgotten-password"
            : "sign-in",
    });
  };

  // Target only anchors inside the Auth component container to hide Supabase's default links
  useEffect(() => {
    const removeSupabaseLinks = () => {
      document
        .querySelectorAll(".auth-wrapper a")
        .forEach((link) => {
          const text = link.innerText;
          if (
            text.includes("Forgot your password") ||
            text.includes("Don't have an account") ||
            text.includes("Already have an account")
          ) {
            link.style.display = "none";
          }
        });
    };

    removeSupabaseLinks();
    const observer = new MutationObserver(removeSupabaseLinks);
    const authWrapper = document.querySelector(".auth-wrapper");
    if (authWrapper) {
      observer.observe(authWrapper, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, [authView]);



  return (
    <ThemeProvider theme={dynamicTheme}>
      {/* Theme Toggle */}

      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          top: { xs: 12, sm: 20 },
          right: { xs: 12, sm: 20 },
          borderRadius: '50px',
          p: { xs: '2px', sm: '4px' },
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 0.5, sm: 1 },
          backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
          backdropFilter: 'blur(10px)',
          zIndex: 1000,
          '&:hover': {
            background: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
          }
        }}
      >
        <IconButton
          size="small"
          onClick={toggleTheme}
          sx={{
            color: isDarkMode ? 'rgba(255,255,255,0.5)' : '#FDB813',
            transform: `scale(${!isDarkMode ? 1.2 : 1})`,
            transition: 'all 0.3s ease',
          }}
        >
          <BsSunFill />
        </IconButton>
        <Switch
          checked={isDarkMode}
          onChange={toggleTheme}
          sx={{
            '& .MuiSwitch-switchBase': {
              color: isDarkMode ? '#405DE6' : '#757575',
              '&.Mui-checked': {
                color: '#405DE6',
              },
              '&.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#405DE6 !important',
              },
            },
            '& .MuiSwitch-track': {
              backgroundColor: isDarkMode ? '#ffffff40 !important' : '#00000040 !important',
              opacity: '1 !important',
            },
          }}
        />
        <IconButton
          size="small"
          onClick={toggleTheme}
          sx={{
            color: isDarkMode ? '#ffffff' : 'rgba(0,0,0,0.3)',
            transform: `scale(${isDarkMode ? 1.2 : 1})`,
            transition: 'all 0.3s ease',
          }}
        >
          <BsMoonFill />
        </IconButton>
      </Paper>
      <Box
        sx={{
          background: isDarkMode
            ? "linear-gradient(135deg, #1e1e1e 0%, #121212 100%)"
            : "linear-gradient(135deg, #EEF2FF 0%, #F9FAFB 100%)",
          p: 2,
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          style={{
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
            marginBottom: '2rem',
            marginLeft: isMobile ? '1rem' : '2rem',
          }}

        >
          <Box
            component="img"
            src={GlocapLogo}
            alt="GloCap Logo"
            sx={{
              width: { xs: 80, sm: 80, md: 90 },
              height: 'auto',
              objectFit: 'contain',
              filter: isDarkMode
                ? 'brightness(1.2) drop-shadow(0 0 10px rgba(255,255,255,0.5)) drop-shadow(0 0 20px rgba(255,255,255,0.3)) drop-shadow(0 0 30px rgba(255,255,255,0.2))'
                : 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))',
              transition: 'all 0.4s ease',
              animation: isDarkMode ? 'glow 2s ease-in-out infinite alternate' : 'none',
              '@keyframes glow': {
                '0%': {
                  filter: 'brightness(1.2) drop-shadow(0 0 10px rgba(255,255,255,0.5)) drop-shadow(0 0 20px rgba(255,255,255,0.3)) drop-shadow(0 0 30px rgba(255,255,255,0.2))'
                },
                '100%': {
                  filter: 'brightness(1.3) drop-shadow(0 0 15px rgba(255,255,255,0.6)) drop-shadow(0 0 25px rgba(255,255,255,0.4)) drop-shadow(0 0 35px rgba(255,255,255,0.3))'
                }
              },
              '&:hover': {
                transform: 'scale(1.03)',
                filter: isDarkMode
                  ? 'brightness(1.4) drop-shadow(0 0 20px rgba(255,255,255,0.7)) drop-shadow(0 0 30px rgba(255,255,255,0.5)) drop-shadow(0 0 40px rgba(255,255,255,0.4))'
                  : 'drop-shadow(0 6px 16px rgba(0,0,0,0.15))',
              }
            }}
          />
          <Typography style={{ margin: '20px' }} variant="caption" sx={{ fontStyle: "italic" }}>
            Engage, Inspire and Convert with Every Caption!
          </Typography>
        </motion.div>
      </Box>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isDarkMode
            ? "linear-gradient(135deg, #1e1e1e 0%, #121212 100%)"
            : "linear-gradient(135deg, #EEF2FF 0%, #F9FAFB 100%)",
          p: 2,
        }}
      >
        <Container component="main" maxWidth="xs">

          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="h4" fontWeight="bold"
              sx={{
                color: "primary.main",
                background: 'linear-gradient(45deg, #405DE6 30%, #833AB4 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                lineHeight: 1.1,
              }}>
              {authView === "sign_up"
                ? "Create your account"
                : authView === "forgotten_password"
                  ? "Reset your password"
                  : "Sign in to your account"}
            </Typography>
          </Box>

          <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
            {/* Wrap the Auth component */}
            <div className="auth-wrapper">
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: "#4F46E5",
                        brandAccent: "#4338CA",
                      },
                      auth: {
                        messageLink: "hidden",
                      },
                    },
                  },
                }}
                theme={isDarkMode ? "dark" : "default"}
                providers={authView === "sign_up" ? [] : ['google']}
                view={authView}
                redirectTo={
                  authView === "sign_up"
                    ? `${window.location.origin}/login`
                    : authView === "forgotten_password"
                      ? `${window.location.origin}/reset-password`
                      : `${window.location.origin}/login`
                }
                onlyThirdPartyProviders={false}
              />

            </div>
          </Paper>

          {/* Custom Links to Switch Views */}
          <Box textAlign="center" mt={2}>
            {authView === "sign_in" && (
              <Typography variant="body2">
                Don't have an account?{" "}
                <span
                  style={{ color: "#4F46E5", cursor: "pointer" }}
                  onClick={() => handleAuthViewChange("sign_up")}
                >
                  Sign Up
                </span>
              </Typography>
            )}
            {authView === "sign_up" && (
              <Typography variant="body2">
                Already have an account?{" "}
                <span
                  style={{ color: "#4F46E5", cursor: "pointer" }}
                  onClick={() => handleAuthViewChange("sign_in")}
                >
                  Sign In
                </span>
              </Typography>
            )}
            {authView !== "forgotten_password" && (
              <Typography variant="body2" mt={1}>
                <span
                  style={{ color: "#4F46E5", cursor: "pointer" }}
                  onClick={() => handleAuthViewChange("forgotten_password")}
                >
                  Forgot Password?
                </span>
              </Typography>
            )}
          </Box>
        </Container>
      </Box>

    </ThemeProvider>
  );
}
