/**
 * OAuth Callback Handler Page
 * 
 * This page handles the redirect after OAuth authentication (Google)
 * It validates the session, checks user registration status, and redirects appropriately.
 * 
 * SECURITY: Critical validation point - prevents unauthorized OAuth logins
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleOAuthCallback } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import { componentDebug } from '@/lib/debugger';

const debug = componentDebug('AuthCallback');

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const processCallback = async () => {
      debug.log('Processing OAuth callback');
      setStatus('processing');

      try {
        const result = await handleOAuthCallback();

        if (result.success) {
          debug.log('OAuth callback successful');
          setStatus('success');
          
          toast({
            title: 'Welcome!',
            description: 'Successfully signed in with Google.',
          });

          // Redirect to dashboard after short delay
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 1000);
        } else {
          debug.error('OAuth callback failed', { error: result.error });
          setStatus('error');
          setErrorMessage(result.error || 'Authentication failed');

          toast({
            title: 'Authentication Failed',
            description: result.error || 'An error occurred during sign-in.',
            variant: 'destructive',
          });

          // Redirect back to auth page after short delay
          setTimeout(() => {
            navigate('/auth', { replace: true });
          }, 3000);
        }
      } catch (err: any) {
        debug.error('Unhandled callback error', { error: err.message });
        setStatus('error');
        setErrorMessage(err.message);

        toast({
          title: 'Error',
          description: 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
        });

        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 3000);
      }
    };

    processCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001d3d] via-[#003566] to-[#000814] flex items-center justify-center p-6">
      <div className="bg-[#001d3d] border border-[#003566] rounded-xl p-8 max-w-md w-full shadow-2xl">
        {status === 'processing' && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#ffd60a] border-t-transparent mb-4"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Completing sign-in...</h2>
            <p className="text-gray-300">Please wait while we verify your credentials.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 mb-4">
              <svg
                className="w-6 h-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
            <p className="text-gray-300">Redirecting to your dashboard...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 mb-4">
              <svg
                className="w-6 h-6 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Authentication Failed</h2>
            <p className="text-gray-300 mb-4">{errorMessage}</p>
            <p className="text-sm text-gray-400">Redirecting back to sign-in...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
