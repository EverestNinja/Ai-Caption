import { supabase } from '../lib/supabase';

interface UsageLimits {
  captions: {
    daily: number;
    max: number;
  };
  flyers: {
    daily: number;
    max: number;
  };
}

export const LIMITS: UsageLimits = {
  captions: {
    daily: 5,
    max: Infinity
  },
  flyers: {
    daily: 3,
    max: Infinity
  }
};

/**
 * Helper: Returns the current user (from Supabase Auth) or null.
 * -- unchanged name/return signature, but rewritten to actually return session.user.
 */
export const getUser = async (): Promise<{ id: string;[key: string]: any } | null> => {
  try {
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Error fetching session:', sessionError.message);
      return null;
    }

    if (session && session.user) {
      console.log('User is authenticated:', session.user);
      return session.user;
    } else {
      console.log('User is not authenticated');
      return null;
    }
  } catch (e) {
    console.error('Error in getUser:', e);
    return null;
  }
};

/**
 * Returns true if user’s usage for “type” today is < LIMITS[type].daily.
 * -- unchanged name and returns a boolean, but now runs a Supabase query.
 */
export const checkUsageLimit = async (type: 'captions' | 'flyers'): Promise<boolean> => {
  try {
    const user = await getUser();
    if (!user) {
      console.warn('checkUsageLimit: no authenticated user found.');
      return false; // or decide on false if no user
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // 1) Try to fetch an existing row for (user_id, date)
    const { data: row, error: selectError } = await supabase
      .from('usage')
      .select(type)
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      // PGRST116 = “No rows found” for single()
      console.error('Error checking usage limit (select):', selectError.message);
      return false;
    }

    const currentUsage = row ? (row[type] as number) : 0;
    return currentUsage < LIMITS[type].daily;
  } catch (e) {
    console.error('Error in checkUsageLimit:', e);
    return false;
  }
};

/**
 * Increments the user’s usage count for “type” (today) by 1.
 * -- unchanged name and returns void (Promise<void>), but now runs insert/update.
 */
export const incrementUsage = async (type: 'captions' | 'flyers'): Promise<void> => {
  try {
    const user = await getUser();
    if (!user) {
      console.warn('incrementUsage: no authenticated user found.');
      return;
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // 1) Fetch existing row (if any)
    const { data: existingRow, error: selectError } = await supabase
      .from('usage')
      .select('captions, flyers')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Error incrementUsage (select):', selectError.message);
      return;
    }

    if (existingRow) {
      // 2a) If a row exists, update only the relevant column
      const newCount = (existingRow[type] as number) + 1;
      const updatedFields = type === 'captions'
        ? { captions: newCount }
        : { flyers: newCount };

      const { error: updateError } = await supabase
        .from('usage')
        .update(updatedFields)
        .eq('user_id', user.id)
        .eq('date', today);

      if (updateError) {
        console.error('Error incrementUsage (update):', updateError.message);
      } else {
        console.log(`incrementUsage: Updated ${type} to ${newCount} for user ${user.id} on ${today}.`);
      }
    } else {
      // 2b) No existing row → insert a new one with captions=0 OR flyers=0, then +1
      const newRow =
        type === 'captions'
          ? { user_id: user.id, date: today, captions: 1, flyers: 0 }
          : { user_id: user.id, date: today, captions: 0, flyers: 1 };

      const { error: insertError } = await supabase
        .from('usage')
        .insert(newRow);

      if (insertError) {
        console.error('Error incrementUsage (insert):', insertError.message);
      } else {
        console.log(`incrementUsage: Inserted new usage row for ${type}=1 for user ${user.id} on ${today}.`);
      }
    }
  } catch (e) {
    console.error('Error in incrementUsage:', e);
  }
};

/**
 * Returns how many “type” usages are remaining for today.
 * -- unchanged name and returns number, but now reads from Supabase.
 */
export const getRemainingUsage = async (type: 'captions' | 'flyers'): Promise<number> => {
  try {
    const user = await getUser();
    if (!user) {
      console.warn('getRemainingUsage: no authenticated user found.');
      return 0;
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const { data: row, error: selectError } = await supabase
      .from('usage')
      .select(type)
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Error getRemainingUsage (select):', selectError.message);
      return 0;
    }

    const currentUsage = row ? (row[type] as number) : 0;
    return Math.max(0, LIMITS[type].daily - currentUsage);
  } catch (e) {
    console.error('Error in getRemainingUsage:', e);
    return 0;
  }
};

/**
 * Deletes all usage records for this user that are NOT today.
 * -- unchanged name and returns void (Promise<void>), but now runs a Supabase delete.
 */
export const clearDailyUsage = async (): Promise<void> => {
  try {
    const user = await getUser();
    if (!user) {
      console.warn('clearDailyUsage: no authenticated user found.');
      return;
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const { error: deleteError } = await supabase
      .from('usage')
      .delete()
      .eq('user_id', user.id)
      .neq('date', today);

    if (deleteError) {
      console.error('Error clearing old usage entries:', deleteError.message);
    } else {
      console.log(`clearDailyUsage: Removed all usage rows for user ${user.id} not on ${today}.`);
    }
  } catch (e) {
    console.error('Error in clearDailyUsage:', e);
  }
};
