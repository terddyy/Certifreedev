/**
 * SearchBar Component
 * Search input with gradient styling and icon
 */

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = 'Search certifications, providers, or skills...' 
}: SearchBarProps) => {
  return (
    <div className="mb-8">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-[#ffd60a]/20 to-[#ffc300]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#ffd60a]" />
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-12 pr-4 py-3 h-12 bg-gradient-to-r from-[#001d3d] to-[#003566] border-[#ffd60a]/30 text-white placeholder-gray-400 focus:border-[#ffd60a] focus:ring-[#ffd60a] transition-all"
          />
        </div>
      </div>
    </div>
  );
};
