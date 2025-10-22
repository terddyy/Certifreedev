/**
 * CertificationCard Component
 * Grid view card for displaying certification details
 */

import { BookOpen, Clock, Users, Star, Heart, Pencil, Trash, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Certification } from '@/lib/types/certifications';

interface CertificationCardProps {
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

export const CertificationCard = ({
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
}: CertificationCardProps) => {
  return (
    <Card className="relative bg-gradient-to-br from-[#001d3d] via-[#003566] to-[#001d3d] text-white rounded-xl shadow-lg border border-[#ffd60a]/20 hover:shadow-[0_0_30px_rgba(255,214,10,0.3)] hover:scale-[1.02] transition-all duration-300 ease-out group backdrop-blur-sm overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#ffd60a]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start justify-between mb-3">
          {/* Admin controls and favorite */}
          <div className="flex items-center gap-2 flex-wrap">
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
              aria-label="Toggle favorite"
            >
              <Heart className={`h-4 w-4 mr-1 transition-all ${isFavorited ? 'fill-red-500 scale-110' : ''}`} />
              <span className="text-xs font-medium">{isFavorited ? 'Saved' : 'Save'}</span>
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-20 h-14 rounded-lg shadow-md overflow-hidden bg-gradient-to-br from-[#003566] to-[#001d3d] flex items-center justify-center flex-shrink-0 border border-[#ffd60a]/10">
              {certification.image_url ? (
                <img src={certification.image_url} alt={certification.title} className="w-full h-full object-contain" loading="lazy" />
              ) : (
                <BookOpen className="h-6 w-6 text-[#ffd60a]/50" />
              )}
            </div>
            <div className="min-w-0 flex-1 flex flex-col gap-1 justify-center">
              <CardTitle className="text-base leading-tight text-white group-hover:text-[#ffd60a] transition-colors font-bold">
                <button onClick={onNavigateToDetail} className="text-left w-full hover:underline">
                  {certification.title}
                </button>
              </CardTitle>
              <div>
                <Badge variant="outline" className="text-[10px] bg-[#003566]/50 text-[#ffd60a] border-[#ffd60a]/30 font-semibold">
                  {certification.provider}
                </Badge>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">{certification.description}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        <div className="flex items-center gap-4 text-xs text-gray-300">
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

        <div className="flex flex-wrap gap-2">
          {(certification.skills || []).slice(0, 3).map((skill) => (
            <Badge key={skill} variant="outline" className="text-[10px] bg-[#001d3d]/50 text-gray-200 border-[#ffd60a]/20 font-medium hover:border-[#ffd60a]/50 transition-colors">
              {skill}
            </Badge>
          ))}
          {(certification.skills || []).length > 3 && (
            <Badge variant="outline" className="text-[10px] bg-[#001d3d]/50 text-[#ffd60a] border-[#ffd60a]/30 font-medium">
              +{(certification.skills || []).length - 3}
            </Badge>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            className="flex-1 bg-gradient-to-r from-[#ffc300] to-[#ffd60a] text-[#001d3d] font-bold hover:shadow-lg hover:shadow-[#ffd60a]/30 transition-all duration-200" 
            onClick={onNavigateToDetail}
          >
            <BookOpen className="h-4 w-4 mr-1.5" />
            Details
          </Button>
          <Button variant="outline" size="icon" asChild className="bg-[#003566]/50 text-[#ffd60a] border-[#ffd60a]/30 hover:bg-[#003566] hover:border-[#ffd60a] transition-all">
            <a href={userAuthenticated ? certification.external_url : '/auth'} target={userAuthenticated ? "_blank" : "_self"} rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
