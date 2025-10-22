// 🔄 DATABASE INTEGRATION POINT
// Current: Mock review data for frontend development
// Replace with: Supabase query - supabase.from('certification_reviews').select('*')
// Table: certification_reviews
// Dependencies: @supabase/supabase-js

export interface CertificationReview {
  id: string;
  certificationId: string;
  userId: string;
  userFullName: string;
  userAvatarUrl: string;
  rating: number; // 1-5 stars
  title: string;
  reviewText: string;
  wouldRecommend: boolean;
  difficultyRating: number; // 1-5 scale
  timeToCompleteHours: number;
  helpfulCount: number;
  isVerified: boolean;
  createdAt: string;
  tags: string[];
}

// 🔄 DATABASE INTEGRATION
// Current: Mock reviews for demo purposes
// Replace with: Supabase query with joins to get user profile data
export const mockReviews: CertificationReview[] = [
  {
    id: "review-001",
    certificationId: "google-cloud-digital-leader",
    userId: "user-456",
    userFullName: "Sarah Chen",
    userAvatarUrl: "/api/placeholder/50/50",
    rating: 5,
    title: "Excellent foundation for cloud journey",
    reviewText: "This certification provided a solid foundation for understanding cloud concepts. The content is well-structured and the hands-on labs really help reinforce the concepts. Perfect for beginners who want to understand cloud computing from a business perspective.",
    wouldRecommend: true,
    difficultyRating: 2,
    timeToCompleteHours: 45,
    helpfulCount: 23,
    isVerified: true,
    createdAt: "2024-01-15T14:30:00Z",
    tags: ["beginner-friendly", "well-structured", "hands-on"]
  },
  {
    id: "review-002", 
    certificationId: "google-cloud-digital-leader",
    userId: "user-789",
    userFullName: "Marcus Rodriguez",
    userAvatarUrl: "/api/placeholder/50/50",
    rating: 4,
    title: "Good content, but could be more technical",
    reviewText: "Great for understanding the business side of cloud adoption. However, if you're looking for deep technical content, you might want to supplement this with other resources. The certification exam was fair and well-designed.",
    wouldRecommend: true,
    difficultyRating: 2,
    timeToCompleteHours: 38,
    helpfulCount: 15,
    isVerified: true,
    createdAt: "2024-01-08T09:15:00Z",
    tags: ["business-focused", "exam-prep", "supplemental-needed"]
  },
  {
    id: "review-003",
    certificationId: "aws-cloud-practitioner",
    userId: "user-321",
    userFullName: "Emily Watson",
    userAvatarUrl: "/api/placeholder/50/50",
    rating: 5,
    title: "Perfect entry point to AWS",
    reviewText: "Comprehensive overview of AWS services without going too deep into technical details. The practice exams were particularly helpful. After completing this, I felt confident about pursuing more advanced AWS certifications.",
    wouldRecommend: true,
    difficultyRating: 3,
    timeToCompleteHours: 42,
    helpfulCount: 31,
    isVerified: true,
    createdAt: "2024-01-20T11:45:00Z",
    tags: ["comprehensive", "practice-exams", "pathway-starter"]
  },
  {
    id: "review-004",
    certificationId: "aws-cloud-practitioner", 
    userId: "user-654",
    userFullName: "David Kim",
    userAvatarUrl: "/api/placeholder/50/50",
    rating: 4,
    title: "Solid foundation but needs hands-on practice",
    reviewText: "Good theoretical foundation but I wished there were more hands-on labs. The content covers all major AWS services well. Make sure to practice with the AWS console alongside studying.",
    wouldRecommend: true,
    difficultyRating: 3,
    timeToCompleteHours: 35,
    helpfulCount: 18,
    isVerified: false,
    createdAt: "2024-01-12T16:20:00Z",
    tags: ["theoretical", "console-practice", "aws-services"]
  },
  {
    id: "review-005",
    certificationId: "google-data-analytics",
    userId: "user-987",
    userFullName: "Jessica Brown",
    userAvatarUrl: "/api/placeholder/50/50",
    rating: 5,
    title: "Career-changing certification!",
    reviewText: "This certification literally changed my career! I went from retail to data analyst thanks to the comprehensive curriculum. The projects are real-world applicable and the job preparation materials are excellent. Highly recommend for career changers.",
    wouldRecommend: true,
    difficultyRating: 3,
    timeToCompleteHours: 165,
    helpfulCount: 47,
    isVerified: true,
    createdAt: "2024-01-25T13:10:00Z",
    tags: ["career-change", "real-world-projects", "job-preparation"]
  },
  {
    id: "review-006",
    certificationId: "freecodecamp-web-development",
    userId: "user-147",
    userFullName: "Alex Thompson",
    userAvatarUrl: "/api/placeholder/50/50",
    rating: 5,
    title: "Best free web development resource",
    reviewText: "FreeCodeCamp's curriculum is incredibly well thought out. The progressive difficulty and project-based learning really helps concepts stick. The community is also very supportive. Can't believe this is completely free!",
    wouldRecommend: true,
    difficultyRating: 2,
    timeToCompleteHours: 280,
    helpfulCount: 52,
    isVerified: true,
    createdAt: "2024-01-18T08:30:00Z",
    tags: ["project-based", "community", "progressive-learning"]
  },
  {
    id: "review-007",
    certificationId: "cisco-cybersecurity",
    userId: "user-258",
    userFullName: "Maria Gonzalez",
    userAvatarUrl: "/api/placeholder/50/50",
    rating: 4,
    title: "Comprehensive security fundamentals",
    reviewText: "Covers all the essential cybersecurity concepts you need to know. The lab simulations are particularly valuable. Content can be dense at times, but that's expected for cybersecurity. Good preparation for more advanced security certifications.",
    wouldRecommend: true,
    difficultyRating: 4,
    timeToCompleteHours: 78,
    helpfulCount: 29,
    isVerified: true,
    createdAt: "2024-01-05T12:45:00Z",
    tags: ["comprehensive", "lab-simulations", "advanced-prep"]
  },
  {
    id: "review-008",
    certificationId: "google-project-management",
    userId: "user-369",
    userFullName: "Robert Liu",
    userAvatarUrl: "/api/placeholder/50/50",
    rating: 5,
    title: "Practical project management skills",
    reviewText: "Excellent blend of theory and practical application. The case studies and real project examples make the concepts easy to understand and apply. Great for anyone looking to move into project management roles.",
    wouldRecommend: true,
    difficultyRating: 2,
    timeToCompleteHours: 95,
    helpfulCount: 38,
    isVerified: true,
    createdAt: "2024-01-28T15:20:00Z",
    tags: ["practical", "case-studies", "role-transition"]
  }
];

export const getReviewsByCertificationId = (certificationId: string): CertificationReview[] => {
  return mockReviews.filter(review => review.certificationId === certificationId);
};

export const getReviewStats = (certificationId: string) => {
  const reviews = getReviewsByCertificationId(certificationId);
  
  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      recommendationPercentage: 0
    };
  }

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const ratingDistribution = reviews.reduce((dist, review) => {
    dist[review.rating as keyof typeof dist]++;
    return dist;
  }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  
  const recommendationPercentage = (reviews.filter(r => r.wouldRecommend).length / reviews.length) * 100;

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews: reviews.length,
    ratingDistribution,
    recommendationPercentage: Math.round(recommendationPercentage)
  };
};