import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Heart, Award, TrendingUp, ExternalLink, CheckCircle2, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Certification } from "@/lib/types/certifications";

interface UserProgress {
  id: string;
  certification_id: string;
  status: string;
  started_at: string;
  completed_at?: string;
  certifications?: Certification;
}

interface UserFavorite {
  certification_id: string;
  created_at: string;
  certifications?: Certification;
}

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [completedCourses, setCompletedCourses] = useState<UserProgress[]>([]);
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setDataLoading(true);

      // Fetch in-progress certifications
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*, certifications(*)')
        .eq('user_id', user?.id)
        .eq('status', 'in_progress')
        .order('started_at', { ascending: false })
        .limit(5);

      if (progressError) throw progressError;
      setUserProgress(progressData || []);

      // Fetch completed certifications
      const { data: completedData, error: completedError } = await supabase
        .from('user_progress')
        .select('*, certifications(*)')
        .eq('user_id', user?.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(6);

      if (completedError) throw completedError;
      setCompletedCourses(completedData || []);

      // Fetch favorites
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('user_favorites')
        .select('*, certifications(*)')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(6);

      if (favoritesError) throw favoritesError;
      setFavorites(favoritesData || []);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error.message);
    } finally {
      setDataLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#000814]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000814] via-[#001d3d] to-[#000814] text-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {profile?.fullName || user.email}!
          </h1>
          <p className="text-gray-400">
            Continue your certification journey
          </p>
        </div>

        {/* DiskarteAI Button - Prominent Feature */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-[#ffd60a] via-[#ffc300] to-[#ffd60a] border-[#ffd60a] shadow-2xl shadow-[#ffd60a]/30 hover:shadow-[#ffd60a]/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-[#000814] mb-2">
                    🤖 DiskarteAI - Your AI Study Companion
                  </h3>
                  <p className="text-[#001d3d] font-medium">
                    Get personalized study recommendations, instant answers, and AI-powered learning assistance
                  </p>
                </div>
                <Button 
                  size="lg"
                  className="bg-[#000814] text-[#ffd60a] hover:bg-[#001d3d] hover:text-white font-bold text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-[#000814] hover:border-[#ffd60a] min-w-[200px]"
                  onClick={() => window.open('https://diskarteai.vercel.app', '_blank')}
                >
                  Launch DiskarteAI
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#003566] border-[#ffd60a]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">In Progress</CardTitle>
              <BookOpen className="h-4 w-4 text-[#ffd60a]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{userProgress.length}</div>
              <p className="text-xs text-gray-400">Active certifications</p>
            </CardContent>
          </Card>

          <Card className="bg-[#003566] border-[#ffd60a]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Favorites</CardTitle>
              <Heart className="h-4 w-4 text-[#ffd60a]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{favorites.length}</div>
              <p className="text-xs text-gray-400">Saved for later</p>
            </CardContent>
          </Card>

          <Card className="bg-[#003566] border-[#ffd60a]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Completed</CardTitle>
              <Award className="h-4 w-4 text-[#ffd60a]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {completedCourses.length}
              </div>
              <p className="text-xs text-gray-400">Certifications earned</p>
            </CardContent>
          </Card>

          <Card className="bg-[#003566] border-[#ffd60a]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#ffd60a]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {profile?.learningStreak || 0}
              </div>
              <p className="text-xs text-gray-400">Day streak</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* In Progress Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Continue Learning</h2>
              <Link to="/certifications">
                <Button variant="outline" size="sm" className="border-[#ffd60a] text-[#ffd60a] bg-transparent hover:bg-[#ffd60a]/10 hover:text-[#ffd60a]">
                  Browse All
                </Button>
              </Link>
            </div>

            {dataLoading ? (
              <Card className="bg-[#001d3d] border-[#ffd60a]/20">
                <CardContent className="py-12 text-center">
                  <p className="text-gray-400">Loading...</p>
                </CardContent>
              </Card>
            ) : userProgress.length > 0 ? (
              <div className="space-y-4">
                {userProgress.map((item) => (
                  <Card key={item.id} className="bg-[#001d3d] border-[#ffd60a]/20 hover:border-[#ffd60a] transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-white">
                            {item.certifications?.title}
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            {item.certifications?.provider} • {item.certifications?.difficulty}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="bg-[#003566] text-white">
                          {item.certifications?.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock className="h-4 w-4 text-[#ffd60a]" />
                          <span>Started {new Date(item.started_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-[#ffd60a]/20 text-[#ffd60a] border-[#ffd60a]/30 font-semibold">
                            Started
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/certifications/${item.certification_id}`} className="flex-1">
                          <Button className="w-full bg-[#ffd60a] text-[#001d3d] hover:bg-[#ffc300] shadow-sm">
                            Resume
                          </Button>
                        </Link>
                        {item.certifications?.external_url && (
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-[#ffd60a]/50 text-[#ffd60a]"
                            onClick={() => window.open(item.certifications?.external_url || '', '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-[#001d3d] border-[#ffd60a]/20">
                <CardContent className="py-12 text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-[#ffd60a]" />
                  <h3 className="text-lg font-semibold text-white mb-2">No certifications in progress</h3>
                  <p className="text-gray-400 mb-4">Start your learning journey today!</p>
                  <Link to="/certifications">
                    <Button className="bg-[#ffd60a] text-[#001d3d] hover:bg-[#ffd60a]/90">
                      Browse Certifications
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Completed Courses Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Completed Courses</h2>
              <Button variant="outline" size="sm" className="border-[#ffd60a] text-[#ffd60a] bg-transparent hover:bg-[#ffd60a]/10 hover:text-[#ffd60a]">
                View All ({completedCourses.length})
              </Button>
            </div>

            {dataLoading ? (
              <Card className="bg-[#001d3d] border-[#ffd60a]/20">
                <CardContent className="py-12 text-center">
                  <p className="text-gray-400">Loading...</p>
                </CardContent>
              </Card>
            ) : completedCourses.length > 0 ? (
              <div className="space-y-4">
                {completedCourses.slice(0, 5).map((item) => (
                  <Card key={item.id} className="bg-[#001d3d] border-[#ffd60a]/20 hover:border-[#ffd60a] transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-white">
                            {item.certifications?.title}
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            {item.certifications?.provider} • {item.certifications?.difficulty}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="bg-[#003566] text-white">
                          {item.certifications?.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          <span>Completed {new Date(item.completed_at || '').toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}</span>
                        </div>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                          ✓ Completed
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/certifications/${item.certification_id}`} className="flex-1">
                          <Button variant="outline" className="w-full border-[#ffd60a] text-[#ffd60a] bg-transparent hover:bg-[#ffd60a]/10 hover:text-[#ffd60a]">
                            View Details
                          </Button>
                        </Link>
                        {item.certifications?.external_url && (
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-[#ffd60a]/50 text-[#ffd60a] hover:bg-[#ffd60a]/10"
                            onClick={() => window.open(item.certifications?.external_url || '', '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-[#001d3d] border-[#ffd60a]/20">
                <CardContent className="py-12 text-center">
                  <Award className="h-12 w-12 mx-auto mb-4 text-[#ffd60a]" />
                  <h3 className="text-lg font-semibold text-white mb-2">No completed certifications yet</h3>
                  <p className="text-gray-400 mb-4">Complete your first certification to see it here!</p>
                  <Link to="/certifications">
                          <Button className="bg-[#ffd60a] text-[#001d3d] hover:bg-[#ffc300] shadow-sm">
                            Browse Certifications
                          </Button>
                        </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Favorites Section - Full Width */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Your Favorites</h2>
            <Link to="/favorites">
              <Button variant="outline" size="sm" className="border-[#ffd60a] text-[#ffd60a] hover:bg-[#ffd60a] hover:text-[#000814]">
                View All
              </Button>
            </Link>
          </div>

          {dataLoading ? (
            <Card className="bg-[#001d3d] border-[#ffd60a]/20">
              <CardContent className="py-12 text-center">
                <p className="text-gray-400">Loading...</p>
              </CardContent>
            </Card>
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((item) => (
                <Card key={item.certification_id} className="bg-[#001d3d] border-[#ffd60a]/20 hover:border-[#ffd60a] transition-colors">
                  <CardHeader>
                    <CardTitle className="text-base text-white line-clamp-2">
                      {item.certifications?.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {item.certifications?.provider} • {item.certifications?.difficulty}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button asChild size="sm" className="w-full border-[#ffd60a] text-[#ffd60a] bg-transparent hover:bg-[#ffd60a]/10 hover:text-[#ffd60a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd60a]/40 rounded-md h-9 px-3">
                        <Link to={`/certifications/${item.certification_id}`} aria-label={`View details for ${item.certifications?.title}`}>
                          View Details
                        </Link>
                      </Button>
                      {item.certifications?.external_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#ffd60a]/50 text-[#ffd60a]"
                          onClick={() => window.open(item.certifications?.external_url || '', '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-[#001d3d] border-[#ffd60a]/20">
              <CardContent className="py-12 text-center">
                <Heart className="h-12 w-12 mx-auto mb-4 text-[#ffd60a]" />
                <h3 className="text-lg font-semibold text-white mb-2">No favorites yet</h3>
                <p className="text-gray-400 mb-4">
                  Save certifications you're interested in
                </p>
                <Link to="/certifications">
                  <Button className="bg-[#ffd60a] text-[#001d3d] hover:bg-[#ffd60a]/90">
                    Browse Certifications
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
