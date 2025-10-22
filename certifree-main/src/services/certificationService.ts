/**
 * Certification Service Layer
 * Centralizes all API calls for certification management
 * Maintains exact backend compatibility with existing code
 */

import { supabase } from '@/lib/supabase';
import { 
  createCertification as createCertificationAdmin,
  updateCertification as updateCertificationAdmin,
  deleteCertification as deleteCertificationAdmin,
  listCategories as listCategoriesAdmin,
  CertificationInput,
} from '@/lib/admin';
import { uploadCertificationAsset as uploadCertificationAssetAdmin } from '@/lib/storage';
import {
  isFavorited as checkIsFavorited,
  addFavorite as addToFavorites,
  removeFavorite as removeFromFavorites,
} from '@/lib/favorites';
import {
  isTaking as checkIsTaking,
  startTaking as startTakingCertification,
  stopTaking as stopTakingCertification,
  countTakersFor as getTakersCount,
} from '@/lib/progress';
import { Certification } from '@/lib/types/certifications';

// ============================================
// Types
// ============================================

export interface Category {
  name: string;
  count: number;
}

export interface Provider {
  name: string;
  count: number;
}

// ============================================
// Category Management
// ============================================

/**
 * Fetch all categories from the backend
 * @returns Promise with categories data or error
 */
export const fetchCategories = async (): Promise<{
  data: Category[] | null;
  error: any;
}> => {
  try {
    const { data, error } = await listCategoriesAdmin();
    if (error) {
      return { data: null, error };
    }
    const formatted: Category[] = (data || []).map((c: any) => ({
      name: c.name,
      count: 0,
    }));
    return { data: formatted, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

// ============================================
// Provider Management
// ============================================

/**
 * Fetch all providers from certifications
 * @returns Promise with providers data or error
 */
export const fetchProviders = async (): Promise<{
  data: Provider[] | null;
  error: any;
}> => {
  try {
    const { data, error } = await supabase
      .from('certifications')
      .select('provider');

    if (error) {
      return { data: null, error };
    }

    // Extract unique providers and count occurrences
    const providerCounts: { [key: string]: number } = {};
    data.forEach((cert) => {
      providerCounts[cert.provider] = (providerCounts[cert.provider] || 0) + 1;
    });

    const uniqueProviders: Provider[] = Object.keys(providerCounts).map((name) => ({
      name,
      count: providerCounts[name],
    }));

    return { data: uniqueProviders, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

// ============================================
// CRUD Operations
// ============================================

/**
 * Create a new certification
 * @param input - Certification input data
 * @returns Promise with error (if any)
 */
export const createCertification = async (
  input: CertificationInput
): Promise<{ error?: any }> => {
  return await createCertificationAdmin(input);
};

/**
 * Update an existing certification
 * @param id - Certification ID
 * @param updates - Partial certification input data
 * @returns Promise with error (if any)
 */
export const updateCertification = async (
  id: string,
  updates: Partial<CertificationInput>
): Promise<{ error?: any }> => {
  return await updateCertificationAdmin(id, updates);
};

/**
 * Delete a certification
 * @param id - Certification ID
 * @returns Promise with error (if any)
 */
export const deleteCertification = async (
  id: string
): Promise<{ error?: any }> => {
  return await deleteCertificationAdmin(id);
};

/**
 * Check if a certification ID already exists
 * @param id - Certification ID to check
 * @returns Promise with exists flag and error (if any)
 */
export const checkDuplicateId = async (
  id: string
): Promise<{ exists: boolean; error?: any }> => {
  try {
    const { data, error } = await supabase
      .from('certifications')
      .select('id')
      .eq('id', id)
      .maybeSingle(); // Use maybeSingle() to avoid 406 error

    if (error) {
      return { exists: false, error };
    }

    return { exists: !!data, error: null };
  } catch (err) {
    return { exists: false, error: err };
  }
};

// ============================================
// Asset Management
// ============================================

/**
 * Upload a certification asset (image or PDF)
 * @param file - The file to upload
 * @param certId - Certification ID
 * @returns Promise with uploaded URL or error
 */
export const uploadCertificationAsset = async (
  file: File,
  certId: string
): Promise<{ url: string | null; error?: any }> => {
  return await uploadCertificationAssetAdmin(file, certId);
};

// ============================================
// User Progress & Favorites
// ============================================

/**
 * Check if a certification is favorited by user
 * @param userId - User ID
 * @param certId - Certification ID
 * @returns Promise with boolean result
 */
export const isFavorited = async (
  userId: string,
  certId: string
): Promise<{ data: boolean; error?: any }> => {
  try {
    const { data, error } = await checkIsFavorited(userId, certId);
    return { data: !!data, error };
  } catch (err) {
    return { data: false, error: err };
  }
};

/**
 * Check if a user is taking a certification
 * @param userId - User ID
 * @param certId - Certification ID
 * @returns Promise with boolean result
 */
export const isTaking = async (
  userId: string,
  certId: string
): Promise<{ data: boolean; error?: any }> => {
  try {
    const { data, error } = await checkIsTaking(userId, certId);
    return { data: !!data, error };
  } catch (err) {
    return { data: false, error: err };
  }
};

/**
 * Add a certification to user's favorites
 * @param userId - User ID
 * @param certId - Certification ID
 * @returns Promise with error (if any)
 */
export const addFavorite = async (
  userId: string,
  certId: string
): Promise<{ error?: any }> => {
  return await addToFavorites(userId, certId);
};

/**
 * Remove a certification from user's favorites
 * @param userId - User ID
 * @param certId - Certification ID
 * @returns Promise with error (if any)
 */
export const removeFavorite = async (
  userId: string,
  certId: string
): Promise<{ error?: any }> => {
  return await removeFromFavorites(userId, certId);
};

/**
 * Start taking a certification
 * @param userId - User ID
 * @param certId - Certification ID
 * @returns Promise with error (if any)
 */
export const startTaking = async (
  userId: string,
  certId: string
): Promise<{ error?: any }> => {
  return await startTakingCertification(userId, certId);
};

/**
 * Stop taking a certification
 * @param userId - User ID
 * @param certId - Certification ID
 * @returns Promise with error (if any)
 */
export const stopTaking = async (
  userId: string,
  certId: string
): Promise<{ error?: any }> => {
  return await stopTakingCertification(userId, certId);
};

/**
 * Get takers count for multiple certifications
 * @param certIds - Array of certification IDs
 * @returns Promise with counts record
 */
export const countTakersFor = async (
  certIds: string[]
): Promise<Record<string, number>> => {
  return await getTakersCount(certIds);
};
