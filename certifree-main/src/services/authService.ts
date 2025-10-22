import { supabase } from '@/lib/supabase';
import { componentDebug } from '@/lib/debugger';

const debug = componentDebug('authService');

export type AuthMode = 'login' | 'signup';

interface AuthResult {
  success: boolean;
  error?: string;
  requiresVerification?: boolean;
  data?: any;
}

interface ProfileCheckResult {
  exists: boolean;
  profile?: any;
  error?: string;
}

export const checkProfileExists = async (email: string): Promise<ProfileCheckResult> => {
  try {
    debug.log('Checking if profile exists', { email });

    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      debug.error('Error checking profile', { error: error.message });
      return { exists: false, error: error.message };
    }

    const exists = !!data;
    debug.log('Profile check result', { exists, hasData: !!data });

    return { exists, profile: data };
  } catch (err: any) {
    debug.error('Unhandled error checking profile', { error: err.message });
    return { exists: false, error: err.message };
  }
};

export const handleGoogleOAuth = async (mode: AuthMode): Promise<AuthResult> => {
  try {
    debug.log('Starting Google OAuth flow', { mode });

    const redirectTo = `${window.location.origin}/auth/callback`;

    localStorage.setItem('oauth_mode', mode);

    debug.log('Initiating OAuth redirect', { redirectTo, mode });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      debug.error('OAuth initiation failed', { error: error.message });
      localStorage.removeItem('oauth_mode');
      return { success: false, error: error.message };
    }

    debug.log('OAuth redirect initiated', { url: data?.url });
    
    return { success: true, data };
  } catch (err: any) {
    debug.error('Unhandled OAuth error', { error: err.message });
    localStorage.removeItem('oauth_mode');
    return { success: false, error: err.message };
  }
};

export const handleOAuthCallback = async (): Promise<AuthResult> => {
  try {
    debug.log('Processing OAuth callback');

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      debug.error('Session error', { error: sessionError.message });
      return { success: false, error: sessionError.message };
    }

    if (!session) {
      debug.warn('No session found after OAuth callback');
      return { success: false, error: 'No session found. Please try again.' };
    }

    const userEmail = session.user.email;
    const authMode = localStorage.getItem('oauth_mode') as AuthMode || 'login';
    
    debug.log('OAuth session established', { 
      email: userEmail, 
      mode: authMode,
      userId: session.user.id 
    });

    localStorage.removeItem('oauth_mode');

    const profileCheck = await checkProfileExists(userEmail!);

    if (authMode === 'signup') {
      if (profileCheck.exists) {
        debug.warn('Profile already exists during signup', { email: userEmail });
        return {
          success: false,
          error: 'An account with this email already exists. Please log in instead.',
        };
      }

      debug.log('New user signup via OAuth', { email: userEmail });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const verifyCheck = await checkProfileExists(userEmail!);
      if (!verifyCheck.exists) {
        debug.error('Profile was not created by trigger', { email: userEmail });
        return {
          success: false,
          error: 'Failed to create user profile. Please try again.',
        };
      }

      debug.log('Profile created successfully', { email: userEmail });
      return { success: true, data: session };
    }

    if (authMode === 'login') {
      if (!profileCheck.exists) {
        debug.warn('Login attempt without registered profile', { email: userEmail });
        
        await supabase.auth.signOut();
        
        return {
          success: false,
          error: 'No account found with this email. Please sign up first.',
        };
      }

      debug.log('Authorized login with existing profile', { email: userEmail });
      return { success: true, data: session };
    }

    debug.error('Unknown auth mode', { mode: authMode });
    return { success: false, error: 'Invalid authentication mode' };

  } catch (err: any) {
    debug.error('Unhandled callback error', { error: err.message, stack: err.stack });
    localStorage.removeItem('oauth_mode');
    return { success: false, error: err.message };
  }
};

export const handleEmailLogin = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  try {
    debug.log('Email login attempt', { email });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      debug.error('Email login failed', { error: error.message });
      return { success: false, error: error.message };
    }

    debug.log('Email login successful', { userId: data.user?.id });
    return { success: true, data };
  } catch (err: any) {
    debug.error('Unhandled login error', { error: err.message });
    return { success: false, error: err.message };
  }
};

export const handleEmailSignup = async (
  email: string,
  password: string,
  fullName: string
): Promise<AuthResult> => {
  try {
    debug.log('Email signup attempt', { email, fullName });

    const profileCheck = await checkProfileExists(email);
    if (profileCheck.exists) {
      debug.warn('Signup attempt with existing email', { email });
      return {
        success: false,
        error: 'An account with this email already exists. Please log in instead.',
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          avatar_url: '', // Default empty avatar
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      debug.error('Email signup failed', { error: error.message });
      return { success: false, error: error.message };
    }

    debug.log('Email signup successful', { 
      userId: data.user?.id,
      needsVerification: !data.session 
    });

    if (data.session) {
      return { success: true, data };
    }

    return {
      success: true,
      requiresVerification: true,
      data,
    };
  } catch (err: any) {
    debug.error('Unhandled signup error', { error: err.message });
    return { success: false, error: err.message };
  }
};

export const handleSignOut = async (): Promise<AuthResult> => {
  try {
    debug.log('Signing out user');

    const { error } = await supabase.auth.signOut();

    if (error) {
      debug.error('Sign out failed', { error: error.message });
      return { success: false, error: error.message };
    }

    localStorage.removeItem('oauth_mode');

    debug.log('Sign out successful');
    return { success: true };
  } catch (err: any) {
    debug.error('Unhandled sign out error', { error: err.message });
    return { success: false, error: err.message };
  }
};

export const resendVerificationEmail = async (email: string): Promise<AuthResult> => {
  try {
    debug.log('Resending verification email', { email });

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      debug.error('Resend verification failed', { error: error.message });
      return { success: false, error: error.message };
    }

    debug.log('Verification email resent', { email });
    return { success: true };
  } catch (err: any) {
    debug.error('Unhandled resend error', { error: err.message });
    return { success: false, error: err.message };
  }
};

export const validateOAuthConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    errors.push('VITE_SUPABASE_URL is not set');
  }

  if (!supabaseKey) {
    errors.push('VITE_SUPABASE_ANON_KEY is not set');
  }

  if (errors.length > 0) {
    debug.error('OAuth configuration incomplete', { errors });
  } else {
    debug.log('OAuth configuration validated');
  }

  return { valid: errors.length === 0, errors };
};
