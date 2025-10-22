/**
 * ViewModeToggle Component
 * Toggle between grid and list view modes
 */

import { Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type ViewMode = 'grid' | 'list';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ViewModeToggle = ({ viewMode, onViewModeChange }: ViewModeToggleProps) => {
  return (
    <div className="flex rounded-lg border border-[#ffd60a]/30 bg-gradient-to-r from-[#001d3d] to-[#003566] overflow-hidden shadow-lg">
      <Button
        variant={viewMode === 'grid' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => onViewModeChange('grid')}
        className={`rounded-none ${
          viewMode === 'grid'
            ? 'bg-gradient-to-r from-[#ffc300] to-[#ffd60a] text-[#001d3d] hover:shadow-lg'
            : 'text-gray-300 hover:bg-[#003566]/50 hover:text-[#ffd60a]'
        }`}
        title="Grid view"
      >
        <Grid3X3 className="h-5 w-5" />
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => onViewModeChange('list')}
        className={`rounded-none ${
          viewMode === 'list'
            ? 'bg-gradient-to-r from-[#ffc300] to-[#ffd60a] text-[#001d3d] hover:shadow-lg'
            : 'text-gray-300 hover:bg-[#003566]/50 hover:text-[#ffd60a]'
        }`}
        title="List view"
      >
        <List className="h-5 w-5" />
      </Button>
    </div>
  );
};
