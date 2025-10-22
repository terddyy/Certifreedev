import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ExternalLink, Heart, Clock, Star, Award, Trash2 } from "lucide-react";
import { removeFavorite } from "@/lib/favorites";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Type for certification object
interface CertificationData {
  id: string;
  title: string;
  provider: string;
  description: string;
  duration: string;
  external_url: string;
  category: string;
  difficulty: string;
  rating: number;
  image_url?: string;
}

// Type for Supabase join response - can be object or array depending on relationship
interface SupabaseFavoriteResponse {
  certification_id: string;
  created_at: string;
  certifications: CertificationData | CertificationData[] | null;
}

// Normalized type for our component state
interface FavoriteEntry {
  certification_id: string;
  created_at: string;
  certification: CertificationData | null;
}

const Favorites = () => {
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return; // Wait for auth state to load

    const fetchFavorites = async () => {
      setLoading(true);
      setError(null);
      if (!user) {
        setError("You must be logged in to view favorites.");
        setLoading(false);
        return;
      }

      try {
        // Use Supabase's automatic join based on foreign key relationship
        // The foreign key 'fk_user_favorites_certification' allows automatic joining
        const { data, error } = await supabase
          .from("user_favorites")
          .select(`
            certification_id,
            created_at,
            certifications (
              id,
              title,
              provider,
              description,
              duration,
              external_url,
              category,
              difficulty,
              rating
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        
        // Transform the response: Handle both object and array formats from Supabase
        const normalizedData: FavoriteEntry[] = (data as SupabaseFavoriteResponse[] || []).map(item => {
          let certification: CertificationData | null = null;
          
          if (item.certifications) {
            // Check if it's an array
            if (Array.isArray(item.certifications)) {
              certification = item.certifications.length > 0 ? item.certifications[0] : null;
            } else {
              // It's a single object
              certification = item.certifications as CertificationData;
            }
          }
          
          return {
            certification_id: item.certification_id,
            created_at: item.created_at,
            certification
          };
        });
        
        setFavorites(normalizedData);
      } catch (err: any) {
        console.error("Error fetching favorites:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user, authLoading]);

  const handleRemoveFavorite = async (certificationId: string) => {
    if (!user) return;
    
    setRemovingId(certificationId);
    try {
      const { error } = await removeFavorite(user.id, certificationId);
      if (error) throw error;
      
      // Remove from state
      setFavorites(favorites.filter(f => f.certification_id !== certificationId));
    } catch (err: any) {
      console.error("Error removing favorite:", err);
      setError(err.message);
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 bg-gradient-to-br from-[#001d3d] via-[#003566] to-[#000814] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffd60a] mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading your favorites...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 bg-gradient-to-br from-[#001d3d] via-[#003566] to-[#000814] flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-300 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-[#ffd60a] text-[#001d3d] hover:bg-[#ffc300]">
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-br from-[#001d3d] via-[#003566] to-[#000814]">
      <div className="container mx-auto px-4 py-8 md:px-8 md:py-12">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-[#ffd60a] fill-[#ffd60a]" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">
              My Favorites
            </h1>
          </div>
          <p className="text-gray-300 text-lg">
            {favorites.length > 0 
              ? `You have ${favorites.length} favorite certification${favorites.length > 1 ? 's' : ''}`
              : 'Start building your collection of favorite certifications'}
          </p>
        </div>

        {favorites.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 md:py-24">
            <div className="bg-gradient-to-br from-[#003566]/50 to-[#001d3d]/50 rounded-full p-8 mb-6 backdrop-blur-sm border border-[#ffd60a]/20">
              <Heart className="h-16 w-16 text-[#ffd60a]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">
              No favorites yet
            </h2>
            <p className="text-gray-400 text-center mb-8 max-w-md">
              Discover amazing certifications and add them to your favorites for quick access
            </p>
            <Link to="/certifications">
              <Button className="bg-[#ffd60a] text-[#001d3d] hover:bg-[#ffc300] font-semibold px-8 py-6 text-lg">
                <Award className="mr-2 h-5 w-5" />
                Browse All Certifications
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        ) : (
          /* Favorites Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => {
              const certification = favorite.certification;
              if (!certification) return null;

              const getDifficultyColor = (difficulty: string) => {
                switch (difficulty.toLowerCase()) {
                  case 'beginner': return 'bg-green-500/20 text-green-300 border-green-500/30';
                  case 'intermediate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
                  case 'advanced': return 'bg-red-500/20 text-red-300 border-red-500/30';
                  default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
                }
              };

              return (
                <Card 
                  key={favorite.certification_id} 
                  className="bg-gradient-to-br from-[#003566]/80 to-[#001d3d]/80 backdrop-blur-sm border-[#ffd60a]/20 hover:border-[#ffd60a]/40 transition-all duration-300 hover:shadow-xl hover:shadow-[#ffd60a]/10 group relative overflow-hidden"
                >
                  {/* Animated Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ffd60a]/0 via-[#ffd60a]/0 to-[#ffd60a]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <CardHeader className="relative">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <Badge className={`${getDifficultyColor(certification.difficulty)} border`}>
                        {certification.difficulty}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFavorite(certification.id)}
                        disabled={removingId === certification.id}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
                        title="Remove from favorites"
                      >
                        {removingId === certification.id ? (
                          <div className="animate-spin h-4 w-4 border-2 border-red-400 border-t-transparent rounded-full"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <CardTitle className="text-white text-lg leading-tight group-hover:text-[#ffd60a] transition-colors">
                      {certification.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="relative space-y-4">
                    {/* Provider */}
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-[#ffd60a]" />
                      <span className="text-sm font-medium text-gray-300">{certification.provider}</span>
                    </div>

                    {/* Category Badge */}
                    <Badge className="bg-[#ffd60a]/10 text-[#ffd60a] border-[#ffd60a]/30 hover:bg-[#ffd60a]/20">
                      {certification.category}
                    </Badge>

                    {/* Description */}
                    <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                      {certification.description || 'Expand your skills with this certification program.'}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 pt-2 border-t border-gray-700/50">
                      <div className="flex items-center gap-1.5 text-sm text-gray-400">
                        <Clock className="h-4 w-4 text-[#ffd60a]" />
                        <span>{certification.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-400">
                        <Star className="h-4 w-4 text-[#ffd60a] fill-[#ffd60a]" />
                        <span>{certification.rating?.toFixed(1) || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Link to={`/certifications/${certification.id}`} className="flex-1">
                        <Button 
                          className="w-full bg-[#ffd60a]/10 text-[#ffd60a] hover:bg-[#ffd60a] hover:text-[#001d3d] border border-[#ffd60a]/30 font-semibold transition-all"
                        >
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <a href={certification.external_url} target="_blank" rel="noopener noreferrer">
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="border-gray-600 text-gray-300 hover:bg-[#ffd60a]/10 hover:text-[#ffd60a] hover:border-[#ffd60a]/30"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>

                    {/* Added Date */}
                    <p className="text-xs text-gray-500 pt-2">
                      Added {new Date(favorite.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Favorites;