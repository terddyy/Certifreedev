/**
 * useCategoriesAndProviders Hook
 * Manages fetching and state for categories and providers
 */

import { useState, useEffect } from 'react';
import { fetchCategories, fetchProviders, Category, Provider } from '@/services/certificationService';
import { componentDebug } from '@/lib/debugger';

const debug = componentDebug('useCategoriesAndProviders');

export const useCategoriesAndProviders = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [providersLoading, setProvidersLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [providersError, setProvidersError] = useState<string | null>(null);

  const loadCategories = async () => {
    debug.log('Fetching categories');
    setCategoriesLoading(true);
    setCategoriesError(null);
    
    try {
      const { data, error } = await fetchCategories();
      
      if (error) {
        debug.error('Error fetching categories', { error: error.message });
        setCategoriesError(error.message);
      } else {
        setCategories(data || []);
        debug.log('Categories fetched', { count: data?.length || 0 });
      }
    } catch (err: any) {
      debug.error('Unhandled error fetching categories', { error: err.message, stack: err.stack });
      setCategoriesError(err.message);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const loadProviders = async () => {
    debug.log('Fetching providers');
    setProvidersLoading(true);
    setProvidersError(null);
    
    try {
      const { data, error } = await fetchProviders();
      
      if (error) {
        debug.error('Error fetching providers', { error: error.message });
        setProvidersError(error.message);
      } else {
        setProviders(data || []);
        debug.log('Providers fetched', { count: data?.length || 0 });
      }
    } catch (err: any) {
      debug.error('Unhandled error fetching providers', { error: err.message, stack: err.stack });
      setProvidersError(err.message);
    } finally {
      setProvidersLoading(false);
    }
  };

  // Load on mount
  useEffect(() => {
    loadCategories();
    loadProviders();
  }, []);

  return {
    categories,
    providers,
    categoriesLoading,
    providersLoading,
    categoriesError,
    providersError,
    refetchCategories: loadCategories,
    refetchProviders: loadProviders,
  };
};
