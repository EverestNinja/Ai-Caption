type EventParams = {
  event_category?: string;
  event_label?: string;
  value?: number | string;
  [key: string]: any;
};

export const trackEvent = (eventName: string, params?: EventParams) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

// Common events
export const AnalyticsEvents = {
  GENERATE_CAPTION: 'generate_caption',
  COPY_CAPTION: 'copy_caption',
  THEME_TOGGLE: 'theme_toggle',
  POST_TYPE_SELECT: 'post_type_select',
  BUSINESS_TYPE_SELECT: 'business_type_select',
} as const; 