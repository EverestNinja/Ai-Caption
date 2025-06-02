import { getAuth } from 'firebase/auth';

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
    max: Infinity // Unlimited for authenticated users
  },
  flyers: {
    daily: 3,
    max: Infinity // Unlimited for authenticated users
  }
};

const getStorageKey = (type: 'captions' | 'flyers') => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return `usage_${type}_${today}`;
};

export const checkUsageLimit = (type: 'captions' | 'flyers'): boolean => {

  const storageKey = getStorageKey(type);
  const currentUsage = parseInt(localStorage.getItem(storageKey) || '0');

  return currentUsage < LIMITS[type].daily;
};

export const incrementUsage = (type: 'captions' | 'flyers'): void => {
  const auth = getAuth();

  // If user is authenticated, don't track usage
  if (auth.currentUser) {
    return;
  }

  const storageKey = getStorageKey(type);
  const currentUsage = parseInt(localStorage.getItem(storageKey) || '0');
  localStorage.setItem(storageKey, (currentUsage + 1).toString());
};

export const getRemainingUsage = (type: 'captions' | 'flyers'): number => {
  const auth = getAuth();

  // If user is authenticated, return infinite usage
  if (auth.currentUser) {
    return Infinity;
  }

  const storageKey = getStorageKey(type);
  const currentUsage = parseInt(localStorage.getItem(storageKey) || '0');
  return Math.max(0, LIMITS[type].daily - currentUsage);
};

export const clearDailyUsage = (): void => {
  // Clear all usage data older than today
  const today = new Date().toISOString().split('T')[0];

  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('usage_') && !key.includes(today)) {
      localStorage.removeItem(key);
    }
  });
}; 