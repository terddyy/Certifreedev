/**
 * EmptyState Component
 * Display when no certifications are found
 */

import { BookOpen } from 'lucide-react';

interface EmptyStateProps {
  searchQuery?: string;
}

export const EmptyState = ({ searchQuery }: EmptyStateProps) => {
  return (
    <div className="relative text-center py-20 bg-gradient-to-br from-[#001d3d] via-[#003566] to-[#001d3d] rounded-2xl border border-[#ffd60a]/20 shadow-xl text-gray-300 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffd60a]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#003566]/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#003566] to-[#001d3d] border border-[#ffd60a]/30 mb-6">
          <BookOpen className="h-10 w-10 text-[#ffd60a]" />
        </div>
        <h3 className="text-2xl font-bold mb-3 text-white">No certifications found</h3>
        <p className="text-base text-gray-300 max-w-md mx-auto">
          {searchQuery 
            ? `No results found for "${searchQuery}". Try adjusting your search terms or filters.`
            : 'Try adjusting your search terms or filters to find what you\'re looking for.'
          }
        </p>
      </div>
    </div>
  );
};
