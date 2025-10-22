/**
 * Certifications Grid Component
 * Renders certifications in grid or list view
 */

import { CertificationCard } from "@/components/certifications/CertificationCard";
import { CertificationListItem } from "@/components/certifications/CertificationListItem";
import { EmptyState } from "@/components/certifications/EmptyState";
import { type Certification } from "@/lib/types/certifications";
import { type ViewMode } from "../types";

interface CertificationsGridProps {
  certifications: Certification[];
  viewMode: ViewMode;
  isAdmin: boolean;
  favoriteIds: Record<string, boolean>;
  takersCount: Record<string, number>;
  deletingId: string | null;
  userAuthenticated: boolean;
  onEdit: (cert: Certification) => void;
  onDelete: (id: string, title: string) => void;
  onToggleFavorite: (cert: Certification) => void;
  onNavigateToDetail: (certId: string) => void;
}

export const CertificationsGrid = ({
  certifications,
  viewMode,
  isAdmin,
  favoriteIds,
  takersCount,
  deletingId,
  userAuthenticated,
  onEdit,
  onDelete,
  onToggleFavorite,
  onNavigateToDetail,
}: CertificationsGridProps) => {
  if (certifications.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-1 bg-gradient-to-b from-[#ffc300] to-[#ffd60a] rounded-full"></div>
        <h2 className="text-2xl font-bold text-white">All Certifications</h2>
      </div>
      <div
        className={`grid gap-6 ${
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1"
        }`}
      >
        {certifications.map((certification) =>
          viewMode === "grid" ? (
            <CertificationCard
              key={certification.id}
              certification={certification}
              isAdmin={isAdmin}
              isFavorited={favoriteIds[certification.id] || false}
              takersCount={takersCount[certification.id] || 0}
              deletingId={deletingId}
              userAuthenticated={userAuthenticated}
              onEdit={() => onEdit(certification)}
              onDelete={() => onDelete(certification.id, certification.title)}
              onToggleFavorite={() => onToggleFavorite(certification)}
              onNavigateToDetail={() => onNavigateToDetail(certification.id)}
            />
          ) : (
            <CertificationListItem
              key={certification.id}
              certification={certification}
              isAdmin={isAdmin}
              isFavorited={favoriteIds[certification.id] || false}
              takersCount={takersCount[certification.id] || 0}
              deletingId={deletingId}
              userAuthenticated={userAuthenticated}
              onEdit={() => onEdit(certification)}
              onDelete={() => onDelete(certification.id, certification.title)}
              onToggleFavorite={() => onToggleFavorite(certification)}
              onNavigateToDetail={() => onNavigateToDetail(certification.id)}
            />
          )
        )}
      </div>
    </div>
  );
};
