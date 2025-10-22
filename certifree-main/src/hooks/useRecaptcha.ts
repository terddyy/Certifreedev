import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

interface UseRecaptchaReturn {
  executeRecaptcha: (action: string) => Promise<string>;
  loaded: boolean;
  error: Error | null;
}

export const useRecaptcha = (siteKey: string): UseRecaptchaReturn => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (!siteKey || siteKey === 'your_recaptcha_site_key_here' || scriptLoadedRef.current) {
      if (!siteKey || siteKey === 'your_recaptcha_site_key_here') {
        setError(new Error('reCAPTCHA site key not configured'));
      }
      return;
    }

    const existingScript = document.querySelector(
      `script[src*="recaptcha/api.js"]`
    );

    if (existingScript) {
      setLoaded(true);
      scriptLoadedRef.current = true;
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      window.grecaptcha.ready(() => {
        setLoaded(true);
        scriptLoadedRef.current = true;
      });
    };

    script.onerror = () => {
      setError(new Error('Failed to load reCAPTCHA script'));
    };

    document.body.appendChild(script);

    return () => {
      const badge = document.querySelector('.grecaptcha-badge');
      if (badge) {
        badge.remove();
      }
    };
  }, [siteKey]);

  const executeRecaptcha = async (action: string): Promise<string> => {
    if (!loaded) {
      throw new Error('reCAPTCHA not loaded yet');
    }

    if (!window.grecaptcha) {
      throw new Error('reCAPTCHA not available');
    }

    try {
      const token = await window.grecaptcha.execute(siteKey, { action });
      return token;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to execute reCAPTCHA');
      setError(error);
      throw error;
    }
  };

  return { executeRecaptcha, loaded, error };
};
