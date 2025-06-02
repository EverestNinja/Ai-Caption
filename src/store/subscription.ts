// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { create } from 'zustand';
import { SubscriptionStore } from '../types';
import { supabase } from '../lib/supabase';

export const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  subscription: null,
  analysisCount: 0,
  isLoading: false,
  error: null,
  setSubscription: (subscription) => set({ subscription }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setAnalysisCount: (count) => set({ analysisCount: count }),
  incrementAnalysisCount: () => set((state) => ({ analysisCount: state.analysisCount + 1 })),
  fetchAnalysisCount: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { count, error } = await supabase
        .from('analyses')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);

      if (error) throw error;
      set({ analysisCount: count || 0 });
    } catch (error) {
      console.error('Error fetching analysis count:', error);
      set({ error: 'Failed to fetch analysis count' });
    }
  }
}));