import { componentDebug } from '@/lib/debugger';

const debug = componentDebug('envConfig');

interface EnvConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  formspreeEndpoint?: string;
  isProduction: boolean;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  config?: EnvConfig;
}

export const validateEnvironment = (): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const formspreeEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;
  
  if (!supabaseUrl) {
    errors.push('VITE_SUPABASE_URL is not set in environment variables');
  }

  if (!supabaseAnonKey) {
    errors.push('VITE_SUPABASE_ANON_KEY is not set in environment variables');
  }

  if (supabaseUrl && !supabaseUrl.startsWith('https://')) {
    errors.push('VITE_SUPABASE_URL must start with https://');
  }

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const googleClientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;

  if (!googleClientId || !googleClientSecret) {
    warnings.push('Google OAuth credentials not set (optional, configured in Supabase Dashboard)');
  }

  const isProduction = import.meta.env.PROD;

  if (isProduction && supabaseUrl && supabaseUrl.includes('localhost')) {
    warnings.push('Using localhost URL in production environment');
  }

  const valid = errors.length === 0;

  if (!valid) {
    debug.error('Environment validation failed', { errors });
  } else if (warnings.length > 0) {
    debug.warn('Environment validation passed with warnings', { warnings });
  } else {
    debug.log('Environment validation passed');
  }

  const result: ValidationResult = {
    valid,
    errors,
    warnings,
  };

  if (valid) {
    result.config = {
      supabaseUrl,
      supabaseAnonKey,
      formspreeEndpoint,
      isProduction,
    };
  }

  return result;
};

export const getValidationErrorMessage = (result: ValidationResult): string => {
  if (result.valid) return '';

  const lines = [
    'Environment Configuration Error:',
    '',
    ...result.errors.map(err => `   ${err}`),
    '',
    'Please create a .env file with:',
    'VITE_SUPABASE_URL=https://your-project.supabase.co',
    'VITE_SUPABASE_ANON_KEY=your-anon-key',
    '',
    'See .env.example for a template.',
  ];

  return lines.join('\n');
};

export const initializeEnvironment = (): EnvConfig => {
  const result = validateEnvironment();

  if (!result.valid) {
    const message = getValidationErrorMessage(result);
    console.error(message);
    
    if (import.meta.env.DEV) {
      alert('Environment configuration error!\n\nMissing required environment variables. Check the console for details.');
    }

    throw new Error('Environment validation failed. See console for details.');
  }

  if (result.warnings.length > 0) {
    console.warn('Environment warnings:');
    result.warnings.forEach(warning => console.warn(`    ${warning}`));
  }

  return result.config!;
};
