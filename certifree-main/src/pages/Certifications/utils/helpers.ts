/**
 * Helper functions for Certifications page
 */

import { type Certification } from "@/lib/types/certifications";

/**
 * Validates if user is authenticated and redirects if not
 */
export const createAuthGuard = (
  userId: string | undefined,
  onUnauthenticated: () => void
) => {
  return (action: () => void) => {
    if (!userId) {
      onUnauthenticated();
      return;
    }
    action();
  };
};

/**
 * Checks if user has admin privileges
 */
export const isUserAdmin = (profile: any): boolean => {
  return !!(profile?.isAdmin || profile?.isSuperAdmin);
};

/**
 * Formats certification count message
 */
export const formatCertificationCount = (
  count: number,
  searchQuery?: string
): string => {
  const baseMessage = `Showing ${count} certifications`;
  return searchQuery
    ? `${baseMessage} for "${searchQuery}"`
    : baseMessage;
};

/**
 * Debounces search query to avoid excessive API calls
 */
export const processSearchQuery = (query: string, minLength = 2): string => {
  const trimmed = (query || "").trim();
  return trimmed.length >= minLength ? trimmed : "";
};
