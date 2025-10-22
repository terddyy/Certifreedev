INSERT INTO public.user_progress (
    user_id, certification_id, status, progress_percentage, time_spent_minutes,
    started_at, completed_at, last_activity_at, notes
) VALUES
('159b1caa-a085-461f-ad48-9ac7f61f4a72', 'google-cloud-digital-leader', 'in_progress', 65, 1440,
'2024-01-10T00:00:00Z', NULL, '2024-02-08T00:00:00Z', 'Great content, really enjoying the hands-on labs'),

('159b1caa-a085-461f-ad48-9ac7f61f4a72', 'aws-cloud-practitioner', 'completed', 100, 2100,
'2023-11-15T00:00:00Z', '2023-12-20T00:00:00Z', '2023-12-20T00:00:00Z', 'Excellent foundation course, passed the exam with 85%'),

('159b1caa-a085-461f-ad48-9ac7f61f4a72', 'google-data-analytics', 'completed', 100, 10800,
'2023-08-01T00:00:00Z', '2023-11-10T00:00:00Z', '2023-11-10T00:00:00Z', 'Amazing course! Really prepared me for my current data analyst role'),

('159b1caa-a085-461f-ad48-9ac7f61f4a72', 'microsoft-az-900', 'planned', 0, 0,
NULL, NULL, '2024-02-01T00:00:00Z', 'Planning to start after completing Google Cloud certification'); 