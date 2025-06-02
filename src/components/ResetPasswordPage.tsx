// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { motion } from 'framer-motion';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import GlocapLogo from '../assets/Glocap.png';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useTheme } from '../context/ThemeContext';
import { IconButton, Switch, useMediaQuery } from "@mui/material";
import { BsMoonFill, BsSunFill } from "react-icons/bs";
import Layout from "./Layout";

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const { isDarkMode, toggleTheme } = useTheme();
    const isMobile = useMediaQuery('(max-width:600px)');

    // Create a dynamic theme based on dark mode
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

    useEffect(() => {
        // When the user clicks the email link, Supabase automatically logs them in
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
                navigate("/auth?mode=sign-in", { replace: true });
            }
        };
        checkSession();
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("pending");
        setMessage("Updating password...");

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) {
                throw error;
            }

            setStatus("success");
            setMessage("Password updated successfully! Redirecting to sign in...");
            const data = await supabase.auth.signOut();
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            console.error("Error updating password:", error);
            setStatus("error");
            setMessage("Failed to update password. Please try again.");
        }
    };

    return (
        <ThemeProvider theme={dynamicTheme}>
            {/* Theme Toggle */}
            {/* <Layout> */}
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
                    minHeight: "60vh",
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
                        <Typography
                            sx={{
                                background: 'linear-gradient(45deg, #405DE6 30%, #833AB4 90%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                                lineHeight: 1.1,
                            }}
                            component="h1"
                            variant="h4"
                            fontWeight="bold"
                        >
                            Reset Password
                        </Typography>
                    </Box>

                    {status !== "idle" && (
                        <Alert
                            severity={
                                status === "success"
                                    ? "success"
                                    : status === "error"
                                        ? "error"
                                        : "info"
                            }
                            sx={{ mb: 2 }}
                        >
                            {message}
                        </Alert>
                    )}

                    <Paper
                        elevation={3}
                        sx={{
                            p: { xs: 2, sm: 4 },
                            borderRadius: 3,
                        }}
                    >
                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <TextField
                                margin="normal"
                                fullWidth
                                label="New Password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2 }}
                                disabled={status === "pending"}
                            >
                                {status === "pending" ? "Updating..." : "Update Password"}
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </Box>
            {/* </Layout> */}

        </ThemeProvider>
    );
}
