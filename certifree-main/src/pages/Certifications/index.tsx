/**
 * Certifications Module Entry Point
 * Exports the main Certifications page component
 * 
 * This file serves as the public API for the Certifications module,
 * allowing other parts of the application to import the page without
 * knowing the internal structure.
 */

export { default } from "./CertificationsPage";
export { default as CertificationsPage } from "./CertificationsPage";

// Re-export types for external use if needed
export type { 
  ViewMode, 
  CertificationsFilters,
  CertificationsState,
} from "./types";
