import { supabase } from "@/lib/supabase";

export interface CategoryInput {
  name: string;
  slug: string;
  description?: string;
}

export interface CertificationInput {
  id?: string; // Slug-based identifier (optional for create, will be auto-generated if not provided)
  title: string;
  provider: string;
  category: string; // category name or slug
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
  completion_count?: number; // Added to match database schema
  type?: 'public' | 'certifree'; // Type of certification
  courseId?: string | null; // Optional course ID for CertiFree type
}

// Categories CRUD
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

// Certifications CRUD
export async function listCertifications(search?: string) {
  let query = supabase.from("certifications").select("*").order("title");
  if (search && search.trim()) {
    query = query.ilike("title", `%${search}%`);
  }
  return query;
}

export async function createCertification(input: CertificationInput) {
  return supabase.from("certifications").insert({
    id: input.id, // Use provided slug-based ID
    title: input.title,
    provider: input.provider,
    category: input.category,
    difficulty: input.difficulty,
    duration: input.duration,
    rating: input.rating ?? 0,
    total_reviews: input.totalReviews ?? 0,
    description: input.description,
    skills: input.skills ?? [],
    prerequisites: input.prerequisites ?? [],
    image_url: input.imageUrl ?? null,
    external_url: input.externalUrl,
    is_free: input.isFree,
    certification_type: input.certificationType,
    career_impact: 0,
    completion_count: 0,
    tags: input.tags ?? [],
  });
}

export async function updateCertification(id: string, patch: Partial<CertificationInput>) {
  const mapped: any = {};
  if (patch.title !== undefined) mapped.title = patch.title;
  if (patch.provider !== undefined) mapped.provider = patch.provider;
  if (patch.category !== undefined) mapped.category = patch.category;
  if (patch.difficulty !== undefined) mapped.difficulty = patch.difficulty;
  if (patch.duration !== undefined) mapped.duration = patch.duration;
  if (patch.description !== undefined) mapped.description = patch.description;
  if (patch.skills !== undefined) mapped.skills = patch.skills;
  if (patch.prerequisites !== undefined) mapped.prerequisites = patch.prerequisites;
  if (patch.rating !== undefined) mapped.rating = patch.rating;
  if (patch.totalReviews !== undefined) mapped.total_reviews = patch.totalReviews;
  if (patch.imageUrl !== undefined) mapped.image_url = patch.imageUrl;
  if (patch.externalUrl !== undefined) mapped.external_url = patch.externalUrl;
  if (patch.isFree !== undefined) mapped.is_free = patch.isFree;
  if (patch.certificationType !== undefined) mapped.certification_type = patch.certificationType;
  if (patch.tags !== undefined) mapped.tags = patch.tags;
  return supabase.from("certifications").update(mapped).eq("id", id);
}

export async function deleteCertification(id: string) {
  return supabase.from("certifications").delete().eq("id", id);
} 