// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
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
    Snackbar,
    Alert,
    Fade,
    CircularProgress,
} from '@mui/material';
import { BsMoonFill, BsSunFill } from "react-icons/bs";
import GlocapLogo from '../../assets/Glocap.png';
import { useTheme } from '../../context/ThemeContext';
import { useAuthStore } from '../../store/auth';
import { getSubscriptionById } from '../../services/subscriptions';
import { API_URL } from '../../config/const';

interface PricingPlan {
    title: string;
    subheader?: string;
    price: string;
    description: string;
    features: string[];
    buttonText: string;
    buttonVariant?: 'contained' | 'outlined';
    bestValue?: boolean;
    priceId?: string; // Optional, used for Stripe integration
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
        priceId: import.meta.env.VITE_STRIPE_PRICE_ID_FIXED,
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
        priceId: import.meta.env.VITE_STRIPE_PRICE_ID_MONTHLY,
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

    const [subscription, setSubscription] = useState(null);
    const [loadingData, setLoadingData] = useState(false);
    const { isDarkMode } = useTheme();

    const [error, setError] = useState('');
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
                    setLoadingData(false)
                } catch (err) {
                    setLoadingData(false);
                    console.error('Error fetching subscription:', err);
                }
            };
            fetchSubscription();
        }
    }, [session]);

    const [loading, setLoading] = useState(false);

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
            {/* Error messages */}
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                TransitionComponent={Fade}
            >
                <Alert
                    onClose={() => setError('')}
                    severity="error"
                    elevation={6}
                    sx={{
                        width: '100%',
                        borderRadius: '12px',
                        bgcolor: isDarkMode ? 'rgba(40, 40, 50, 0.9)' : undefined,
                        color: isDarkMode ? '#fff' : undefined,
                        '& .MuiAlert-icon': {
                            color: isDarkMode ? '#ff5252' : undefined
                        }
                    }}
                >
                    {error}
                </Alert>
            </Snackbar>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                    disabled={loadingData || loading}
                    onClick={() => {
                        if (subscription?.status === 'active') {
                            setError('You already have an active subscription.');
                        } else {
                            //call checkout session api
                            setLoading(true);
                            fetch(`${API_URL}/create-checkout-session`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    priceId: plan.priceId,
                                    userId: session?.user?.id, // Pass user ID if available
                                    email: session?.user?.email, // Pass user email if available
                                    fixed: plan.priceId === import.meta.env.VITE_STRIPE_PRICE_ID_FIXED ? true : false, // Check if it's a fixed price
                                }),
                            })
                                .then((response) => {
                                    if (!response.ok) {
                                        throw new Error('Network response was not ok');
                                    }
                                    return response.json();
                                }
                                )
                                .then((data) => {
                                    if (data.error) {
                                        setError(data.error);
                                    } else {
                                        // Redirect to Stripe Checkout
                                        window.location.href = data.url;
                                    }
                                })
                                .catch((error) => {
                                    console.error('Error during checkout:', error);
                                    setLoading(false);
                                    setError('An error occurred while processing your request. Please try again later.');
                                }
                                );
                        }
                    }}
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
                    {
                        loadingData ? <>
                            <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                        </> : <>
                            {
                                loading ? 'Processing...' : buttonText
                            }</>
                    }
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
