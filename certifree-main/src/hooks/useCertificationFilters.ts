/**
 * useCertificationFilters Hook
 * Manages search, filtering, sorting, and view mode state
 */

import { useState, useEffect, useMemo } from 'react';
import { Certification } from '@/lib/types/certifications';
import { SEARCH_DEBOUNCE_MS } from '@/constants/certificationConstants';

export type ViewMode = 'grid' | 'list';
export type SortBy = 'newest' | 'popular' | 'rating';

export const useCertificationFilters = (certifications: Certification[]) => {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter and sort certifications
  const filteredCertifications = useMemo(() => {
    let filtered = [...certifications];

    // Apply search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (cert) =>
          cert.title.toLowerCase().includes(searchLower) ||
          cert.provider.toLowerCase().includes(searchLower) ||
          cert.description?.toLowerCase().includes(searchLower) ||
          (cert.skills || []).some((skill) => skill.toLowerCase().includes(searchLower)) ||
          (cert.tags || []).some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((cert) => cert.category === selectedCategory);
    }

    // Apply difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter((cert) => cert.difficulty === selectedDifficulty);
    }

    // Apply provider filter
    if (selectedProvider !== 'all') {
      filtered = filtered.filter((cert) => cert.provider === selectedProvider);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          // Sort by created_at descending (newest first)
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'popular':
          // Sort by completion_count descending
          return (b.completion_count || 0) - (a.completion_count || 0);
        case 'rating':
          // Sort by rating descending
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    certifications,
    debouncedSearch,
    selectedCategory,
    selectedDifficulty,
    selectedProvider,
    sortBy,
  ]);

  return {
    // Search
    searchQuery,
    setSearchQuery,
    debouncedSearch,
    
    // Filters
    selectedCategory,
    setSelectedCategory,
    selectedDifficulty,
    setSelectedDifficulty,
    selectedProvider,
    setSelectedProvider,
    
    // Sort & View
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    
    // Results
    filteredCertifications,
  };
};
