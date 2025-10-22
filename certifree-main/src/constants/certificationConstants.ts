/**
 * Certification Constants
 * Configuration values and default forms for certification management
 */

import { CertificationInput } from '@/lib/admin';

// ============================================
// File Upload Configuration
// ============================================

/**
 * Maximum file upload size in megabytes
 */
export const MAX_UPLOAD_MB = 1;

/**
 * Allowed file MIME types for certification assets
 */
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'application/pdf',
];

// ============================================
// Form Defaults
// ============================================

/**
 * Default values for add certification form
 */
export const DEFAULT_ADD_FORM: Partial<CertificationInput> = {
  title: '',
  provider: '',
  category: '',
  difficulty: 'Beginner',
  duration: '',
  description: '',
  externalUrl: '',
  certificationType: 'Course',
  imageUrl: '',
  type: 'public',
  courseId: '',
  skills: [],
  prerequisites: [],
  tags: [],
  isFree: true,
};

/**
 * Default values for edit certification form
 */
export const DEFAULT_EDIT_FORM: Partial<CertificationInput> = {
  title: '',
  provider: '',
  category: '',
  difficulty: 'Beginner',
  duration: '',
  description: '',
  externalUrl: '',
  certificationType: 'Course',
  imageUrl: '',
  type: 'public',
  courseId: '',
  skills: [],
  prerequisites: [],
  tags: [],
};

// ============================================
// Filter Options
// ============================================

/**
 * Available sort options for certifications
 */
export const SORT_OPTIONS = ['newest', 'popular', 'rating'] as const;

/**
 * Available difficulty levels
 */
export const DIFFICULTY_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'] as const;

/**
 * Certification type options
 */
export const CERTIFICATION_TYPES = ['Course', 'Exam', 'Project', 'Bootcamp', 'Public', 'CertiFree'] as const;

/**
 * Certification visibility types
 */
export const VISIBILITY_TYPES = ['public', 'certifree'] as const;

// ============================================
// UI Configuration
// ============================================

/**
 * Debounce delay for search input in milliseconds
 */
export const SEARCH_DEBOUNCE_MS = 500;

/**
 * View mode options
 */
export const VIEW_MODES = ['grid', 'list'] as const;

// ============================================
// Validation Patterns
// ============================================

/**
 * UUID validation regex pattern
 */
export const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

/**
 * Slug validation regex pattern
 */
export const SLUG_REGEX = /^[a-z0-9-]+$/;
