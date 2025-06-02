/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { supabase } from "../lib/supabase";

/**
 * Fetches a subscription from the `subscriptions` table by ID.
 * @param id - The ID of the subscription.
 * @returns The subscription data or null if not found.
 */
export async function getSubscriptionById(id: string): Promise<object | null> {
    const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching subscription:', error.message);
        return null;
    }

    return data;
}
