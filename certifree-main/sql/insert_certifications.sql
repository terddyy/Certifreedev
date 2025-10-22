INSERT INTO public.certifications (
    id, title, provider, category, difficulty, duration, rating, total_reviews, description,
    skills, prerequisites, image_url, external_url, is_free, certification_type, career_impact,
    completion_count, tags, last_updated
) VALUES
('google-cloud-digital-leader', 'Google Cloud Digital Leader', 'Google', 'Cloud Computing', 'Beginner', '40-50 hours', 4.8, 1247, 'Learn cloud computing fundamentals and Google Cloud Platform basics. Perfect for business leaders and technical professionals starting their cloud journey.',
ARRAY['Cloud Fundamentals', 'GCP Basics', 'Digital Transformation', 'Cloud Economics'], ARRAY['Basic computer literacy', 'Business understanding'], '/api/placeholder/400/240', 'https://cloud.google.com/certification/cloud-digital-leader', TRUE, 'Course', 8,
15420, ARRAY['Google', 'Cloud', 'Leadership', 'Beginner-friendly'], '2024-01-15T00:00:00Z'),

('aws-cloud-practitioner', 'AWS Cloud Practitioner', 'Amazon', 'Cloud Computing', 'Beginner', '30-40 hours', 4.7, 2103, 'Foundation-level understanding of AWS Cloud, services, and terminology. Ideal for individuals in technical, managerial, sales, purchasing, or financial roles.',
ARRAY['AWS Fundamentals', 'Cloud Architecture', 'Security Basics', 'Pricing Models'], ARRAY['6 months general AWS Cloud experience'], '/api/placeholder/400/240', 'https://aws.amazon.com/certification/certified-cloud-practitioner/', TRUE, 'Exam', 9,
28650, ARRAY['AWS', 'Cloud', 'Foundation', 'Popular'], '2024-02-01T00:00:00Z'),

('microsoft-az-900', 'Microsoft Azure Fundamentals', 'Microsoft', 'Cloud Computing', 'Beginner', '25-35 hours', 4.6, 1876, 'Foundational knowledge of cloud services and how those services are provided with Microsoft Azure. Perfect for business and technical audiences.',
ARRAY['Azure Services', 'Cloud Concepts', 'Azure Pricing', 'Support'], ARRAY['General technology background'], '/api/placeholder/400/240', 'https://docs.microsoft.com/learn/certifications/azure-fundamentals/', TRUE, 'Course', 8,
19830, ARRAY['Microsoft', 'Azure', 'Cloud', 'Fundamentals'], '2024-01-28T00:00:00Z'),

('google-data-analytics', 'Google Data Analytics Professional Certificate', 'Google', 'Data Science', 'Beginner', '120-180 hours', 4.9, 3425, 'Learn in-demand skills like data cleaning, analysis, and visualization. Get job-ready for an entry-level data analyst role in under 6 months.',
ARRAY['Data Analysis', 'R Programming', 'Tableau', 'SQL', 'Data Visualization'], ARRAY['No prior experience required'], '/api/placeholder/400/240', 'https://www.coursera.org/professional-certificates/google-data-analytics', TRUE, 'Project', 9,
42100, ARRAY['Google', 'Data', 'Analytics', 'Career-change'], '2024-02-05T00:00:00Z'),

('freecodecamp-web-development', 'Responsive Web Design', 'FreeCodeCamp', 'Software Development', 'Beginner', '300 hours', 4.8, 5628, 'Learn HTML and CSS by building projects. Create responsive websites that work on any device. Completely free with hands-on projects.',
ARRAY['HTML5', 'CSS3', 'Responsive Design', 'Flexbox', 'CSS Grid'], ARRAY['Basic computer literacy'], '/api/placeholder/400/240', 'https://www.freecodecamp.org/learn/responsive-web-design/', TRUE, 'Project', 8,
67890, ARRAY['FreeCodeCamp', 'Web Development', 'HTML', 'CSS', 'Beginner'], '2024-01-20T00:00:00Z'),

('cisco-cybersecurity', 'Cisco Cybersecurity Essentials', 'Cisco', 'Cybersecurity', 'Intermediate', '70-90 hours', 4.5, 892, 'Foundational cybersecurity knowledge including risk management, incident response, digital forensics, and business continuity.',
ARRAY['Risk Assessment', 'Incident Response', 'Digital Forensics', 'Security Policies'], ARRAY['Basic networking knowledge', 'CCNA Introduction to Networks recommended'], '/api/placeholder/400/240', 'https://www.netacad.com/courses/cybersecurity/cybersecurity-essentials', TRUE, 'Course', 9,
8934, ARRAY['Cisco', 'Cybersecurity', 'Security', 'Networking'], '2024-01-10T00:00:00Z'),

('comptia-security-plus', 'CompTIA Security+ Study Guide', 'CompTIA', 'Cybersecurity', 'Intermediate', '80-120 hours', 4.7, 1234, 'Industry-standard cybersecurity certification covering threats, attacks, vulnerabilities, architecture, and more.',
ARRAY['Network Security', 'Compliance', 'Threats & Vulnerabilities', 'Identity Management'], ARRAY['2 years IT administration experience', 'Network+ recommended'], '/api/placeholder/400/240', 'https://www.comptia.org/certifications/security', TRUE, 'Exam', 10,
12567, ARRAY['CompTIA', 'Security', 'Industry Standard', 'Popular'], '2024-02-08T00:00:00Z'),

('google-project-management', 'Google Project Management Professional Certificate', 'Google', 'Project Management', 'Beginner', '90-120 hours', 4.8, 2876, 'Launch a career in project management. Learn in-demand skills including Agile, Scrum, and traditional project management approaches.',
ARRAY['Project Planning', 'Agile Management', 'Scrum', 'Risk Management', 'Stakeholder Management'], ARRAY['No prior experience required'], '/api/placeholder/400/240', 'https://www.coursera.org/professional-certificates/google-project-management', TRUE, 'Project', 9,
34567, ARRAY['Google', 'Project Management', 'Agile', 'Career-change'], '2024-01-30T00:00:00Z'); 