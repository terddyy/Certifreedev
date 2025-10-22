/**
 * reCAPTCHA Badge Component
 * 
 * Shows reCAPTCHA protection status and info
 * Used in forms to indicate spam protection
 */

import { Shield, Check, AlertCircle } from "lucide-react";

interface RecaptchaBadgeProps {
  loaded: boolean;
  error?: Error | null;
  className?: string;
}

export const RecaptchaBadge = ({ loaded, error, className = "" }: RecaptchaBadgeProps) => {
  if (error) {
    return (
      <div className={`flex items-center gap-2 text-xs text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800 ${className}`}>
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
        <span>
          reCAPTCHA unavailable - form protected by honeypot instead
        </span>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className={`flex items-center gap-2 text-xs text-gray-500 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
        <Shield className="h-4 w-4 flex-shrink-0 animate-pulse" />
        <span>Loading spam protection...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 p-3 rounded-lg border border-green-200 dark:border-green-800 ${className}`}>
      <Shield className="h-4 w-4 flex-shrink-0" />
      <Check className="h-3 w-3 flex-shrink-0" />
      <span>
        Protected by Google reCAPTCHA v3
      </span>
    </div>
  );
};
