INSERT INTO public.certification_reviews (
    id, certification_id, user_id, rating, title, review_text, would_recommend,
    difficulty_rating, time_to_complete_hours, helpful_count, is_verified, created_at, tags
) VALUES
(uuid_generate_v4(), 'google-cloud-digital-leader', '159b1caa-a085-461f-ad48-9ac7f61f4a72', 5, 'Excellent foundation for cloud journey', 'This certification provided a solid foundation for understanding cloud concepts. The content is well-structured and the hands-on labs really help reinforce the concepts. Perfect for beginners who want to understand cloud computing from a business perspective.', TRUE,
2, 45, 23, TRUE, '2024-01-15T14:30:00Z', ARRAY['beginner-friendly', 'well-structured', 'hands-on']),

(uuid_generate_v4(), 'google-cloud-digital-leader', '159b1caa-a085-461f-ad48-9ac7f61f4a72', 4, 'Good content, but could be more technical', 'Great for understanding the business side of cloud adoption. However, if you''re looking for deep technical content, you might want to supplement this with other resources. The certification exam was fair and well-designed.', TRUE,
2, 38, 15, TRUE, '2024-01-08T09:15:00Z', ARRAY['business-focused', 'exam-prep', 'supplemental-needed']),

(uuid_generate_v4(), 'aws-cloud-practitioner', '159b1caa-a085-461f-ad48-9ac7f61f4a72', 5, 'Perfect entry point to AWS', 'Comprehensive overview of AWS services without going too deep into technical details. The practice exams were particularly helpful. After completing this, I felt confident about pursuing more advanced AWS certifications.', TRUE,
3, 42, 31, TRUE, '2024-01-20T11:45:00Z', ARRAY['comprehensive', 'practice-exams', 'pathway-starter']),

(uuid_generate_v4(), 'aws-cloud-practitioner', '159b1caa-a085-461f-ad48-9ac7f61f4a72', 4, 'Solid foundation but needs hands-on practice', 'Good theoretical foundation but I wished there were more hands-on labs. The content covers all major AWS services well. Make sure to practice with the AWS console alongside studying.', TRUE,
3, 35, 18, FALSE, '2024-01-12T16:20:00Z', ARRAY['theoretical', 'console-practice', 'aws-services']),

(uuid_generate_v4(), 'google-data-analytics', '159b1caa-a085-461f-ad48-9ac7f61f4a72', 5, 'Career-changing certification!', 'This certification literally changed my career! I went from retail to data analyst thanks to the comprehensive curriculum. The projects are real-world applicable and the job preparation materials are excellent. Highly recommend for career changers.', TRUE,
3, 165, 47, TRUE, '2024-01-25T13:10:00Z', ARRAY['career-change', 'real-world-projects', 'job-preparation']),

(uuid_generate_v4(), 'freecodecamp-web-development', '159b1caa-a085-461f-ad48-9ac7f61f4a72', 5, 'Best free web development resource', 'FreeCodeCamp''s curriculum is incredibly well thought out. The progressive difficulty and project-based learning really helps concepts stick. The community is also very supportive. Can''t believe this is completely free!', TRUE,
2, 280, 52, TRUE, '2024-01-18T08:30:00Z', ARRAY['project-based', 'community', 'progressive-learning']),

(uuid_generate_v4(), 'cisco-cybersecurity', '159b1caa-a085-461f-ad48-9ac7f61f4a72', 4, 'Comprehensive security fundamentals', 'Covers all the essential cybersecurity concepts you need to know. The lab simulations are particularly valuable. Content can be dense at times, but that''s expected for cybersecurity. Good preparation for more advanced security certifications.', TRUE,
4, 78, 29, TRUE, '2024-01-05T12:45:00Z', ARRAY['comprehensive', 'lab-simulations', 'advanced-prep']),

(uuid_generate_v4(), 'google-project-management', '159b1caa-a085-461f-ad48-9ac7f61f4a72', 5, 'Practical project management skills', 'Excellent blend of theory and practical application. The case studies and real project examples make the concepts easy to understand and apply. Great for anyone looking to move into project management roles.', TRUE,
2, 95, 38, TRUE, '2024-01-28T15:20:00Z', ARRAY['practical', 'case-studies', 'role-transition']); 