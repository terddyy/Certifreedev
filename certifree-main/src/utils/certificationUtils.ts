/**
 * Certification Utility Functions
 * Pure functions for validation, transformation, and slug generation
 */

import { CertificationInput } from '@/lib/admin';
import { Certification } from '@/lib/types/certifications';

/**
 * Generate a URL-safe slug from a certification title
 * @param title - The certification title
 * @returns A lowercase, hyphenated slug
 */
export const generateSlugFromTitle = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Validate if a string is a valid slug format
 * @param slug - The string to validate
 * @returns True if valid slug format
 */
export const isValidSlug = (slug: string): boolean => {
  return /^[a-z0-9-]+$/.test(slug) && slug.length > 0;
};

/**
 * Validate a URL string
 * @param url - The URL to validate
 * @returns Object with validation result and optional error message
 */
export const validateURL = (url: string): { valid: boolean; error?: string } => {
  if (!url || url.trim() === '' || url === '#') {
    return { valid: false, error: 'Please provide a valid external URL for the certification.' };
  }

  try {
    new URL(url);
    return { valid: true };
  } catch {
    return { valid: false, error: 'Please provide a valid URL starting with http:// or https://' };
  }
};

/**
 * Validate a UUID string
 * @param uuid - The UUID to validate
 * @returns True if valid UUID format
 */
export const validateUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(uuid);
};

/**
 * Validate certification form data
 * @param form - Partial certification input data
 * @returns Object with validation result and array of error messages
 */
export const validateCertificationForm = (
  form: Partial<CertificationInput>
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Required fields
  if (!form.title || form.title.trim() === '') {
    errors.push('Title is required');
  }
  if (!form.provider || form.provider.trim() === '') {
    errors.push('Provider is required');
  }
  if (!form.category || form.category.trim() === '') {
    errors.push('Category is required');
  }

  // URL validation
  if (form.externalUrl) {
    const urlValidation = validateURL(form.externalUrl);
    if (!urlValidation.valid) {
      errors.push(urlValidation.error || 'Invalid URL');
    }
  } else {
    errors.push('External URL is required');
  }

  // UUID validation for CertiFree course IDs
  if (form.type === 'certifree' && form.courseId) {
    if (!validateUUID(form.courseId)) {
      errors.push('Course ID must be a valid UUID format or left empty');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate file upload
 * @param file - The file to validate
 * @param maxSizeMB - Maximum file size in MB
 * @param allowedTypes - Array of allowed MIME types
 * @returns Object with validation result and optional error message
 */
export const validateFileUpload = (
  file: File,
  maxSizeMB: number,
  allowedTypes: string[]
): { valid: boolean; error?: string } => {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${allowedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}`,
    };
  }

  // Check file size
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
};

/**
 * Map CertificationInput to Certification type
 * Used for optimistic UI updates after creating a certification
 * @param input - The certification input data
 * @returns A Certification object
 */
export const mapCertificationInputToCertification = (
  input: CertificationInput
): Certification => {
  return {
    id: input.id,
    title: input.title,
    provider: input.provider,
    category: input.category,
    difficulty: input.difficulty,
    duration: input.duration,
    rating: 0,
    total_reviews: 0,
    description: input.description,
    skills: input.skills || [],
    prerequisites: input.prerequisites || [],
    image_url: input.imageUrl || null,
    external_url: input.externalUrl || null,
    is_free: input.isFree ?? true,
    certification_type: input.certificationType,
    career_impact: 0,
    completion_count: 0,
    tags: input.tags || [],
    admin_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

/**
 * Generate error messages from validation errors
 * @param errors - Array of error messages
 * @returns A formatted error message string
 */
export const formatValidationErrors = (errors: string[]): string => {
  if (errors.length === 0) return '';
  if (errors.length === 1) return errors[0];
  return `Multiple errors:\n${errors.map((e, i) => `${i + 1}. ${e}`).join('\n')}`;
};
