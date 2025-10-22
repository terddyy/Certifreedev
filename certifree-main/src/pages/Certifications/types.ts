/**
 * Type definitions for Certifications page
 */

import { type Certification } from "@/lib/types/certifications";

export interface CertificationsFilters {
  searchQuery: string;
  selectedCategory: string;
  selectedDifficulty: string;
  selectedProvider: string;
  sortBy: string;
}

export interface CertificationsState {
  certifications: Certification[];
  searchQuery: string;
  debouncedSearch: string;
  selectedCategory: string;
  selectedDifficulty: string;
  selectedProvider: string;
  sortBy: string;
  viewMode: "grid" | "list";
  isAddDialogOpen: boolean;
  editingCertification: Certification | null;
}

export interface CertificationCardProps {
  certification: Certification;
  isAdmin: boolean;
  isFavorited: boolean;
  takersCount: number;
  deletingId: string | null;
  userAuthenticated: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
  onNavigateToDetail: () => void;
}

export type ViewMode = "grid" | "list";
