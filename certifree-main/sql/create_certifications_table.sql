-- Create certifications table for external certification catalog
-- Uses TEXT id to support slug-based URLs (e.g., 'google-cloud-digital-leader')

DROP TABLE IF EXISTS public.certifications CASCADE;

CREATE TABLE public.certifications (
    id text PRIMARY KEY,  -- Using text for slug-based IDs
    title text NOT NULL,
    provider text NOT NULL,
    category text NOT NULL,
    difficulty text NOT NULL,
    duration text NOT NULL,
    rating numeric(3,2) DEFAULT 0,
    total_reviews integer DEFAULT 0,
    description text,
    skills text[] DEFAULT '{}',
    prerequisites text[] DEFAULT '{}',
    image_url text,
    external_url text NOT NULL,  -- Link to provider's certification page
    is_free boolean DEFAULT true,
    certification_type text DEFAULT 'Course',  -- 'Course', 'Exam', 'Project', etc.
    career_impact integer DEFAULT 5,  -- 1-10 scale
    completion_count integer DEFAULT 0,
    tags text[] DEFAULT '{}',
    last_updated timestamp with time zone DEFAULT now(),
    admin_id uuid REFERENCES public.profiles(id),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_certifications_category ON public.certifications(category);
CREATE INDEX idx_certifications_provider ON public.certifications(provider);
CREATE INDEX idx_certifications_difficulty ON public.certifications(difficulty);
CREATE INDEX idx_certifications_rating ON public.certifications(rating DESC);
CREATE INDEX idx_certifications_is_free ON public.certifications(is_free);

-- Enable Row Level Security
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Everyone can view certifications
DROP POLICY IF EXISTS "Certifications are viewable by everyone." ON public.certifications;
CREATE POLICY "Certifications are viewable by everyone." 
    ON public.certifications FOR SELECT 
    USING (true);

-- Only admins can insert certifications
DROP POLICY IF EXISTS "Admins can insert certifications." ON public.certifications;
CREATE POLICY "Admins can insert certifications." 
    ON public.certifications FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND (is_admin = true OR is_super_admin = true)
        )
    );

-- Only admins can update certifications
DROP POLICY IF EXISTS "Admins can update certifications." ON public.certifications;
CREATE POLICY "Admins can update certifications." 
    ON public.certifications FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND (is_admin = true OR is_super_admin = true)
        )
    );

-- Only super admins can delete certifications
DROP POLICY IF EXISTS "Super admins can delete certifications." ON public.certifications;
CREATE POLICY "Super admins can delete certifications." 
    ON public.certifications FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND is_super_admin = true
        )
    );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_certifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_certifications_updated_at ON public.certifications;
CREATE TRIGGER update_certifications_updated_at
    BEFORE UPDATE ON public.certifications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_certifications_updated_at();

-- Add comments for documentation
COMMENT ON TABLE public.certifications IS 'External certifications catalog - links to third-party certification providers';
COMMENT ON COLUMN public.certifications.id IS 'Slug-based identifier (e.g., google-cloud-digital-leader)';
COMMENT ON COLUMN public.certifications.external_url IS 'Link to the certification provider''s official page';
COMMENT ON COLUMN public.certifications.career_impact IS 'Career impact rating from 1-10';
