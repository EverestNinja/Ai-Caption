// src/pages/AuthPage.tsx
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  IconButton,
  Paper,
  Switch,
  TextField,
  Typography,

  CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { supabase } from "../lib/supabase";
import { useTheme } from "../context/ThemeContext";
import { BsMoonFill, BsSunFill } from "react-icons/bs";

// import GlocapLogo from "../assets/Glocap.png";
import Popup from "./Popup";

type AuthView = "sign_in" | "sign_up" | "forgotten_password";

export default function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [authView, setAuthView] = useState<AuthView>("sign_in");
  const { isDarkMode, toggleTheme } = useTheme();

  const navigate = useNavigate();

  // ─── Update authView from URL ────────────────────────────────────────────────
  useEffect(() => {
    const mode = searchParams.get("mode") || "sign-in";
    if (mode === "sign-up") setAuthView("sign_up");
    else if (mode === "forgotten-password")
      setAuthView("forgotten_password");
    else setAuthView("sign_in");
  }, [searchParams]);

  // ─── Helper to switch view & URL ──────────────────────────────────────────────
  const handleAuthViewChange = useCallback(
    (newView: AuthView) => {
      setAuthView(newView);
      const modeParam =
        newView === "sign_up"
          ? "sign-up"
          : newView === "forgotten_password"
            ? "forgotten-password"
            : "sign-in";
      setSearchParams({ mode: modeParam });
    },
    [setSearchParams]
  );

  // ─── Dynamic MUI theme based on isDarkMode ────────────────────────────────────
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
          primary: { main: "#4F46E5" },
          secondary: { main: "#4338CA" },
          background: {
            default: isDarkMode ? "#121212" : "#F9FAFB",
            paper: isDarkMode ? "#1e1e1e" : "#FFFFFF",
          },
        },
        typography: { fontFamily: "'Inter', sans-serif" },
      }),
    [isDarkMode]
  );

  // ─── “Remember Me” handling ───────────────────────────────────────────────────
  // Supabase writes its token to localStorage under "supabase.auth.token".
  // If user did NOT check “Remember Me”, we attach a beforeunload listener
  // so that the token is removed when they close/reload the tab.
  const SUPABASE_TOKEN_KEY = "supabase.auth.token";
  const attachUnloadListener = useCallback(() => {
    window.addEventListener("beforeunload", () => {
      localStorage.removeItem(SUPABASE_TOKEN_KEY);
    });
  }, []);

  const detachUnloadListener = useCallback(() => {
    window.removeEventListener("beforeunload", () => {
      localStorage.removeItem(SUPABASE_TOKEN_KEY);
    });
  }, []);

  // ─── FORM STATES ───────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ─── SIGN IN STATES ───────────────────────────────────────────────────────────
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // ─── SIGN UP STATES ────────────────────────────────────────────────────────────
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirm, setSignUpConfirm] = useState("");

  // ─── FORGOT PASSWORD STATES ────────────────────────────────────────────────────
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // ─── On mount, check if we need to attach unload listener for OAuth flow ─────────
  useEffect(() => {
    const flag = sessionStorage.getItem("clearSessionOnUnload");
    if (flag === "true") {
      attachUnloadListener();
      sessionStorage.removeItem("clearSessionOnUnload");
    }
  }, [attachUnloadListener]);

  // ─── Clean up unload listener on unmount ────────────────────────────────────────
  useEffect(() => {
    return () => {
      detachUnloadListener();
    };
  }, [detachUnloadListener]);

  // ─── HANDLERS ─────────────────────────────────────────────────────────────────

  // --- Sign In with Email/Password ---
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: signInEmail,
      password: signInPassword,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // On success: decide unload behavior
    if (data.session) {
      if (!rememberMe) {
        attachUnloadListener();
      } else {
        detachUnloadListener();
      }
      navigate("/", { replace: true });
    }

    setLoading(false);
  };

  // --- Sign In with Google (OAuth) ---
  const handleGoogleSignIn = async () => {
    // Before redirecting: set flag if we do NOT want to remember
    if (!rememberMe) {
      sessionStorage.setItem("clearSessionOnUnload", "true");
    } else {
      detachUnloadListener();
    }

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/login?mode=sign-in",
      },
    });
  };
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  // --- Sign Up ---
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (signUpPassword !== signUpConfirm) {
      setErrorMsg("Passwords do not match");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: signUpEmail,
      password: signUpPassword,
      options: {
        emailRedirectTo: `${window.location.origin}/login?mode=sign-in`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // On success: redirect to sign-in so they can confirm email
    // navigate("/login?mode=sign-in", { replace: true });
    setIsPopupOpen(true);
    setSignUpEmail("");
    setSignUpPassword("");
    setSignUpConfirm("");
    setTimeout(() => {
      setIsPopupOpen(false);
      handleAuthViewChange("sign_in");
      setSearchParams({ mode: "sign-in" });
      // Optionally, you can also navigate to the sign-in page
      // navigate("/login?mode=sign-in", { replace: true });
    }, 3000);
    setLoading(false);
  };

  // --- Forgot Password ---
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.resetPasswordForEmail(
      forgotEmail,
      {
        redirectTo: `${window.location.origin}/reset-password`,
      }
    );

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    setForgotSuccess(true);
    setLoading(false);
  };

  // ─── RENDER ────────────────────────────────────────────────────────────────────
  return (
    <ThemeProvider theme={muiTheme}>
      {/* ─── THEME TOGGLE BUTTON ──────────────────────────────────────────────────── */}
      <Paper
        elevation={3}
        sx={{
          position: "absolute",
          top: { xs: 12, sm: 20 },
          right: { xs: 12, sm: 20 },
          borderRadius: "50px",
          p: { xs: "2px", sm: "4px" },
          display: "flex",
          alignItems: "center",
          gap: { xs: 0.5, sm: 1 },
          backgroundColor: isDarkMode
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.02)",
          backdropFilter: "blur(10px)",
          zIndex: 1000,
          "&:hover": {
            background: isDarkMode
              ? "rgba(255,255,255,0.15)"
              : "rgba(0,0,0,0.08)",
          },
        }}
      >
        <IconButton
          size="small"
          onClick={toggleTheme}
          sx={{
            color: isDarkMode ? "rgba(255,255,255,0.5)" : "#FDB813",
            transform: `scale(${!isDarkMode ? 1.2 : 1})`,
            transition: "all 0.3s ease",
          }}
        >
          <BsSunFill />
        </IconButton>
        <Switch
          checked={isDarkMode}
          onChange={toggleTheme}
          sx={{
            "& .MuiSwitch-switchBase": {
              color: isDarkMode ? "#405DE6" : "#757575",
              "&.Mui-checked": {
                color: "#405DE6",
              },
              "&.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#405DE6 !important",
              },
            },
            "& .MuiSwitch-track": {
              backgroundColor: isDarkMode
                ? "#ffffff40 !important"
                : "#00000040 !important",
              opacity: "1 !important",
            },
          }}
        />
        <IconButton
          size="small"
          onClick={toggleTheme}
          sx={{
            color: isDarkMode ? "#ffffff" : "rgba(0,0,0,0.3)",
            transform: `scale(${isDarkMode ? 1.2 : 1})`,
            transition: "all 0.3s ease",
          }}
        >
          <BsMoonFill />
        </IconButton>
      </Paper>

      {/* ─── TOP LOGO & SLOGAN ─────────────────────────────────────────────────────── */}
      {/* <Box
        sx={{
          background: isDarkMode
            ? "linear-gradient(135deg, #1e1e1e 0%, #121212 100%)"
            : "linear-gradient(135deg, #EEF2FF 0%, #F9FAFB 100%)",
          p: 2,
          display: 'flex',          // Use flexbox
          flexDirection: 'column',  // Align items in a column
          alignItems: 'center',     // Center items horizontally
          justifyContent: 'center', // Center items vertically

        }}
      >
        <Box
          component="img"
          src={GlocapLogo}
          alt="GloCap Logo"
          sx={{
            width: { xs: 80, sm: 80, md: 90 },
            height: "auto",
            objectFit: "contain",
            filter: isDarkMode
              ? "brightness(1.2) drop-shadow(0 0 10px rgba(255,255,255,0.5)) drop-shadow(0 0 20px rgba(255,255,255,0.3)) drop-shadow(0 0 30px rgba(255,255,255,0.2))"
              : "drop-shadow(0 4px 12px rgba(0,0,0,0.1))",
            transition: "all 0.4s ease",
            animation: isDarkMode
              ? "glow 2s ease-in-out infinite alternate"
              : "none",
            "@keyframes glow": {
              "0%": {
                filter:
                  "brightness(1.2) drop-shadow(0 0 10px rgba(255,255,255,0.5)) drop-shadow(0 0 20px rgba(255,255,255,0.3)) drop-shadow(0 0 30px rgba(255,255,255,0.2))",
              },
              "100%": {
                filter:
                  "brightness(1.3) drop-shadow(0 0 15px rgba(255,255,255,0.6)) drop-shadow(0 0 25px rgba(255,255,255,0.4)) drop-shadow(0 0 35px rgba(255,255,255,0.3))",
              },
            },
            "&:hover": {
              transform: "scale(1.03)",
              filter: isDarkMode
                ? "brightness(1.4) drop-shadow(0 0 20px rgba(255,255,255,0.7)) drop-shadow(0 0 30px rgba(255,255,255,0.5)) drop-shadow(0 0 40px rgba(255,255,255,0.4))"
                : "drop-shadow(0 6px 16px rgba(0,0,0,0.15))",
            },
          }}
        />
        <Typography
          style={{ margin: "20px" }}
          variant="caption"
          sx={{ fontStyle: "italic" }}
        >
          Engage, Inspire and Convert with Every Caption!
        </Typography>
      </Box> */}


      {/* ─── MAIN AUTH CONTAINER ─────────────────────────────────────────────────── */}
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
          {/* ─── PAGE TITLE ───────────────────────────────────────────────────────────── */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                background: "linear-gradient(45deg, #405DE6 30%, #833AB4 90%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                lineHeight: 1.1,
              }}
            >
              {authView === "sign_up"
                ? "Create your account"
                : authView === "forgotten_password"
                  ? "Reset your password"
                  : "Sign in to your account"}
            </Typography>
          </Box>

          <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
            {/* ─── RENDER ONE OF THREE FORMS ─────────────────────────────────────────── */}
            {authView === "sign_in" && (
              <Box component="form" onSubmit={handleSignIn} noValidate>
                {/* Email */}
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  margin="normal"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                />
                {/* Password */}
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  required
                  margin="normal"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                />
                {/* Remember Me */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) =>
                        setRememberMe(e.target.checked)
                      }
                      color="primary"
                    />
                  }
                  label="Remember Me (30 days)"
                />
                {/* Error Message */}
                {errorMsg && (
                  <Typography
                    color="error"
                    variant="body2"
                    sx={{ mt: 1 }}
                  >
                    {errorMsg}
                  </Typography>
                )}
                {/* Sign In Button */}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    py: { xs: 1, sm: 1 },
                    px: { xs: 0, sm: 0 },
                    borderRadius: 2,
                    fontSize: { xs: '1rem', sm: '1.2rem' },
                    background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',

                    '&:hover': {
                      background: 'linear-gradient(45deg, #833AB4, #5851DB, #405DE6)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                      transform: 'translateY(-2px)',
                    },
                    '@media (hover: none)': {
                      '&:hover': {
                        background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                      }
                    },
                    position: 'relative',
                    overflow: 'hidden',
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
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
                {/* Or Divider */}
                <Typography
                  variant="body2"
                  align="center"
                  sx={{ my: 2, color: "text.secondary" }}
                >
                  — OR —
                </Typography>
                {/* Sign In with Google */}
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  startIcon={
                    <Box
                      component="img"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEkUlEQVR4nO2Zb0wbZRzHn3taesUtRpOJYbo/DoQM5c/GMgryzxkYxbGBiQsbNBCEFGaIY8zCCuaUMSiQAQMGQWAgcSY2GeuNuzpc8NqNvRoCItE3841Dthj3ToNzbX+mVRBI197Zo2VJv8n3XZ+nn89dn6dPrwj5448/HgcoJIWqgGIoxywU4HuQTfwJSsIKBxBAKgJIQzbIJhZBhX+BE/g6VAUU2ccgXwc0UgWU4tvwNmGBJASCqiQsoMa3QRsQ433wOlk4qPEsvCkQ2llTEUAxnoEaFOIdeA3RCumEzWPwtT2IrHCK0K0f+HkUCMX4B9HBk9b0PTwNFJKJC9+NngcVfrDu8En/toJoFw9+EMnhOPGr1+DLCE40eIeAGn/vPXgsMvyHRIfgrbEMT0IlroUmaQpQaAtQKAjOSN6C05hy7Db21zgbW4pN4sI3kyGQQVh5g5+W9PJZfEChZ+ADydAqkVKR4R1vVIHv8IIvwPNwDr0oeP4aFAJ5+P76wJvl22CcfAQaCUCyC/gSPAV6JEEbLWAmdWAmwdHeAIB0wvmV35DweiQBs2x+WcDeURmACv8Hn0lYoAK9hDZiwCSPXwW/VI4E0En/ObuclPSjjRowybROBZY6FPAAyhGJNmrATF5xKWCSdQiZL1gzC2I0XDthO9rUd9e9gImccynAkRm+EAjWzMIbddcW+Qg8dCMQ6iuB3TW3rHwEHrkWQJt9JbCjehKeaoHtVd+C5x+hm7IwXwns1t60Pd2L+JNRHovYTI642UY7fSVwRDc8z0NAduZJ8A+5Z6Geif/jvF4RiEROy3D+puiPvrG4Eii/0DjqXoALVDiDnx0PBhWthENXs6HDGHtJbIGTnfX97u6Arq/iuHsBQBjMsntL4DYzCfRYOGQbDjvg7c2jlZaL11/bJhZ8W496Z2SNyeoK/vVas4XiKH5P88BENtrhfzdthrNMwjL4ylaPJi9wXIrHjwcpjpIeafxswd3VL2lrm+A9KXCBL98df+GvEjrdKfxSP2YTZjyRoDhKmt/SM+d2/6+egsbuylhBkzcwihlX8CvvRP/X4VuFwvfeiNhe1lX3E5/d51hz75zQ+RE9FvZKPq208pHIp5WWzq/2DlCDKXJ38w6PRW1qZ/b15RmU1pyRHDja2uH2FEp9ekrQl+dyutmY1iweAitFGljFdJdxL6VnIw5cGdsVdJkL2zJgjEq8aNxTV8ckTNpfs3JM1kgOFPZQsLXqO6cC77c3dSNPomPjpvkKeNKiwXLYWX1nFfy7TQM/Ik+j10fINHTqfW9IFH5RCJG1Jgd8ev2Xv53o6hJ0cHxiOG7HczVM4oI3JI7pc0HVemGeGq4MEgV+hYT8LBM/K2RN/J+eYxXTRmPo+v3m7jNGNecaMq2iX3lDprWXjWlG3sgwvSe0gY2beseQ5TF4ztXDjqt++caru5C3MzQWGdvM7L9VZDj4WCh4AZ3xuJGJm/icifb+n3xrowck6WeiC1uN+0a1TOLPajptUWVQWu13yH4IzDVk2tSGtMWqa8nzLex+ts8YU2Afg/zxxx/kaf4GzSVnCicBYF0AAAAASUVORK5CYII="
                      alt="Google logo"
                      sx={{
                        width: 20,
                        height: 20,
                        objectFit: "contain",
                        filter: isDarkMode
                          ? "brightness(1.2)"   // lighten icon in dark mode
                          : "none",
                        transition: "all 0.3s ease",
                      }}
                    />
                  }
                  sx={{
                    // overall button shape & spacing
                    textTransform: "none",
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 500,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    // light vs. dark background / border / text
                    ...(isDarkMode
                      ? {
                        color: "#FFFFFF",
                        borderColor: "rgba(255,255,255,0.6)",
                        backgroundColor: "rgba(255,255,255,0.08)",
                      }
                      : {
                        color: "rgba(0,0,0,0.87)",
                        borderColor: "rgba(0,0,0,0.23)",
                        backgroundColor: "#FFFFFF",
                      }),

                    // hover state
                    "&:hover": {
                      ...(isDarkMode
                        ? {
                          backgroundColor: "rgba(255,255,255,0.12)",
                          borderColor: "rgba(255,255,255,0.8)",
                        }
                        : {
                          backgroundColor: "rgba(0,0,0,0.04)",
                          borderColor: "rgba(0,0,0,0.35)",
                        }),
                    },

                    // disable ripple/shadow to keep it flat/modern (optional)
                    "&.Mui-disabled": {
                      opacity: 0.6,
                      color: isDarkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)",
                      borderColor: isDarkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.1)",
                      backgroundColor: isDarkMode ? "rgba(255,255,255,0.02)" : "#F5F5F5",
                    },
                  }}
                >

                  Continue with Google

                </Button>
              </Box>
            )}

            {authView === "sign_up" && (
              <Box component="form" onSubmit={handleSignUp} noValidate>
                {/* Email */}
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  margin="normal"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                />
                {/* Password */}
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  required
                  margin="normal"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                />
                {/* Confirm Password */}
                <TextField
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  required
                  margin="normal"
                  value={signUpConfirm}
                  onChange={(e) =>
                    setSignUpConfirm(e.target.value)
                  }
                />
                {/* Error Message */}
                {errorMsg && (
                  <Typography
                    color="error"
                    variant="body2"
                    sx={{ mt: 1 }}
                  >
                    {errorMsg}
                  </Typography>
                )}
                {/* Sign Up Button */}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    mt: 2,
                    py: { xs: 1, sm: 1 },
                    px: { xs: 0, sm: 0 },
                    borderRadius: 2,
                    fontSize: { xs: '1rem', sm: '1.2rem' },
                    background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',

                    '&:hover': {
                      background: 'linear-gradient(45deg, #833AB4, #5851DB, #405DE6)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                      transform: 'translateY(-2px)',
                    },
                    '@media (hover: none)': {
                      '&:hover': {
                        background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                      }
                    },
                    position: 'relative',
                    overflow: 'hidden',
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
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </Box>
            )}

            {authView === "forgotten_password" && (
              <>
                {forgotSuccess ? (
                  // After sending reset email, show success message
                  <Box textAlign="center" py={4}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      If an account with that email exists, you’ll
                      receive a password-reset email shortly.
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setErrorMsg(null);
                        handleAuthViewChange("sign_in")
                      }
                      }
                    >
                      Back to Sign In
                    </Button>
                  </Box>
                ) : (
                  // Forgotten Password Form
                  <Box
                    component="form"
                    onSubmit={handleForgotPassword}
                    noValidate
                  >
                    {/* Email */}
                    <TextField
                      label="Email"
                      type="email"
                      fullWidth
                      required
                      margin="normal"
                      value={forgotEmail}
                      onChange={(e) =>
                        setForgotEmail(e.target.value)
                      }
                    />
                    {/* Error Message */}
                    {errorMsg && (
                      <Typography
                        color="error"
                        variant="body2"
                        sx={{ mt: 1 }}
                      >
                        {errorMsg}
                      </Typography>
                    )}
                    {/* Send Reset Email Button */}
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        mt: 2,
                        py: { xs: 1, sm: 1 },
                        px: { xs: 0, sm: 0 },
                        borderRadius: 2,
                        fontSize: { xs: '.8rem', sm: '1rem' },
                        background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',

                        '&:hover': {
                          background: 'linear-gradient(45deg, #833AB4, #5851DB, #405DE6)',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                          transform: 'translateY(-2px)',
                        },
                        '@media (hover: none)': {
                          '&:hover': {
                            background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                          }
                        },
                        position: 'relative',
                        overflow: 'hidden',
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
                      disabled={loading}
                    >
                      {loading ? (
                        <CircularProgress
                          size={24}
                          color="inherit"
                        />
                      ) : (
                        "Send reset link"
                      )}
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Paper>

          {/* ─── LINKS TO SWITCH VIEWS ──────────────────────────────────────────────── */}
          <Box textAlign="center" mt={2}>
            {authView === "sign_in" && (
              <>
                <Typography variant="body2">
                  Don’t have an account?{" "}
                  <Typography
                    component="span"
                    sx={{ color: "primary.main", cursor: "pointer" }}
                    onClick={() => {
                      setErrorMsg(null);
                      handleAuthViewChange("sign_up")
                    }
                    }
                  >
                    Sign Up
                  </Typography>
                </Typography>
                <Typography variant="body2" mt={1}>
                  <Typography
                    component="span"
                    sx={{ color: "primary.main", cursor: "pointer" }}
                    onClick={() => {
                      setErrorMsg(null);
                      handleAuthViewChange("forgotten_password")
                    }
                    }
                  >
                    Forgot Password?
                  </Typography>
                </Typography>
              </>
            )}
            {authView === "sign_up" && (
              <Typography variant="body2">
                Already have an account?{" "}
                <Typography
                  component="span"
                  sx={{ color: "primary.main", cursor: "pointer" }}
                  onClick={() => {
                    setErrorMsg(null);
                    handleAuthViewChange("sign_in")
                  }
                  }
                >
                  Sign In
                </Typography>
              </Typography>
            )}
            {authView === "forgotten_password" && !forgotSuccess && (
              <Typography variant="body2">
                Remembered your password?{" "}
                <Typography
                  component="span"
                  sx={{ color: "primary.main", cursor: "pointer" }}
                  onClick={() => {
                    setErrorMsg(null);
                    handleAuthViewChange("sign_in")
                  }
                  }
                >
                  Sign In
                </Typography>
              </Typography>
            )}
          </Box>
        </Container>
      </Box>
      {/* --- POP UP MESSAGE */}
      <Popup
        open={isPopupOpen}
        title="Confirmation"
        message="Please check your email to confirm your account. Don't forget to check your spam folder!"
        onClose={() => setIsPopupOpen(false)}
      />
    </ThemeProvider>
  );
}
