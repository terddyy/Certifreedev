// Simplified types - only for external certifications catalog

export interface Certification {
  id: string;
  title: string;
  description: string | null;
  admin_id: string | null;
  created_at: string;
  updated_at: string;
  provider: string;
  category: string;
  difficulty: string;
  duration: string;
  rating?: number | null;
  total_reviews?: number | null;
  image_url: string | null;
  external_url: string | null;
  skills: string[];
  prerequisites: string[];
  tags: string[];
  is_free: boolean;
  certification_type: string;
  career_impact: number;
  completion_count?: number;
  last_updated?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  subscription_tier: string;
  learning_streak: number;
  total_certifications_completed: number;
  joined_at: string;
  preferences: Record<string, any>;
  stats: Record<string, any>;
  is_admin: boolean;
  is_super_admin: boolean;
}

export interface UserFavorite {
  user_id: string;
  certification_id: string;
  created_at: string;
}
