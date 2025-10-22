-- Migration: Add type and course_id columns to certifications table
-- Purpose: Support CertiFree internal certifications vs external public certifications
-- Date: 2025-10-15

-- Add type column to distinguish between public and certifree certifications
ALTER TABLE public.certifications 
ADD COLUMN IF NOT EXISTS type text DEFAULT 'public' CHECK (type IN ('public', 'certifree'));

-- Add course_id column to link CertiFree certifications to internal courses
ALTER TABLE public.certifications 
ADD COLUMN IF NOT EXISTS course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL;

-- Create index for better query performance on type
CREATE INDEX IF NOT EXISTS idx_certifications_type ON public.certifications(type);

-- Create index for course_id lookups
CREATE INDEX IF NOT EXISTS idx_certifications_course_id ON public.certifications(course_id);

-- Add comments for documentation
COMMENT ON COLUMN public.certifications.type IS 'Certification type: public (external) or certifree (internal platform certifications)';
COMMENT ON COLUMN public.certifications.course_id IS 'Optional link to internal course for CertiFree certifications';

-- Update existing certifications to be 'public' type (already the default)
UPDATE public.certifications 
SET type = 'public' 
WHERE type IS NULL;

-- Verification query
SELECT 
    column_name, 
    data_type, 
    column_default, 
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'certifications' 
    AND column_name IN ('type', 'course_id');
