import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Certification } from '@/lib/types/certifications';
import { componentDebug, startTimer, endTimer } from '@/lib/debugger';

interface CertificationsFilter {
  searchQuery: string;
  selectedCategory: string;
  selectedDifficulty: string;
  selectedProvider: string;
  sortBy: string;
}

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
  image_url: dbCertification.image_url || '/api/placeholder/400/240',
  external_url: dbCertification.external_url || '#',
  is_free: dbCertification.is_free || true,
  certification_type: dbCertification.certification_type || 'Course',
  career_impact: dbCertification.career_impact || 5,
  completion_count: dbCertification.completion_count || 0,
  tags: dbCertification.tags || [],
  admin_id: dbCertification.admin_id || null,
  created_at: dbCertification.created_at,
  updated_at: dbCertification.updated_at || new Date().toISOString(),
});

export const useCertifications = (filters: CertificationsFilter) => {
  const debug = componentDebug('useCertifications');
  
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true); // Ref to track component mount status

  useEffect(() => {
    isMounted.current = true; // Set to true on effect run

    const timerName = 'useCertifications:fetchCertifications';

    const fetchCertifications = async () => {
      startTimer(timerName);
      debug.log('Starting certifications fetch', { filters });
      
      // Reset error and loading state at the beginning of each fetch
      if (isMounted.current) {
        setLoading(true);
        setError(null);
      }

      try {
        // Skip fetching if only search is active and too short
        const onlySearch = !!filters.searchQuery && filters.searchQuery.length < 2
          && filters.selectedCategory === 'all'
          && filters.selectedDifficulty === 'all'
          && filters.selectedProvider === 'all';
        if (onlySearch) {
          if (isMounted.current) {
            setCertifications([]);
            setLoading(false);
          }
          return;
        }

        // Fetch public certifications
        let certsQuery = supabase.from('certifications').select('*');
        // Apply filters for public certs
        if (filters.searchQuery) {
          certsQuery = certsQuery.or(
            `title.ilike.%${filters.searchQuery}%,provider.ilike.%${filters.searchQuery}%,skills.cs.{${filters.searchQuery}}`
          );
        }
        if (filters.selectedCategory !== "all") {
          certsQuery = certsQuery.eq('category', filters.selectedCategory);
        }
        if (filters.selectedDifficulty !== "all") {
          certsQuery = certsQuery.eq('difficulty', filters.selectedDifficulty);
        }
        if (filters.selectedProvider !== "all") {
          certsQuery = certsQuery.eq('provider', filters.selectedProvider);
        }

        const { data: certificationsData, error: certificationsError } = await certsQuery;

        if (certificationsError) {
          debug.error("Error fetching certifications", { error: certificationsError.message });
          if (isMounted.current) {
            setError(certificationsError.message);
          }
        }

        let combinedCertifications: Certification[] = [];

        if (certificationsData) {
          combinedCertifications = [...combinedCertifications, ...certificationsData.map(transformCertification)];
        }

        // Custom sort
        combinedCertifications.sort((a, b) => {
          switch (filters.sortBy) {
            case "popular":
              return (b.completion_count || 0) - (a.completion_count || 0); // Use completion_count
            case "rating":
              return (b.rating || 0) - (a.rating || 0);
            case "newest":
              return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(); // Use updated_at
            case "duration":
              // This assumes duration can be parsed numerically for comparison
              // For now, a simple string comparison or more complex parsing would be needed
              return a.duration.localeCompare(b.duration);
            default:
              return (b.completion_count || 0) - (a.completion_count || 0); // Use completion_count
          }
        });

        if (isMounted.current) {
          setCertifications(combinedCertifications);
        }
      } catch (err: any) {
        debug.error("Unhandled error during certifications fetch", { error: err.message, stack: err.stack });
        if (isMounted.current) {
          setError(err.message);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
        endTimer(timerName);
      }
    };

    fetchCertifications();

    // Cleanup function: Set isMounted to false when component unmounts or effect re-runs
    return () => {
      isMounted.current = false;
      debug.log('useCertifications cleanup: Component unmounted or effect re-ran');
    };
  }, [filters]);

  return { certifications, loading, error };
}; 