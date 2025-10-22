/**
 * CertificationFilters Component
 * Category and provider filters with admin controls
 */

import { Filter, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Category, Provider } from '@/services/certificationService';

interface CertificationFiltersProps {
  categories: Category[];
  providers?: Provider[];
  selectedCategory: string;
  selectedProvider?: string;
  onCategoryChange: (category: string) => void;
  onProviderChange?: (provider: string) => void;
  isAdmin: boolean;
  onAddClick?: () => void;
}

export const CertificationFilters = ({
  categories,
  selectedCategory,
  onCategoryChange,
  isAdmin,
  onAddClick,
}: CertificationFiltersProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#ffd60a]" />
          Categories
        </h3>
        {isAdmin && onAddClick && (
          <Button
            size="sm"
            className="bg-gradient-to-r from-[#ffc300] to-[#ffd60a] text-[#001d3d] font-bold hover:shadow-lg hover:shadow-[#ffd60a]/30 transition-all"
            onClick={onAddClick}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Certification
          </Button>
        )}
      </div>
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[220px] bg-gradient-to-r from-[#001d3d] to-[#003566] border-[#ffd60a]/30 text-white hover:border-[#ffd60a] transition-all">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent className="bg-[#001d3d] border-[#ffd60a]/30 text-white">
          <SelectItem
            value="all"
            className="hover:bg-[#003566] hover:text-[#ffd60a] focus:bg-[#003566] focus:text-[#ffd60a]"
          >
            All Categories
          </SelectItem>
          {categories.map((cat) => (
            <SelectItem
              key={cat.name}
              value={cat.name}
              className="hover:bg-[#003566] hover:text-[#ffd60a] focus:bg-[#003566] focus:text-[#ffd60a]"
            >
              {cat.name}
            </SelectItem>
          ))}
          {isAdmin && (
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-[#ffd60a] w-full text-left justify-start mt-2"
              onClick={() => navigate('/settings')}
            >
              Manage Categories
            </Button>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
