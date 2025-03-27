import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Add the Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-7G9N7R20SB';
    document.head.appendChild(script1);

    // Add the initialization script
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-7G9N7R20SB', {
        page_path: window.location.pathname,
        send_page_view: false
      });
    `;
    document.head.appendChild(script2);

    // Cleanup function
    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []);

  // Track page views when location changes
  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: location.pathname,
        page_title: document.title
      });
    }
  }, [location]);

  return null;
};

export default GoogleAnalytics; 