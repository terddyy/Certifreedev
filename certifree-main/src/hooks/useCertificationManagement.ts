/**
 * useCertificationManagement Hook
 * Manages CRUD operations for certifications with realtime updates
 */

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import {
  createCertification as createCertificationService,
  updateCertification as updateCertificationService,
  deleteCertification as deleteCertificationService,
  checkDuplicateId,
} from '@/services/certificationService';
import { CertificationInput } from '@/lib/admin';
import { Certification } from '@/lib/types/certifications';
import {
  generateSlugFromTitle,
  validateCertificationForm,
  validateURL,
  validateUUID,
  mapCertificationInputToCertification,
  formatValidationErrors,
} from '@/utils/certificationUtils';
import { componentDebug } from '@/lib/debugger';

const debug = componentDebug('useCertificationManagement');

// Transform database response from snake_case to camelCase
const transformCertification = (dbCertification: any): Certification => ({
  id: dbCertification.id,
  title: dbCertification.title,
  provider: dbCertification.provider,
  category: dbCertification.category,
  difficulty: dbCertification.difficulty,
  duration: dbCertification.duration,
  rating: dbCertification.rating || 0,
  total_reviews: dbCertification.total_reviews || 0,
  description: dbCertification.description,
  skills: dbCertification.skills || [],
  prerequisites: dbCertification.prerequisites || [],
  image_url: dbCertification.image_url || null,
  external_url: dbCertification.external_url || null,
  is_free: dbCertification.is_free || true,
  certification_type: dbCertification.certification_type || 'Course',
  career_impact: dbCertification.career_impact || 0,
  completion_count: dbCertification.completion_count || 0,
  tags: dbCertification.tags || [],
  admin_id: dbCertification.admin_id || null,
  created_at: dbCertification.created_at,
  updated_at: dbCertification.updated_at || new Date().toISOString(),
});

