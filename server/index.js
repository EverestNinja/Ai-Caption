// functions
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import cron from 'node-cron';
// Calculate expires_at = now + 30 days
const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

const stripeSecretKey = process.env.STRIPE_SK;
const stripe = Stripe(stripeSecretKey);


// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


// Create Express application
const app = express();
// define resend sdk
// const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors());

// webhook code must be here
// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.WEBHOOK_SECRET;

// Runs every day at midnight
// This is your delete function
async function deleteExpiredSubscriptions() {
    const now = new Date().toISOString();
    const { data, error } = await supabase
        .from('subscriptions')
        .delete()
        .lt('expires_at', now)
        .select(); // use select to see what was deleted

    if (error) {
        console.error('Error deleting expired subscriptions:', error);
    } else {
        console.log('Deleted expired subscriptions:', data);
    }
}

// Test it immediately
await deleteExpiredSubscriptions();

// Schedule it normally (optional)
cron.schedule('0 0 * * *', deleteExpiredSubscriptions);

// Handle payment succeeded event
async function handlePaymentSucceeded(event) {
    console.log(event)
    const subscriptionId = event.data.object.parent.subscription_details.subscription;
    if (!subscriptionId) {
        console.log('No subscription ID found in invoice.payment_succeeded event');
        return;
    }
    if (event.data.object.billing_reason === 'subscription_create' || event.data.object.billing_reason === 'subscription_cycle') {
        console.log(`Handling subscription creation or cycle for subscription ID: ${subscriptionId}`);
        try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const userId = subscription.metadata?.user_id;
            const plan_id = subscription.metadata?.plan_id;
            const fixed = subscription.metadata?.fixed === 'true'; // Convert string to boolean
            if (fixed) {
                await stripe.subscriptions.update(subscriptionId, {
                    cancel_at_period_end: true,
                });
                console.log(`Subscription ${subscriptionId} set to cancel at period end`);
            }
            if (!userId) {
                console.error('Missing user_id in subscription metadata');
                return;
            }
            const { data: existingSub, error: selectError } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('stripe_subscription_id', subscriptionId)
                .single();
            if (selectError && selectError.code !== 'PGRST116') {
                console.error('Error checking subscription existence:', selectError);
                return;
            }
            if (existingSub) {
                const { error: updateError } = await supabase
                    .from('subscriptions')
                    .update({
                        status: 'active',
                        plan_id: plan_id,
                        email: event.data.object.customer_email,
                    })
                    .eq('stripe_subscription_id', subscriptionId);
                if (updateError) {
                    console.error('Error updating subscription:', updateError);
                } else {
                    console.log(`Subscription ${subscriptionId} updated`);
                }
            } else {
                const { error: insertError } = await supabase
                    .from('subscriptions')
                    .insert([{
                        id: userId,
                        plan_id: plan_id,
                        stripe_subscription_id: subscriptionId,
                        status: 'active',
                        email: event.data.object.customer_email,
                    }]);
                if (insertError) {
                    console.error('Error inserting subscription:', insertError);
                } else {
                    console.log(`Subscription ${subscriptionId} inserted for user ${userId}`);
                }
            }
        } catch (err) {
            console.error('Error handling invoice.payment_succeeded:', err);
        }
    }

}



// Handle subscription deleted event
async function handleSubscriptionDeleted(event) {
    const subscriptionId = event.data.object.id;
    try {
        const { error } = await supabase
            .from('subscriptions')
            .delete()
            .eq('stripe_subscription_id', subscriptionId);
        if (error) {
            console.error('Error deleting subscription:', error);
        } else {
            console.log(`Subscription ${subscriptionId} deleted`);
        }
    } catch (err) {
        console.error('Error handling customer.subscription.deleted:', err);
    }
}

// Handle payment failed event
async function handlePaymentFailed(event) {
    const subscriptionId = event.data.object.parent.subscription_details.subscription;
    if (subscriptionId) {
        try {
            const { error } = await supabase
                .from('subscriptions')
                .delete()
                .eq('stripe_subscription_id', subscriptionId);
            if (error) {
                console.error('Error deleting subscription on payment failure:', error);
            } else {
                console.log(`Subscription ${subscriptionId} deleted due to payment failure`);
            }
        } catch (err) {
            console.error('Error handling invoice.payment_failed:', err);
        }
    } else {
        console.log('No subscription ID found in invoice.payment_failed event');
    }
}

