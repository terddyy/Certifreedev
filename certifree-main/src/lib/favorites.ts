import { supabase } from "@/lib/supabase";

// ============================================================================
// TYPES
// ============================================================================

export type FavoriteRow = {
  user_id: string;
  certification_id: string;
  created_at: string;
};

export type FavoriteWithCertification = {
  certification_id: string;
  created_at: string;
  certifications: {
    id: string;
    title: string;
    provider: string;
    description: string | null;
    duration: string;
    external_url: string;
    category: string;
    difficulty: string;
    rating: number;
    image_url: string | null;
  }[];
};

// ============================================================================
// FAVORITE OPERATIONS
// ============================================================================

/**
 * Check if a certification is favorited by a user
 * @param userId - The user's UUID
 * @param certificationId - The certification's ID (slug)
 * @returns Object with data (boolean) and error
 */
export async function isFavorited(userId: string, certificationId: string) {
  const { data, error } = await supabase
    .from("user_favorites")
    .select("certification_id")
    .eq("user_id", userId)
    .eq("certification_id", certificationId)
    .limit(1);
  
  if (error) {
    console.error("Error checking favorite status:", error);
    return { data: false, error };
  }
  
  return { data: (data || []).length > 0, error: null };
}

/**
 * Add a certification to user's favorites
 * @param userId - The user's UUID
 * @param certificationId - The certification's ID (slug)
 */
export async function addFavorite(userId: string, certificationId: string) {
  const { data, error } = await supabase
    .from("user_favorites")
    .insert({ 
      user_id: userId, 
      certification_id: certificationId 
    })
    .select();
  
  if (error) {
    console.error("Error adding favorite:", error);
  }
  
  return { data, error };
}

/**
 * Remove a certification from user's favorites
 * @param userId - The user's UUID
 * @param certificationId - The certification's ID (slug)
 */
export async function removeFavorite(userId: string, certificationId: string) {
  const { data, error } = await supabase
    .from("user_favorites")
    .delete()
    .eq("user_id", userId)
    .eq("certification_id", certificationId)
    .select();
  
  if (error) {
    console.error("Error removing favorite:", error);
  }
  
  return { data, error };
}

/**
 * Toggle favorite status for a certification
 * @param userId - The user's UUID
 * @param certificationId - The certification's ID (slug)
 * @returns Object with data (new favorite status) and error
 */
export async function toggleFavorite(userId: string, certificationId: string) {
  const { data: isFav, error: checkError } = await isFavorited(userId, certificationId);
  
  if (checkError) {
    return { data: null, error: checkError };
  }
  
  if (isFav) {
    const { error } = await removeFavorite(userId, certificationId);
    return { data: false, error };
  } else {
    const { error } = await addFavorite(userId, certificationId);
    return { data: true, error };
  }
}

/**
 * Get all favorites for the current user (without certification details)
 * @param userId - The user's UUID
 * @returns List of favorite certification IDs
 */
export async function listFavoriteIds(userId: string) {
  const { data, error } = await supabase
    .from("user_favorites")
    .select("certification_id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error listing favorites:", error);
  }
  
  return { data, error };
}

/**
 * Get all favorites with full certification details
 * Uses Supabase's automatic join based on foreign key relationship
 * @param userId - The user's UUID
 * @returns List of favorites with certification details
 */
export async function listFavoritesWithDetails(userId: string) {
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
        rating,
        image_url
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error listing favorites with details:", error);
  }
  
  return { data: data as FavoriteWithCertification[], error };
}

/**
 * Get count of favorites for a user
 * @param userId - The user's UUID
 * @returns Count of favorites
 */
export async function getFavoriteCount(userId: string) {
  const { count, error } = await supabase
    .from("user_favorites")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);
  
  if (error) {
    console.error("Error getting favorite count:", error);
  }
  
  return { data: count || 0, error };
}

/**
 * Check if multiple certifications are favorited (batch check)
 * @param userId - The user's UUID
 * @param certificationIds - Array of certification IDs to check
 * @returns Object mapping certification IDs to favorite status
 */
export async function batchCheckFavorites(userId: string, certificationIds: string[]) {
  const { data, error } = await supabase
    .from("user_favorites")
    .select("certification_id")
    .eq("user_id", userId)
    .in("certification_id", certificationIds);
  
  if (error) {
    console.error("Error batch checking favorites:", error);
    return { data: {}, error };
  }
  
  // Create a map of certification_id -> boolean
  const favoriteMap: Record<string, boolean> = {};
  certificationIds.forEach(id => {
    favoriteMap[id] = data?.some(fav => fav.certification_id === id) || false;
  });
  
  return { data: favoriteMap, error: null };
} 