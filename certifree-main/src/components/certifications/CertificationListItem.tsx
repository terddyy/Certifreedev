/**
 * CertificationListItem Component
 * List view row for displaying certification details
 */

import { BookOpen, Clock, Users, Star, Heart, Pencil, Trash, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Certification } from '@/lib/types/certifications';

interface CertificationListItemProps {
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

export const CertificationListItem = ({
  certification,
  isAdmin,
  isFavorited,
  takersCount,
  deletingId,
  userAuthenticated,
  onEdit,
  onDelete,
  onToggleFavorite,
  onNavigateToDetail,
}: CertificationListItemProps) => {
  return (
    <Card className="relative bg-gradient-to-r from-[#001d3d] via-[#003566] to-[#001d3d] text-white rounded-xl shadow-lg border border-[#ffd60a]/20 hover:shadow-[0_0_30px_rgba(255,214,10,0.3)] hover:scale-[1.01] transition-all duration-300 ease-out group backdrop-blur-sm overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#ffd60a]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <CardContent className="p-4 sm:p-6 relative z-10">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Image */}
          <div className="w-full sm:w-32 flex-shrink-0">
            <div className="aspect-video sm:aspect-square rounded-lg overflow-hidden shadow-md bg-gradient-to-br from-[#003566] to-[#001d3d] flex items-center justify-center text-sm text-gray-200 border border-[#ffd60a]/10">
              {certification.image_url ? (
                <img src={certification.image_url} alt={certification.title} className="w-full h-full object-cover" />
              ) : (
                <BookOpen className="h-8 w-8 text-[#ffd60a]/50" />
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#ffd60a] transition-colors duration-200">
                    <button onClick={onNavigateToDetail} className="text-left hover:underline">
                      {certification.title}
                    </button>
                  </h3>
                  <Badge variant="outline" className="text-xs bg-[#003566]/50 text-[#ffd60a] border-[#ffd60a]/30 font-semibold flex-shrink-0">
                    {certification.provider}
                  </Badge>
                </div>
                <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">{certification.description}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {isAdmin && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-gray-200 border-[#3b82f6]/50 hover:bg-[#003566] hover:border-[#3b82f6] transition-all"
                      onClick={onEdit}
                      title="Edit certification"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="hover:bg-red-700 hover:shadow-lg transition-all"
                      onClick={onDelete}
                      disabled={deletingId === certification.id}
                      title="Delete certification"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Button 
                  variant="ghost" 
                  className={`hover:bg-[#003566]/50 px-2 transition-all ${isFavorited ? 'text-red-500' : 'text-gray-300'}`} 
                  onClick={onToggleFavorite}
                >
                  <Heart className={`h-4 w-4 mr-1 transition-all ${isFavorited ? 'fill-red-500 scale-110' : ''}`} />
                  <span className="text-xs font-medium">{isFavorited ? 'Saved' : 'Save'}</span>
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-4">
              <div className="flex items-center flex-wrap gap-x-6 gap-y-2 text-xs text-gray-300">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-[#ffd60a]" />
                  <span className="font-medium">{certification.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-[#ffd60a]" />
                  <span className="font-medium">{takersCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-[#ffd60a]" />
                  <span className="font-medium">{certification.rating || 'N/A'}</span>
                </div>
              </div>

              <div className="flex gap-3 flex-shrink-0">
                <Button 
                  className="bg-gradient-to-r from-[#ffc300] to-[#ffd60a] text-[#001d3d] font-bold hover:shadow-lg hover:shadow-[#ffd60a]/30 transition-all duration-200" 
                  onClick={onNavigateToDetail}
                >
                  <BookOpen className="h-4 w-4 mr-1.5" />
                  View Details
                </Button>
                <Button variant="outline" size="icon" asChild className="bg-[#003566]/50 text-[#ffd60a] border-[#ffd60a]/30 hover:bg-[#003566] hover:border-[#ffd60a] transition-all">
                  <a href={userAuthenticated ? certification.external_url : '/auth'} target={userAuthenticated ? "_blank" : "_self"} rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
