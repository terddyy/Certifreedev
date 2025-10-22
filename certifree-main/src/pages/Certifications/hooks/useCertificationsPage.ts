/**
 * Custom hook for managing Certifications page state
 */

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useCertifications } from "@/hooks/useCertifications";
import { useCategoriesAndProviders } from "@/hooks/useCategoriesAndProviders";
import { useFavoritesAndProgress } from "@/hooks/useFavoritesAndProgress";
import { useCertificationManagement } from "@/hooks/useCertificationManagement";
import { type Certification } from "@/lib/types/certifications";
import { type ViewMode, type CertificationsFilters } from "../types";
import { processSearchQuery, isUserAdmin } from "../utils/helpers";

export const useCertificationsPage = () => {
  // Navigation and auth
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast } = useToast();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty] = useState<string>("all");
  const [selectedProvider, setSelectedProvider] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [certs, setCerts] = useState<Certification[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(processSearchQuery(searchQuery));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Build filters object
  const filters: CertificationsFilters = useMemo(
    () => ({
      searchQuery: debouncedSearch,
      selectedCategory,
      selectedDifficulty,
      selectedProvider,
      sortBy,
    }),
    [debouncedSearch, selectedCategory, selectedDifficulty, selectedProvider, sortBy]
  );

  // Fetch certifications with filters
  const { 
    certifications: filteredCertifications, 
    loading, 
    error 
  } = useCertifications(filters);

  // Fetch categories and providers
  const { 
    categories, 
    providers, 
    categoriesLoading 
  } = useCategoriesAndProviders();

  // Manage favorites and progress
  const { 
    favoriteIds, 
    takingIds, 
    takersCount, 
    toggleFavorite, 
    toggleTaking 
  } = useFavoritesAndProgress(filteredCertifications);

  // Manage CRUD operations
  const {
    deleteCertification,
    createCertification,
    updateCertification,
    deletingId,
  } = useCertificationManagement();

  // Update local certifications when filtered results change
  useEffect(() => {
    setCerts(filteredCertifications);
  }, [filteredCertifications]);

  // Check admin status
  const isAdmin = useMemo(() => isUserAdmin(profile), [profile]);

  return {
    // State
    searchQuery,
    debouncedSearch,
    selectedCategory,
    selectedProvider,
    sortBy,
    viewMode,
    certs,
    isAddDialogOpen,
    editingCertification,
    
    // Computed
    isAdmin,
    profile,
    loading,
    error,
    
    // Data
    categories,
    providers,
    categoriesLoading,
    favoriteIds,
    takingIds,
    takersCount,
    deletingId,
    
    // Actions
    setSearchQuery,
    setSelectedCategory,
    setSelectedProvider,
    setSortBy,
    setViewMode,
    setCerts,
    setIsAddDialogOpen,
    setEditingCertification,
    
    // Operations
    toggleFavorite,
    toggleTaking,
    createCertification,
    updateCertification,
    deleteCertification,
    
    // Navigation
    navigate,
    toast,
  };
};
