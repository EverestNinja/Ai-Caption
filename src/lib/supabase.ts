// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config';

// Get the site URL from the environment or use a default for development
const siteUrl = import.meta.env.VITE_SITE_URL || 'http://localhost:5173';

// Helper to check if Supabase is configured
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Create a dummy client when not configured
const dummyClient = {
  auth: {
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
    getSession: () => Promise.resolve({ data: { session: null } }),
    signUp: () => Promise.reject(new Error('Supabase is not configured')),
    signInWithPassword: () => Promise.reject(new Error('Supabase is not configured')),
    signOut: () => Promise.resolve(),
    resetPasswordForEmail: () => Promise.reject(new Error('Supabase is not configured')),
    updateUser: () => Promise.reject(new Error('Supabase is not configured')),
  },
  from: () => ({
    select: () => Promise.reject(new Error('Supabase is not configured')),
    insert: () => Promise.reject(new Error('Supabase is not configured')),
    update: () => Promise.reject(new Error('Supabase is not configured')),
    delete: () => Promise.reject(new Error('Supabase is not configured')),
  }),
};

// Initialize Supabase client only if properly configured
export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      site_url: siteUrl
    }
  })
  : dummyClient;

// Configure auth settings to require email verification
if (isSupabaseConfigured) {
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth state change:', event, 'User:', session?.user);

    if (event === 'SIGNED_IN' && session?.user && !session.user.email_confirmed_at) {
      console.log('Unverified user attempting to sign in - signing out');
      await supabase.auth.signOut();
    }
  });
}

// Configure sign-up settings
export const signUpWithEmail = async (email: string, password: string) => {
  if (!isSupabaseConfigured) {
    throw new Error('Authentication is not available. Please configure Supabase credentials.');
  }

  console.log('Attempting to sign up user:', email);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth?mode=sign-in`,
      data: {
        email_confirmed: false,
      }
    }
  });

  if (error) {
    console.error('Sign up error:', error);
    throw error;
  }

  console.log('Sign up response:', data);
  return data;
};

// Configure sign-in settings
export const signInWithEmail = async (email: string, password: string) => {
  if (!isSupabaseConfigured) {
    throw new Error('Authentication is not available. Please configure Supabase credentials.');
  }

  console.log('Attempting to sign in user:', email);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error('Sign in error:', error);
    throw error;
  }

  console.log('Sign in response:', data);

  // Check if email is confirmed
  if (!data.user?.email_confirmed_at) {
    console.log('Unverified user attempting to sign in - signing out');
    await supabase.auth.signOut();
    throw new Error('Please verify your email before signing in.');
  }

  return data;
};

// Password reset request
export const requestPasswordReset = async (email: string) => {
  if (!isSupabaseConfigured) {
    throw new Error('Authentication is not available. Please configure Supabase credentials.');
  }

  console.log('Requesting password reset for:', email);

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth?mode=reset-password`,
  });

  if (error) {
    console.error('Password reset request error:', error);
    throw error;
  }

  console.log('Password reset request sent');
  return data;
};

// Update password
export const updatePassword = async (newPassword: string) => {
  if (!isSupabaseConfigured) {
    throw new Error('Authentication is not available. Please configure Supabase credentials.');
  }

  console.log('Updating password');

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) {
    console.error('Password update error:', error);
    throw error;
  }

  console.log('Password updated successfully');
  return data;
};