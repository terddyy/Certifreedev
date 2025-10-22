import { supabase } from "./supabase";
import { Certification } from "./types/certifications";

// Interfaces for input
export interface CategoryInput {
  name: string;
  slug: string;
  description?: string;
}

export interface CertificationInput {
  title: string;
  provider: string;
  category: string;
  difficulty: string;
  duration: string;
  description: string;
  imageUrl?: string;
  externalUrl: string;
  isFree: boolean;
  certificationType: string;
  skills?: string[];
  prerequisites?: string[];
  rating?: number;
  totalReviews?: number;
  tags?: string[];
  completion_count?: number;
}

// --- Categories CRUD ---
export async function listCategories() {
  return supabase.from("categories").select("*").order("name");
}

export async function createCategory(input: CategoryInput) {
  return supabase.from("categories").insert({
    name: input.name,
    slug: input.slug,
    description: input.description || null,
  });
}

export async function updateCategory(id: string, patch: Partial<CategoryInput>) {
  return supabase.from("categories").update(patch).eq("id", id);
}

export async function deleteCategory(id: string) {
  return supabase.from("categories").delete().eq("id", id);
}

// --- Certifications CRUD ---
export async function listCertifications() {
  return supabase.from("certifications").select("*").order("title");
}

export async function getCertification(id: string) {
  const { data, error } = await supabase
    .from('certifications')
    .select('*')
    .eq('id', id)
    .single();
  return { data: data as Certification, error };
}

export async function createCertification(input: CertificationInput, admin_id: string) {
  const payload = {
    title: input.title,
    provider: input.provider,
    category: input.category,
    difficulty: input.difficulty,
    duration: input.duration,
    description: input.description,
    image_url: input.imageUrl ?? null,
    external_url: input.externalUrl,
    is_free: input.isFree,
    certification_type: input.certificationType,
    skills: input.skills ?? [],
    prerequisites: input.prerequisites ?? [],
    rating: input.rating ?? 0,
    total_reviews: input.totalReviews ?? 0,
    tags: input.tags ?? [],
    completion_count: input.completion_count ?? 0,
    admin_id: admin_id,
  };

  return supabase.from("certifications").insert(payload).select().single();
}

export async function updateCertification(id: string, patch: Partial<CertificationInput>) {
  const mapped: any = {};
  if (patch.title !== undefined) mapped.title = patch.title;
  if (patch.provider !== undefined) mapped.provider = patch.provider;
  if (patch.category !== undefined) mapped.category = patch.category;
  if (patch.difficulty !== undefined) mapped.difficulty = patch.difficulty;
  if (patch.duration !== undefined) mapped.duration = patch.duration;
  if (patch.description !== undefined) mapped.description = patch.description;
  if (patch.imageUrl !== undefined) mapped.image_url = patch.imageUrl;
  if (patch.externalUrl !== undefined) mapped.external_url = patch.externalUrl;
  if (patch.isFree !== undefined) mapped.is_free = patch.isFree;
  if (patch.certificationType !== undefined) mapped.certification_type = patch.certificationType;
  if (patch.skills !== undefined) mapped.skills = patch.skills;
  if (patch.prerequisites !== undefined) mapped.prerequisites = patch.prerequisites;
  if (patch.rating !== undefined) mapped.rating = patch.rating;
  if (patch.totalReviews !== undefined) mapped.total_reviews = patch.totalReviews;
  if (patch.tags !== undefined) mapped.tags = patch.tags;
  if (patch.completion_count !== undefined) mapped.completion_count = patch.completion_count;

  mapped.last_updated = new Date().toISOString();
  return supabase.from("certifications").update(mapped).eq("id", id);
}

export async function deleteCertification(id: string) {
  return supabase.from("certifications").delete().eq("id", id);
}

// --- User Favorites ---
export async function checkFavoriteStatus(userId: string, certificationId: string) {
  const { data, error } = await supabase
    .from("user_favorites")
    .select("*")
    .eq("user_id", userId)
    .eq("certification_id", certificationId)
    .maybeSingle();
  
  return { data, error };
}

export async function addFavorite(userId: string, certificationId: string) {
  return supabase
    .from("user_favorites")
    .insert({ user_id: userId, certification_id: certificationId });
}

export async function removeFavorite(userId: string, certificationId: string) {
  return supabase
    .from("user_favorites")
    .delete()
    .eq("user_id", userId)
    .eq("certification_id", certificationId);
}

export async function listUserFavorites(userId: string) {
  return supabase
    .from("user_favorites")
    .select("certification_id")
    .eq("user_id", userId);
}

