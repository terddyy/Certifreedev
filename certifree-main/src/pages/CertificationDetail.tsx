import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { ChevronRight, ExternalLink, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ReviewCard } from "@/components/ReviewCard";
import { useAuth } from "@/contexts/AuthContext";
import {
  isTaking,
  startTaking,
  stopTaking,
  isCompleted,
  markAsCompleted,
  markAsInProgress,
} from "@/lib/progress";
import {
  getCertification,
  checkFavoriteStatus,
  addFavorite,
  removeFavorite,
} from "@/lib/certifications-api";
import { Certification } from "@/lib/types/certifications";

interface Review {
  id: string;
  user_id: string;
  certification_id: string;
  rating: number;
  title: string;
  review_text: string | null;
  created_at: string;
  profiles?: {
    full_name?: string;
    email?: string;
  };
}

export default function CertificationDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [certification, setCertification] = useState<Certification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userTakingStatus, setUserTakingStatus] = useState<boolean | null>(null);
  const [userCompletedStatus, setUserCompletedStatus] = useState<boolean | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    const fetchCertification = async () => {
      if (!id) {
        setError("No certification ID provided");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const { data, error } = await getCertification(id);

        if (error) {
          throw error;
        }

        if (data) {
          setCertification(data as Certification);
        } else {
          setError("Certification not found");
        }
      } catch (err: any) {
        console.error("Error fetching certification:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCertification();
  }, [id]);

  useEffect(() => {
    const checkUserTakingStatus = async () => {
      if (user && certification) {
        const { data, error } = await isTaking(user.id, certification.id);
        if (error) {
          console.error("Error checking user taking status:", error.message);
          setUserTakingStatus(false);
        } else {
          setUserTakingStatus(data);
        }
      }
    };
    checkUserTakingStatus();
  }, [user, certification]);

  useEffect(() => {
    const checkUserCompletedStatus = async () => {
      if (user && certification) {
        const { data, error } = await isCompleted(user.id, certification.id);
        if (error) {
          console.error("Error checking user completed status:", error.message);
          setUserCompletedStatus(false);
        } else {
          setUserCompletedStatus(data);
        }
      }
    };
    checkUserCompletedStatus();
  }, [user, certification]);

  useEffect(() => {
    const checkFavorite = async () => {
      if (user && certification) {
        const { data, error } = await checkFavoriteStatus(user.id, certification.id);
        if (error) {
          console.error("Error checking favorite status:", error.message);
          setIsFavorite(false);
        } else {
          setIsFavorite(!!data);
        }
      }
    };
    checkFavorite();
  }, [user, certification]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!certification) return;

      setLoadingReviews(true);
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select(`
            id,
            user_id,
            certification_id,
            rating,
            content,
            created_at,
            profiles:user_id (full_name, email)
          `)
          .eq("certification_id", certification.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching reviews:", error);
          throw error;
        }
        const formattedReviews: Review[] = (data || []).map((review: any) => ({
          id: review.id,
          user_id: review.user_id,
          certification_id: review.certification_id,
          rating: review.rating,
          title: 'User Review',
          review_text: review.content || '',
          created_at: review.created_at,
          profiles: Array.isArray(review.profiles) ? review.profiles[0] : review.profiles,
        }));

        setReviews(formattedReviews);
      } catch (err: any) {
        console.error("Error fetching reviews:", err.message);
        toast.error("Failed to load reviews");
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [certification]);

  const handleToggleFavorite = async () => {
    if (!user || !certification) {
      toast.error("Please log in to manage favorites.");
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        const { error } = await removeFavorite(user.id, certification.id);
        if (error) throw error;
        setIsFavorite(false);
        toast.success(`"${certification.title}" removed from favorites.`);
      } else {
        const { error } = await addFavorite(user.id, certification.id);
        if (error) throw error;
        setIsFavorite(true);
        toast.success(`"${certification.title}" added to favorites!`);
      }
    } catch (err: any) {
      console.error("Error toggling favorite status:", err.message);
      toast.error(`Failed to update favorite status: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTaking = async () => {
    if (!user || !certification) {
      toast.error("Please log in to track your progress.");
      return;
    }

    setLoading(true);
    try {
      if (userTakingStatus) {
        // Currently taking, so stop
        const { error } = await stopTaking(user.id, certification.id);
        if (error) throw error;
        setUserTakingStatus(false);
        toast.success(
          `You are no longer taking "${certification.title}".`
        );
      } else {
        // Not taking, so start
        const { error } = await startTaking(user.id, certification.id);
        if (error) throw error;
        setUserTakingStatus(true);
        toast.success(`You are now taking "${certification.title}"!`);
      }
    } catch (err: any) {
      console.error("Error toggling taking status:", err.message);
      toast.error(`Failed to update progress: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCompleted = async () => {
    if (!user || !certification) {
      toast.error("Please log in to mark certifications as completed.");
      return;
    }

    setLoading(true);
    try {
      if (userCompletedStatus) {
        // Currently completed, so mark as in progress
        const { error } = await markAsInProgress(user.id, certification.id);
        if (error) throw error;
        setUserCompletedStatus(false);
        setUserTakingStatus(true);
        toast.success(`"${certification.title}" marked as in progress.`);
      } else {
        // Not completed, so mark as completed
        const { error } = await markAsCompleted(user.id, certification.id);
        if (error) throw error;
        setUserCompletedStatus(true);
        setUserTakingStatus(false);
        toast.success(`🎉 Congratulations! You've completed "${certification.title}"!`);
      }
    } catch (err: any) {
      console.error("Error toggling completed status:", err.message);
      toast.error(`Failed to update completion status: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user || !certification) {
      toast.error("Please log in to submit a review.");
      return;
    }
    if (!reviewContent.trim()) {
      toast.error("Review content cannot be empty.");
      return;
    }

    setIsSubmittingReview(true);
    try {
      // Check if user already reviewed this certification
      const { data: existingReviews } = await supabase
        .from("reviews")
        .select("id")
        .eq("user_id", user.id)
        .eq("certification_id", certification.id)
        .maybeSingle();

      if (existingReviews) {
        toast.error("You have already submitted a review for this certification.");
        setIsSubmittingReview(false);
        return;
      }

      // Insert new review with exact column names from database
      const reviewData = {
        user_id: user.id,
        certification_id: certification.id,
        rating: reviewRating,
        content: reviewContent.trim(),
      };

      const { error } = await supabase.from("reviews").insert(reviewData);

      if (error) {
        console.error("Insert error details:", error);
        toast.error(`Failed to submit review: ${error.message}`);
        setIsSubmittingReview(false);
        return;
      }

      toast.success("Review submitted successfully!");
      setReviewContent("");
      setReviewRating(5);

      // Refresh reviews list
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select(`
          id,
          user_id,
          certification_id,
          rating,
          content,
          created_at,
          profiles:user_id (full_name, email)
        `)
        .eq("certification_id", certification.id)
        .order("created_at", { ascending: false });

      if (reviewsData) {
        const formattedReviews: Review[] = reviewsData.map((review: any) => ({
          id: review.id,
          user_id: review.user_id,
          certification_id: review.certification_id,
          rating: review.rating,
          title: 'User Review',
          review_text: review.content || '',
          created_at: review.created_at,
          profiles: Array.isArray(review.profiles) ? review.profiles[0] : review.profiles,
        }));
        setReviews(formattedReviews);
      }
    } catch (err: any) {
      console.error("Error submitting review:", err.message);
      toast.error(`Failed to submit review: ${err.message}`);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading certification...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">Error: {error}</div>
    );
  }

  if (!certification) {
    return (
      <div className="container mx-auto p-4">Certification not found.</div>
    );
  }

  const breadcrumbs = [
    { name: "Certifications", href: "/certifications" },
    { name: certification.title, href: `/certifications/${certification.id}` },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <nav>
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.name} className="flex items-center">
                  <Link
                    to={crumb.href}
                    className="hover:text-[#003566] transition-colors flex items-center font-medium"
                  >
                    {crumb.name}
                  </Link>
                  {index < breadcrumbs.length - 1 && (
                    <ChevronRight className="w-4 h-4 ml-2 text-gray-400" />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#000814] via-[#001d3d] to-[#003566] text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Provider & Category */}
              <div className="flex items-center gap-3 text-sm">
                <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">
                  {certification.provider}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-300">{certification.category}</span>
              </div>

              {/* Title */}
              <h1 className="text-5xl font-bold leading-tight tracking-tight">
                {certification.title}
              </h1>

              {/* Description */}
              <p className="text-xl text-gray-300 leading-relaxed max-w-3xl">
                {certification.description}
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xl ${
                          i < Math.floor(certification.rating)
                            ? "text-[#ffd60a]"
                            : "text-gray-500"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-lg font-semibold">
                    {certification.rating}
                  </span>
                  <span className="text-gray-400">
                    ({certification.total_reviews} reviews)
                  </span>
                </div>
                <div className="h-6 w-px bg-gray-600"></div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">{certification.duration}</span>
                </div>
                <div className="h-6 w-px bg-gray-600"></div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    certification.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-300' :
                    certification.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {certification.difficulty}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Image & Actions */}
            <div className="lg:col-span-1 space-y-4">
              {certification.image_url && (
                <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <img
                    src={certification.image_url}
                    alt={certification.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  className="w-full bg-[#ffd60a] hover:bg-[#ffc800] text-[#000814] py-6 px-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                  onClick={async (e) => {
                    e.preventDefault();
                    if (!user) {
                      toast.error('Please log in to start the certification.');
                      return;
                    }

                    // Optimistically set taking status
                    setUserTakingStatus(true);
                    try {
                      // Track that the user started this certification (server-side)
                      const { error } = await startTaking(user.id, certification.id);
                      if (error) {
                        console.error('startTaking error', error);
                        toast.error('Could not mark as started on the server.');
                      }
                    } catch (err: any) {
                      console.error('startTaking exception', err);
                      toast.error('Could not mark as started.');
                    }

                    // Open the provider page in a new tab (do not rely on asChild anchor)
                    try {
                      if (certification.external_url) {
                        window.open(certification.external_url, '_blank', 'noopener');
                      }
                    } catch (err) {
                      console.error('Failed to open certification link', err);
                    }
                  }}
                >
                  Start Certification
                  <ExternalLink className="w-5 h-5" />
                </Button>

                {/* Completion Status Button */}
                {user && (
                  <Button
                    className={`w-full py-6 px-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 ${
                      userCompletedStatus
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300"
                    }`}
                    onClick={handleToggleCompleted}
                    disabled={loading}
                  >
                    {userCompletedStatus ? "✓ Completed" : "Mark as Completed"}
                  </Button>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className={`py-6 px-4 rounded-xl text-base font-medium border-2 transition-all duration-200 ${
                      userTakingStatus
                        ? "bg-white/10 border-white/30 text-white hover:bg-white/20"
                        : "bg-transparent border-white/30 text-white hover:bg-white/10"
                    }`}
                    onClick={handleToggleTaking}
                    disabled={loading || userCompletedStatus}
                  >
                    {userTakingStatus ? "Taking ✓" : "Track Progress"}
                  </Button>

                  <Button
                    variant="outline"
                    className={`py-6 px-4 rounded-xl text-base font-medium border-2 transition-all duration-200 ${
                      isFavorite
                        ? "bg-[#ffd60a]/20 border-[#ffd60a] text-[#ffd60a] hover:bg-[#ffd60a]/30"
                        : "bg-transparent border-white/30 text-white hover:bg-white/10"
                    }`}
                    onClick={handleToggleFavorite}
                    disabled={loading}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                  </Button>
                </div>
              </div>

              {/* Free/Paid Badge */}
              <div className="flex items-center justify-center gap-2 py-3 px-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <span className="text-sm font-medium">
                  {certification.is_free ? "🎉 Free Certification" : "💼 Paid Certification"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Quick Info */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Quick Info
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#003566] rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Provider</p>
                    <p className="text-base font-medium text-gray-900">
                      {certification.provider}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#003566] rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="text-base font-medium text-gray-900">
                      {certification.duration}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#003566] rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="text-base font-medium text-gray-900">
                      {certification.certification_type}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#003566] rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Career Impact</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#ffd60a] h-2 rounded-full"
                          style={{ width: `${(certification.career_impact / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-base font-medium text-gray-900">
                        {certification.career_impact}/10
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
                <TabsTrigger 
                  value="overview"
                  className="data-[state=active]:bg-[#003566] data-[state=active]:text-white rounded-lg px-6 py-3 font-medium transition-all"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews"
                  className="data-[state=active]:bg-[#003566] data-[state=active]:text-white rounded-lg px-6 py-3 font-medium transition-all"
                >
                  Reviews ({reviews.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      About This Certification
                    </h2>
                    <p className="text-base text-gray-700 leading-relaxed">
                      {certification.description}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      What You'll Learn
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {certification.skills && certification.skills.length > 0 ? (
                        certification.skills.slice(0, 6).map((skill, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-[#003566]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-[#003566] text-sm">✓</span>
                            </div>
                            <p className="text-base text-gray-700">{skill}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 col-span-2">
                          Skills details available on the certification provider's page.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-8 space-y-6">
                {/* Write Review Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Share Your Experience
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Rating
                      </label>
                      <div className="flex items-center gap-4">
                        <Slider
                          defaultValue={[reviewRating]}
                          max={5}
                          step={1}
                          min={1}
                          onValueChange={(val) => setReviewRating(val[0])}
                          className="flex-1"
                        />
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-2xl ${
                                i < reviewRating
                                  ? "text-[#ffd60a]"
                                  : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Review
                      </label>
                      <Textarea
                        placeholder="Share your thoughts about this certification. How was your experience? What did you learn?"
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        rows={5}
                        className="resize-none rounded-xl"
                      />
                    </div>
                    <Button 
                      onClick={handleSubmitReview} 
                      disabled={isSubmittingReview}
                      className="bg-[#003566] hover:bg-[#001d3d] text-white px-8 py-6 rounded-xl text-base font-semibold"
                    >
                      {isSubmittingReview ? "Submitting..." : "Submit Review"}
                    </Button>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Student Reviews
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                  </p>
                  
                  {loadingReviews ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">Loading reviews...</p>
                    </div>
                  ) : reviews.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-gray-500 text-lg">No reviews yet</p>
                      <p className="text-gray-400 text-sm mt-2">Be the first to share your experience!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <ReviewCard
                          key={review.id}
                          userName={review.profiles?.full_name || review.profiles?.email?.split('@')[0] || 'Anonymous User'}
                          rating={review.rating}
                          date={new Date(review.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                          content={review.review_text || ''}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}