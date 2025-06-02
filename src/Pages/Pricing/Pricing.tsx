import React, { useMemo } from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Grid,
    Typography,
    Paper,
    IconButton,
    Switch,
    useMediaQuery,
    createTheme,
    ThemeProvider,
    useTheme as muiUseTheme,
} from '@mui/material';
import { BsMoonFill, BsSunFill } from "react-icons/bs";
import Layout from '../../components/Layout';
import GlocapLogo from '../../assets/Glocap.png';
import { useTheme } from '../../context/ThemeContext';
import { useAuthStore } from '../../store/auth';

interface PricingPlan {
    title: string;
    subheader?: string;
    price: string;
    description: string;
    features: string[];
    buttonText: string;
    buttonVariant?: 'contained' | 'outlined';
    bestValue?: boolean;
}

const pricingPlans: PricingPlan[] = [
    // Uncomment and update if needed
    // {
    //     title: 'Free',
    //     price: '$0',
    //     subheader: 'Get Started for Free',
    //     description: 'No subscription required',
    //     features: [
    //         '5 captions/day',
    //         'Basic styles',
    //         '3-day unlimited trial with signup',
    //     ],
    //     buttonText: 'Try Now',
    //     buttonVariant: 'contained',
    // },
    {
        title: 'One-Time',
        subheader: 'No Commitment',
        price: '$12',
        description: 'Unlimited access for 30 days',
        features: [
            'Unlimited for 30 days',
            'Advanced styles',
            'Email support',
        ],
        buttonText: 'Get Started',
        buttonVariant: 'contained',
        bestValue: true,
    },
    {
        title: 'Monthly',
        subheader: 'Best Value',
        price: '$10/mo',
        description: 'Unlimited generations and advanced features',
        features: [
            'Unlimited caption generations',
            'Advanced styles',
            'Email support',
        ],
        buttonText: 'Upgrade Plan',
        buttonVariant: 'contained',
    },
];

const PricingCard: React.FC<{ plan: PricingPlan }> = ({ plan }) => {
    const theme = muiUseTheme();
    const session = useAuthStore((state) => state.session);
    // If user is logged in, override button text with "Subscribe"
    const buttonText = session ? 'Subscribe' : plan.buttonText;

    return (
        <Card
            sx={{
                border: plan.bestValue ? `2px solid ${theme.palette.primary.main}` : undefined,
                boxShadow: plan.bestValue ? '0px 4px 20px rgba(0,0,0,0.1)' : '0px 2px 10px rgba(0,0,0,0.05)',
            }}
        >
            <CardHeader
                title={plan.title}
                subheader={plan.subheader}
                sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
                    textAlign: 'center',
                }}
            />
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', mb: 2 }}>
                    <Typography component="h2" variant="h3" color="text.primary">
                        {plan.price}
                    </Typography>
                </Box>
                <Typography variant="subtitle1" align="center" gutterBottom>
                    {plan.description}
                </Typography>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                    {plan.features.map((feature, index) => (
                        <Typography
                            component="li"
                            variant="body1"
                            align="center"
                            key={index}
                            sx={{ py: 0.5 }}
                        >
                            {feature}
                        </Typography>
                    ))}
                </Box>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                    fullWidth
                    variant={plan.buttonVariant || 'outlined'}
                    sx={{
                        maxWidth: 200,
                        py: 1.5,
                        px: 3,
                        borderRadius: 3,
                        background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        fontSize: '1rem',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #833AB4, #5851DB, #405DE6)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                        },
                        '&:active': {
                            transform: 'translateY(0)',
                        },
                    }}
                >
                    {buttonText}
                </Button>
            </CardActions>
        </Card>
    );
};

const PricingSection: React.FC = () => {
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

    return (
        <ThemeProvider theme={dynamicTheme}>
            {/* <Layout> */}
            {/* Dark Mode Toggler */}
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
            {/* Logo and Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box
                    component="img"
                    src={GlocapLogo}
                    alt="GloCap Logo"
                    sx={{
                        width: isMobile ? 100 : 150,
                        height: 'auto',
                        mb: 2,
                        filter: isDarkMode
                            ? 'brightness(1.2) drop-shadow(0 0 10px rgba(255,255,255,0.5))'
                            : 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))',
                    }}
                />
                <Typography variant="h4" component="h2" gutterBottom>
                    Affordable Plans for Unlimited Captions
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Start free, go unlimited—simple pricing for everyone.
                </Typography>
            </Box>
            <Grid container sx={{ p: '70px' }} spacing={4}>
                {pricingPlans.map((plan) => (
                    <Grid item key={plan.title} xs={12} sm={6} md={6}>
                        <PricingCard plan={plan} />
                    </Grid>
                ))}
            </Grid>
            {/* </Layout> */}
        </ThemeProvider>
    );
};

export default PricingSection;
