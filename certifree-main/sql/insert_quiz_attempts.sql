INSERT INTO public.quiz_attempts (
    user_id, certification_id, total_questions, correct_answers, score_percentage,
    time_taken_minutes, answers, started_at, completed_at
) VALUES
('159b1caa-a085-461f-ad48-9ac7f61f4a72', 'google-cloud-digital-leader', 3, 2, 67,
8, '{"q-001": "Scalability, flexibility, and cost optimization", "q-002": "Cloud Storage", "q-003": "False"}', '2024-02-08T10:00:00Z', '2024-02-08T10:08:00Z'),

('159b1caa-a085-461f-ad48-9ac7f61f4a72', 'aws-cloud-practitioner', 2, 2, 100,
5, '{"q-004": "Security responsibilities between AWS and customers", "q-005": "Amazon EC2"}', '2023-12-15T14:30:00Z', '2023-12-15T14:35:00Z'); 