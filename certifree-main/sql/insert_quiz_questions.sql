INSERT INTO public.quiz_questions (
    id, certification_id, question_text, question_type, options, correct_answer, explanation,
    difficulty_level, points, module
) VALUES
('q-001', 'google-cloud-digital-leader', 'What is the primary benefit of cloud computing for businesses?', 'multiple_choice',
ARRAY['Reduced hardware costs only', 'Scalability, flexibility, and cost optimization', 'Faster internet speeds', 'Better graphics performance'],
'Scalability, flexibility, and cost optimization', 'Cloud computing offers multiple benefits including the ability to scale resources up or down based on demand, flexibility to access services from anywhere, and cost optimization through pay-as-you-use models.',
'easy', 1, 'Cloud Fundamentals'),

('q-002', 'google-cloud-digital-leader', 'Which Google Cloud service is primarily used for data warehousing?', 'multiple_choice',
ARRAY['Cloud SQL', 'BigQuery', 'Cloud Storage', 'Firestore'],
'BigQuery', 'BigQuery is Google Cloud''s fully-managed, serverless data warehouse that enables scalable analysis over petabytes of data.',
'medium', 2, 'Google Cloud Services'),

('q-003', 'google-cloud-digital-leader', 'True or False: Cloud computing eliminates all security concerns for businesses.', 'true_false',
ARRAY['True', 'False'], 'False', 'While cloud providers offer robust security measures, businesses still need to implement proper security practices and maintain shared responsibility for security.',
'easy', 1, 'Cloud Security'),

('q-004', 'aws-cloud-practitioner', 'What does the AWS Shared Responsibility Model define?', 'multiple_choice',
ARRAY['How costs are shared between AWS and customers', 'Security responsibilities between AWS and customers', 'How data is shared between AWS services', 'Support responsibilities between AWS and partners'],
'Security responsibilities between AWS and customers', 'The AWS Shared Responsibility Model defines which security responsibilities belong to AWS (security of the cloud) and which belong to the customer (security in the cloud). ',
'medium', 2, 'AWS Security'),

('q-005', 'aws-cloud-practitioner', 'Which AWS service provides scalable compute capacity in the cloud?', 'multiple_choice',
ARRAY['Amazon S3', 'Amazon RDS', 'Amazon EC2', 'Amazon Route 53'],
'Amazon EC2', 'Amazon Elastic Compute Cloud (EC2) provides scalable computing capacity in the AWS cloud, allowing you to launch virtual servers as needed.',
'easy', 1, 'Core AWS Services'),

('q-006', 'google-data-analytics', 'In data analysis, what is the purpose of data cleaning?', 'multiple_choice',
ARRAY['To make data look prettier', 'To remove or correct inaccurate, incomplete, or irrelevant data', 'To reduce file size only', 'To encrypt sensitive information'],
'To remove or correct inaccurate, incomplete, or irrelevant data', 'Data cleaning is the process of identifying and correcting errors, inconsistencies, and inaccuracies in datasets to improve data quality for analysis.',
'easy', 1, 'Data Preparation'),

('q-007', 'google-data-analytics', 'Which type of chart is best for showing trends over time?', 'multiple_choice',
ARRAY['Pie chart', 'Bar chart', 'Line chart', 'Scatter plot'],
'Line chart', 'Line charts are ideal for displaying trends and changes over time, as they clearly show the progression of data points connected by a line.',
'easy', 1, 'Data Visualization'),

('q-008', 'freecodecamp-web-development', 'What does CSS stand for?', 'multiple_choice',
ARRAY['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Coded Style Standards'],
'Cascading Style Sheets', 'CSS stands for Cascading Style Sheets, which is used to describe the presentation and styling of HTML documents.',
'easy', 1, 'CSS Basics'); 