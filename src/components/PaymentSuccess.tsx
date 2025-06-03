// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useMemo } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    useMediaQuery,
    createTheme,
    ThemeProvider,
} from '@mui/material';
import { BsCheckCircleFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom'; // or useNextRouter if using Next.js
import { useTheme } from '../context/ThemeContext';

const PaymentSuccess: React.FC = () => {
    const { isDarkMode } = useTheme();
    const isMobile = useMediaQuery('(max-width:600px)');
    const navigate = useNavigate();

    const theme = useMemo(() => createTheme({
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

    return (
        <ThemeProvider theme={theme}>
            <Box
                minHeight="100vh"
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ backgroundColor: theme.palette.background.default }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: isMobile ? 4 : 6,
                        textAlign: 'center',
                        borderRadius: 4,
                        maxWidth: 500,
                        backgroundColor: theme.palette.background.paper,
                    }}
                >
                    <BsCheckCircleFill size={64} color={theme.palette.primary.main} />
                    <Typography variant="h4" mt={2} fontWeight="bold">
                        Payment Successful
                    </Typography>
                    <Typography variant="subtitle1" mt={1} mb={3} color="text.secondary">
                        Thank you for your purchase! Your access has been unlocked.
                    </Typography>

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={() => navigate('/generate')}
                        sx={{
                            py: { xs: 1.5, sm: 2 },
                            px: { xs: 4, sm: 8 },
                            borderRadius: 3,
                            fontSize: { xs: '1rem', sm: '1.2rem' },
                            background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                            width: { xs: '90%', sm: 'auto' },
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
                    >
                        Generate Now
                    </Button>
                </Paper>
            </Box>
        </ThemeProvider>
    );
};

export default PaymentSuccess;
