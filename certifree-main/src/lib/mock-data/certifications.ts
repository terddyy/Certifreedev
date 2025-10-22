// 🔄 DATABASE INTEGRATION POINT
// Current: Mock certification data for frontend development
// Replace with: Supabase query - const { data } = await supabase.from('certifications').select('*')
// Table: certifications
// Dependencies: @supabase/supabase-js

export interface Certification {
  id: string;
  title: string;
  provider: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  rating: number;
  totalReviews: number;
  description: string;
  skills: string[];
  prerequisites: string[];
  imageUrl: string;
  externalUrl: string;
  isFree: boolean;
  certificationType: "Course" | "Exam" | "Project" | "Bootcamp"; // Removed "CertiFree" | "Public"
  careerImpact: number; // 1-10 scale
  completionCount: number;
  tags: string[];
  lastUpdated: string;
}

export type DefaultCategory =
  | "Computer Studies"
  | "Hospitality Management"
  | "Tourism Management"
  | "Business"
  | "Entrepreneurship"
  | "Education and Liberal Arts";

export const DEFAULT_CATEGORIES: { name: DefaultCategory; slug: string }[] = [
  { name: "Computer Studies", slug: "computer-studies" },
  { name: "Hospitality Management", slug: "hospitality-management" },
  { name: "Tourism Management", slug: "tourism-management" },
  { name: "Business", slug: "business" },
  { name: "Entrepreneurship", slug: "entrepreneurship" },
  { name: "Education and Liberal Arts", slug: "education-liberal-arts" },
];

export interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string; // profile id
  status: 'draft' | 'published';
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content?: string;
  videoUrl?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}