export const useCertificationManagement = () => {
  const { toast } = useToast();
  
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch all certifications on mount
  useEffect(() => {
    const fetchCertifications = async () => {
      debug.log('Fetching all certifications');
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from('certifications')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) {
          debug.error('Error fetching certifications', { error: fetchError.message });
          setError(fetchError.message);
        } else {
          const transformedCerts = (data || []).map(transformCertification);
          setCertifications(transformedCerts);
          debug.log('Certifications fetched', { count: transformedCerts.length });
        }
      } catch (err: any) {
        debug.error('Unhandled error fetching certifications', { 
          error: err.message, 
          stack: err.stack 
        });
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  // Subscribe to realtime certification inserts
  useEffect(() => {
    const channel = supabase
      .channel('certifications-inserts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'certifications' },
        (payload) => {
          const title = (payload.new as any)?.title || 'New certification';
          debug.log('New certification added via realtime', { title });
          toast({ title: 'New certification added', description: title });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  /**
   * Create a new certification
   */
  const createCertification = async (
    input: Partial<CertificationInput>
  ): Promise<{ error?: any }> => {
    debug.log('Creating certification', { input });

    // Validate form
    const validation = validateCertificationForm(input);
    if (!validation.valid) {
      const errorMessage = formatValidationErrors(validation.errors);
      debug.error('Validation failed', { errors: validation.errors });
      toast({
        title: 'Missing or invalid fields',
        description: errorMessage,
        variant: 'destructive',
      });
      return { error: new Error(errorMessage) };
    }

    // Validate external URL
    const urlValidation = validateURL(input.externalUrl || '');
    if (!urlValidation.valid) {
      debug.error('URL validation failed', { url: input.externalUrl });
      toast({
        title: 'Invalid URL',
        description: urlValidation.error,
        variant: 'destructive',
      });
      return { error: new Error(urlValidation.error) };
    }

    // Generate ID (slug) from title
    const generatedId = generateSlugFromTitle(input.title || '');
    if (!generatedId) {
      debug.error('Failed to generate slug from title', { title: input.title });
      toast({
        title: 'Invalid Title',
        description: 'Could not generate a valid ID from the title. Please provide a more descriptive title.',
        variant: 'destructive',
      });
      return { error: new Error('Invalid title') };
    }

    // Check for duplicate ID
    const { exists, error: duplicateCheckError } = await checkDuplicateId(generatedId);
    
    if (duplicateCheckError) {
      debug.error('Error checking for duplicate certification', { 
        error: duplicateCheckError.message 
      });
      toast({
        title: 'Error',
        description: 'Could not verify if certification already exists. Please try again.',
        variant: 'destructive',
      });
      return { error: duplicateCheckError };
    }

    if (exists) {
      debug.error('Duplicate certification ID', { generatedId });
      toast({
        title: 'Duplicate certification',
        description: `A certification with ID "${generatedId}" already exists. Please use a more unique title.`,
        variant: 'destructive',
      });
      return { error: new Error('Duplicate ID') };
    }

    // Validate Course ID if CertiFree type
    if (input.type === 'certifree' && input.courseId) {
      if (!validateUUID(input.courseId)) {
        debug.error('Invalid Course ID format', { courseId: input.courseId });
        toast({
          title: 'Invalid Course ID',
          description: 'Course ID must be a valid UUID format or left empty.',
          variant: 'destructive',
        });
        return { error: new Error('Invalid Course ID') };
      }
    }

    const newCertification: CertificationInput = {
      id: generatedId,
      title: input.title!,
      provider: input.provider!,
      category: input.category!,
      difficulty: input.difficulty || 'Beginner',
      duration: input.duration || '',
      description: input.description || '',
      externalUrl: input.externalUrl!,
      imageUrl: input.imageUrl || '',
      isFree: true,
      certificationType: input.type === 'certifree' ? 'CertiFree' : (input.certificationType || 'Course'),
      tags: input.tags || [],
      skills: input.skills || [],
      prerequisites: input.prerequisites || [],
      type: input.type || 'public',
      courseId: input.type === 'certifree' ? (input.courseId || null) : undefined,
    };

    // Create certification
    const { error } = await createCertificationService(newCertification);
    
    if (error) {
      debug.error('Failed to create certification', { 
        error: error.message, 
        input: newCertification 
      });
      toast({
        title: 'Create failed',
        description: error.message,
        variant: 'destructive',
      });
      return { error };
    }

    // Optimistic update - add to local state
    const newCert = mapCertificationInputToCertification(newCertification);
    setCertifications((prev) => [newCert, ...prev]);
    
    debug.log('Certification created successfully', { id: generatedId });
    toast({ title: 'Certification created' });
    
    return {};
  };

  /**
   * Update an existing certification
   */
  const updateCertification = async (
    id: string,
    updates: Partial<CertificationInput>
  ): Promise<{ error?: any }> => {
    debug.log('Updating certification', { id, updates });

    // Validate Course ID if CertiFree type and ID is provided
    if (updates.type === 'certifree' && updates.courseId) {
      if (!validateUUID(updates.courseId)) {
        debug.error('Invalid Course ID format', { courseId: updates.courseId });
        toast({
          title: 'Invalid Course ID',
          description: 'Course ID must be a valid UUID format or left empty.',
          variant: 'destructive',
        });
        return { error: new Error('Invalid Course ID') };
      }
    }

    const { error } = await updateCertificationService(id, {
      ...updates,
      type: updates.type as 'public' | 'certifree',
      certificationType: updates.type === 'certifree' 
        ? 'CertiFree' 
        : (updates.certificationType as 'Course' | 'Exam' | 'Project' | 'Bootcamp' | 'Public'),
      courseId: updates.type === 'certifree' ? (updates.courseId || null) : undefined,
    });

    if (error) {
      debug.error('Failed to update certification', { error: error.message, id });
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
      return { error };
    }

    // Optimistic update - update local state
    setCertifications((prev) =>
      prev.map((cert) =>
        cert.id === id ? { ...cert, ...updates } as Certification : cert
      )
    );
    
    debug.log('Certification updated successfully', { id });
    toast({ title: 'Certification updated' });
    
    return {};
  };

  /**
   * Delete a certification
   */
  const deleteCertification = async (id: string): Promise<{ error?: any }> => {
    debug.log('Deleting certification', { id });
    
    try {
      setDeletingId(id);
      const { error } = await deleteCertificationService(id);
      
      if (error) {
        debug.error('Failed to delete certification', { error: error.message, id });
        toast({
          title: 'Delete failed',
          description: error.message,
          variant: 'destructive',
        });
        return { error };
      }

      // Remove from local state
      setCertifications((prev) => prev.filter((cert) => cert.id !== id));
      
      debug.log('Certification deleted successfully', { id });
      toast({ title: 'Certification deleted' });
      
      return {};
    } catch (err: any) {
      debug.error('Unhandled error deleting certification', { 
        error: err.message, 
        stack: err.stack 
      });
      toast({
        title: 'Delete failed',
        description: err.message,
        variant: 'destructive',
      });
      return { error: err };
    } finally {
      setDeletingId(null);
    }
  };

  return {
    certifications,
    loading,
    error,
    deletingId,
    createCertification,
    updateCertification,
    deleteCertification,
  };
};
