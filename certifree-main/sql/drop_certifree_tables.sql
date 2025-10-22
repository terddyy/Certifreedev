-- SQL script to drop all CertiFree course-related tables
-- Run this in your Supabase SQL Editor

-- Drop all CertiFree tables in proper order (respecting foreign key constraints)
DROP TABLE IF EXISTS public.certifree_quiz_attempts CASCADE;
DROP TABLE IF EXISTS public.certifree_quiz_questions CASCADE;
DROP TABLE IF EXISTS public.certifree_quizzes CASCADE;
DROP TABLE IF EXISTS public.certifree_lessons CASCADE;
DROP TABLE IF EXISTS public.certifree_modules CASCADE;
DROP TABLE IF EXISTS public.certifree_certificates CASCADE;
DROP TABLE IF EXISTS public.certifree_enrollments CASCADE;
DROP TABLE IF EXISTS public.courses CASCADE;
DROP TABLE IF EXISTS public.course_enrollments CASCADE;

-- Also drop duplicate certificate tables
DROP TABLE IF EXISTS public.certi_certificates CASCADE;
DROP TABLE IF EXISTS public.certificates CASCADE;

-- Keep only: certifications, profiles, categories, user_favorites, app_logs, etc.