// Handle one-time payment succeeded event
async function handleOnetimePayment(event) {
    const paymentIntent = event.data.object;
    const userId = paymentIntent.metadata?.user_id;
    const plan_id = paymentIntent.metadata?.plan_id;
    const email = paymentIntent.metadata?.email;

    if (!userId || !plan_id) {
        console.error('Missing user_id or plan_id in payment intent metadata');
        return;
    }

    try {
        const { data: existingSub, error: selectError } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('stripe_subscription_id', paymentIntent.id)
            .single();

        if (selectError && selectError.code !== 'PGRST116') {
            console.error('Error checking subscription existence:', selectError);
            return;
        }

        if (existingSub) {
            const { error: updateError } = await supabase
                .from('subscriptions')
                .update({
                    status: 'active',
                    plan_id: plan_id,
                    expires_at: expiresAt,
                    email: email,
                })
                .eq('stripe_subscription_id', paymentIntent.id);
            if (updateError) {
                console.error('Error updating subscription:', updateError);
            } else {
                console.log(`Subscription ${paymentIntent.id} updated`);
            }
        } else {
            const { error: insertError } = await supabase
                .from('subscriptions')
                .insert([{
                    id: userId,
                    plan_id: plan_id,
                    stripe_subscription_id: paymentIntent.id,
                    status: 'active',
                    expires_at: expiresAt,
                    email: email,
                }]);
            if (insertError) {
                console.error('Error inserting subscription:', insertError);
            } else {
                console.log(`Subscription ${paymentIntent.id} inserted for user ${userId}`);
            }
        }

    } catch (err) {
        console.error('Error handling payment_intent.succeeded:', err);
    }
}
// Webhook endpoint
app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
        const sig = req.headers["stripe-signature"];
        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
            console.log(`Received event: ${event.type}`);
        } catch (err) {
            console.error("Webhook signature verification failed:", err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        try {
            switch (event.type) {
                case 'invoice.payment_succeeded':
                    await handlePaymentSucceeded(event);
                    break;
                case 'customer.subscription.deleted':
                    await handleSubscriptionDeleted(event);
                    break;
                case 'invoice.payment_failed':
                    await handlePaymentFailed(event);
                    break;
                case 'payment_intent.succeeded':
                    await handleOnetimePayment(event);
                    break;
                default:
                    console.log(`Unhandled event type ${event.type}`);
            }
        } catch (error) {
            console.error(`Error handling event ${event.type}:`, error);
        }

        res.json({ received: true });
    }
);

app.use(express.json());

// Define your specific routes here
// create checkout sessions
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { priceId, userId, email, fixed } = req.body;
        if (!priceId || !userId || !email) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Search for existing Stripe customers with the email
        const { data: stripeCustomers } = await stripe.customers.list({
            email: email,
            limit: 10,
        });

        let customer;
        let customerId;

        if (stripeCustomers.length === 0) {
            // No customer found, create a new one
            customer = await stripe.customers.create({
                email,
                metadata: { supabase_user_id: userId }
            });
            customerId = customer.id;
        } else if (stripeCustomers.length === 1) {
            // One customer found, use it
            customer = stripeCustomers[0];
            customerId = customer.id;
        } else {
            // Multiple customers found, use the first one and log a warning
            console.warn(`Multiple Stripe customers found for email ${email}. Using the first one.`);
            customer = stripeCustomers[0];
            customerId = customer.id;
        }

        // Check if the user exists in Supabase 'users' table
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('stripe_customer_id')
            .eq('id', userId)
            .single();

        if (userError && userError.code !== 'PGRST116') {
            console.error('Error fetching user from Supabase:', userError);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (user) {
            // User exists, update stripe_customer_id if necessary
            if (!user.stripe_customer_id || user.stripe_customer_id !== customerId) {
                const { error: updateError } = await supabase
                    .from('users')
                    .update({ stripe_customer_id: customerId })
                    .eq('id', userId);
                if (updateError) {
                    console.error('Error updating stripe_customer_id:', updateError);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
            }
        } else {
            // User doesn’t exist, insert a new one
            const { error: insertError } = await supabase
                .from('users')
                .insert([{ id: userId, email, stripe_customer_id: customerId }]);
            if (insertError) {
                console.error('Error inserting user:', insertError);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        }

        if (fixed) {

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                customer: customerId,
                mode: 'payment',
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                payment_intent_data: {
                    metadata: {
                        user_id: userId,
                        email: email,
                        plan_id: priceId,
                        fixed: fixed ? 'true' : 'false', // Store fixed status as a string
                    }
                },
                success_url: `${process.env.FRONTEND_URL}/success`,
                cancel_url: `${process.env.FRONTEND_URL}/pricing`,
            });
            return res.json({ url: session.url });

        } else {
            // Create the checkout session
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                customer: customerId,
                mode: 'subscription',
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                subscription_data: {
                    metadata: {
                        user_id: userId,
                        email: email,
                        plan_id: priceId,
                        fixed: fixed ? 'true' : 'false', // Store fixed status as a string
                    }
                },
                success_url: `${process.env.FRONTEND_URL}/success`,
                cancel_url: `${process.env.FRONTEND_URL}/pricing`,
            });
            return res.json({ url: session.url });

        }


    } catch (error) {
        console.error('Error creating checkout session:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST or DELETE endpoint to remove a subscription
app.post('/delete-subscription', async (req, res) => {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
        return res.status(400).json({ error: 'subscriptionId is required' });
    }

    const { data, error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('stripe_subscription_id', subscriptionId)
        .select(); // Optional: returns deleted rows

    if (error) {
        console.error('Failed to delete subscription:', error);
        return res.status(500).json({ error: 'Failed to delete subscription' });
    }

    if (!data.length) {
        return res.status(404).json({ message: 'Subscription not found' });
    }

    res.status(200).json({ message: 'Subscription deleted successfully', deleted: data });
});
//billing portal
app.post('/create-billing-portal', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // List customers with the email (Stripe returns oldest first)
        const { data: customers } = await stripe.customers.list({
            email,
            limit: 10
        });

        if (!customers || customers.length === 0) {
            return res.status(404).json({ error: 'No customer found with this email' });
        }

        const customer = customers[0]; // Oldest customer

        // Create billing portal session
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customer.id,
            return_url: `${process.env.FRONTEND_URL || 'https://yourfrontend.com'}`
        });

        return res.json({ url: portalSession.url });

    } catch (err) {
        console.error('Error creating billing portal session:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Home route
app.get('/', (req, res) => {
    res.send({
        message: 'server is running'
    });
});

// Define port
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

