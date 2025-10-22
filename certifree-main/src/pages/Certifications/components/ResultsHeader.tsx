/**
 * Results Header Component
 * Displays certification count and view mode toggle
 */

import { ViewModeToggle } from "@/components/certifications/ViewModeToggle";
import { type ViewMode } from "../types";

interface ResultsHeaderProps {
  count: number;
  searchQuery?: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ResultsHeader = ({
  count,
  searchQuery,
  viewMode,
  onViewModeChange,
}: ResultsHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6 text-gray-300">
      <p className="text-lg font-medium">
        Showing{" "}
        <span className="text-[#ffd60a] font-bold">{count}</span>{" "}
        certifications
        {searchQuery && (
          <span className="text-gray-400"> for "{searchQuery}"</span>
        )}
      </p>
      <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
    </div>
  );
};
