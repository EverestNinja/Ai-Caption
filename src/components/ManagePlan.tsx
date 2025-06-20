/* eslint-disable @typescript-eslint/ban-ts-comment */
// src/components/ManagePlanPage.tsx
// @ts-nocheck
import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Card,
    CardContent,
    Grid,
} from '@mui/material';
import { useAuthStore } from '../store/auth';
import { useTheme } from '../context/ThemeContext';
import { getSubscriptionById } from '../services/subscriptions'; // <-- adjust path if needed
import { API_URL } from '../config/const';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';


// -----------------------------
// STEP 1: Interface matching your “subscriptions” table
// -----------------------------
interface SubscriptionInfo {
    id: string;                     // uuid
    plan_id: string;                // text
    stripe_subscription_id: string; // text
    status: string;                 // text (“active”, “canceled”, etc.)
    created_at: string;             // timestampz (ISO string)
    email: string;                  // text
    expires_at: string;             // date (ISO string e.g. "2025-06-15")
}

const ManagePlanPage: React.FC = () => {
    const session = useAuthStore((state) => state.session);
    const { isDarkMode } = useTheme();

    const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
    const [loadingData, setLoadingData] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    // NEW: State for confirmation modal
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);

    // -----------------------------
    // STEP 2: Fetch a single subscription
    // -----------------------------
    useEffect(() => {
        const fetchSubscription = async () => {
            if (!session?.user) {
                setSubscription(null);
                setLoadingData(false);
                return;
            }

            try {
                setLoadingData(true);
                setError('');

                // getSubscriptionById should return a SubscriptionInfo object or null
                const sub: SubscriptionInfo | null = await getSubscriptionById(session.user.id);

                setSubscription(sub);
                setLoadingData(false);
            } catch (err) {
                console.error('Error fetching subscription:', err);
                setError('Unable to load your subscription. Please try again later.');
                setSubscription(null);
                setLoadingData(false);
            }
        };

        fetchSubscription();
    }, [session]);

    // NEW: Delete handler
    const handleDeleteSubscription = async () => {
        if (!subscription) return;
        setDeleting(true);

        const { error: deleteError } = await supabase
            .from('subscriptions')
            .delete()
            .eq('id', subscription.id);

        setDeleting(false);

        if (deleteError) {
            console.error('Error deleting subscription:', deleteError);
            return;
        }

        // After deletion, close modal and clear subscription
        setConfirmOpen(false);
        setSubscription(null);
        window.location.reload(); // Reload to reflect changes
    };

    return (
        <div style={{
            marginTop: '60px', // Adjust based on your app's header height
        }}>
            <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Typography
                    sx={{
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                        fontWeight: 600,
                        lineHeight: 1.2,
                        mb: 2,
                    }}
                >
                    Manage Your Plan
                </Typography>

                {loadingData ? (
                    <Paper
                        elevation={3}
                        elevation={3}
                        sx={{
                            mt: 3,
                            p: 3,
                            display: 'flex',
                            height: '45vh',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 2,
                            backgroundColor: isDarkMode ? 'grey.900' : 'grey.50',
                            boxShadow: isDarkMode
                                ? '0px 4px 20px rgba(0,0,0,0.6)'
                                : '0px 4px 20px rgba(0,0,0,0.1)',
                        }}
                    >
                        <CircularProgress size={44} color="inherit" />
                    </Paper>
                ) : error ? (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                ) : subscription === null ? (
                    <Card
                        sx={{
                            mt: 3,
                            p: 3,
                            display: 'flex',
                            height: '45vh',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 2,
                            backgroundColor: isDarkMode ? 'grey.900' : 'grey.50',
                            boxShadow: isDarkMode
                                ? '0px 4px 20px rgba(0,0,0,0.6)'
                                : '0px 4px 20px rgba(0,0,0,0.1)',
                        }}
                    >
                        <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 4 } }}>
                            <Typography
                                variant="h6"
                                color={isDarkMode ? 'white' : 'text.secondary'}
                                sx={{ mb: 3 }}
                            >
                                Ops! You don't have an active subscription.
                            </Typography>
                            <Link to="/pricing" style={{ textDecoration: 'none' }}>
                                <Button
                                    component="a"
                                    fullWidth
                                    sx={{
                                        maxWidth: { xs: '80%', sm: 260 },
                                        py: 1.5,
                                        px: 3,
                                        borderRadius: 3,
                                        background: 'linear-gradient(45deg, #FF512F, #DD2476)',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                        fontSize: '1rem',
                                        color: '#fff',
                                        textTransform: 'none',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #DD2476, #FF512F)',
                                            transform: 'translateY(-3px)',
                                            boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                                        },
                                        '&:active': {
                                            transform: 'translateY(1px)',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                        },
                                    }}
                                >
                                    Upgrade Now
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <Paper
                        elevation={3}
                        sx={{
                            mt: 3,
                            p: { xs: 2, sm: 3 },
                            borderRadius: 2,
                            backgroundColor: isDarkMode ? 'grey.900' : 'grey.50',
                            boxShadow: isDarkMode
                                ? '0px 4px 20px rgba(0,0,0,0.6)'
                                : '0px 4px 20px rgba(0,0,0,0.1)',
                        }}
                    >
                        <Grid container spacing={2}>
                            {/* Row: Plan Name */}
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1" color={isDarkMode ? 'white' : 'text.secondary'}>
                                    Plan Name
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography color={isDarkMode ? 'white' : 'text.secondary'} variant="body1">
                                    {subscription.plan_id === `${import.meta.env.VITE_STRIPE_PRICE_ID_FIXED}` ? 'One-Time' : 'Monthly'}
                                </Typography>
                            </Grid>
                            {/* Row: Plan ID */}
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1" color={isDarkMode ? 'white' : 'text.secondary'}>
                                    Plan ID
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography color={isDarkMode ? 'white' : 'text.secondary'} variant="body1">
                                    {subscription.plan_id}
                                </Typography>
                            </Grid>
                            {/* Row: Subscription ID */}
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1" color={isDarkMode ? 'white' : 'text.secondary'}>
                                    Subscription ID
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography color={isDarkMode ? 'white' : 'text.secondary'} variant="body1">
                                    {subscription.stripe_subscription_id}
                                </Typography>
                            </Grid>
                            {/* Row: Current Status */}
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1" color={isDarkMode ? 'white' : 'text.secondary'}>
                                    Current Status
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        textTransform: 'capitalize',
                                        color:
                                            subscription.status === 'active'
                                                ? 'success.main'
                                                : subscription.status === 'past_due'
                                                    ? 'warning.main'
                                                    : 'text.secondary',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {subscription.status}
                                </Typography>
                            </Grid>
                            {/* Row: Purchase Date */}
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1" color={isDarkMode ? 'white' : 'text.secondary'}>
                                    Purchase Date
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography color={isDarkMode ? 'white' : 'text.secondary'} variant="body1">
                                    {new Date(subscription.created_at).toLocaleString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </Typography>
                            </Grid>
                            {/* Row: Email */}
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1" color={isDarkMode ? 'white' : 'text.secondary'}>
                                    Email
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography color={isDarkMode ? 'white' : 'text.secondary'} variant="body1">
                                    {subscription.email}
                                </Typography>
                            </Grid>
                            {/* Row: Expires At */}
                            {subscription.expires_at && (
                                <>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle1" color={isDarkMode ? 'white' : 'text.secondary'}>
                                            Expires At
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography color={isDarkMode ? 'white' : 'text.secondary'} variant="body1">
                                            {new Date(subscription.expires_at).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })}
                                        </Typography>
                                    </Grid>
                                </>
                            )}
                        </Grid>

                        {/* Action Buttons */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mt: 3,
                                gap: 2,
                                flexWrap: 'wrap',
                            }}
                        >
                            <Button
                                onClick={() => {
                                    if (subscription?.status === 'active') {
                                        setLoading(true);
                                        fetch(`${API_URL}/create-billing-portal`, {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({ email: session?.user.email }),
                                        })
                                            .then((response) => {
                                                if (response.ok) {
                                                    return response.json();
                                                }
                                                throw new Error('Failed to create billing portal');
                                            })
                                            .then((data) => {
                                                if (data.url) {
                                                    window.location.href = data.url;
                                                }
                                            })
                                            .catch((error) => {
                                                setLoading(false);
                                                console.error('Error:', error);
                                            });
                                    }
                                }}
                                variant="contained"
                                sx={{
                                    textTransform: 'none',
                                    borderRadius: 2,
                                    px: 4,
                                    py: 1.25,
                                    background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4)',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #833AB4, #5851DB, #405DE6)',
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                                    },
                                }}
                            >
                                {loading ? <CircularProgress color="inherit" size={24} /> : subscription.expires_at ? 'Manage payment methods' : 'Manage subscriptions'}
                            </Button>

                            {subscription.status === 'active' && subscription.expires_at && (
                                <Button
                                    variant="contained"
                                    onClick={() => setConfirmOpen(true)}
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: 2,
                                        px: 4,
                                        py: 1.25,
                                        background: 'linear-gradient(45deg, #D32F2F, #C62828)',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #C62828, #B71C1C)',
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                                        },
                                    }}
                                >
                                    Cancel now
                                </Button>
                            )}
                        </Box>
                    </Paper>
                )}

                {/* Confirmation Modal */}
                <Dialog
                    open={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                    fullWidth
                    maxWidth="xs"
                    sx={{
                        '& .MuiDialog-paper': {
                            backgroundColor: isDarkMode ? 'grey.900' : 'white',
                            color: isDarkMode ? 'white' : 'black',
                            borderRadius: 3,
                        },
                        backdropFilter: 'blur(4px)',
                    }}
                >
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1" color="inherit">
                            This operation cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmOpen(false)} disabled={deleting}>
                            No
                        </Button>
                        <Button
                            onClick={handleDeleteSubscription}
                            color="error"
                            variant="contained"
                            disabled={deleting}
                        >
                            {deleting ? 'Deleting...' : 'Yes, Delete'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </div>
    );
};

export default ManagePlanPage;
