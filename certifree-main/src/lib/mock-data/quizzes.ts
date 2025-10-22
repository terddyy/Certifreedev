// 🔄 DATABASE INTEGRATION POINT
// Current: Mock quiz data for frontend development
// Replace with: Supabase query - supabase.from('quiz_questions').select('*')
// Table: quiz_questions, quiz_attempts
// Dependencies: @supabase/supabase-js

export interface QuizQuestion {
  id: string;
  certificationId: string;
  questionText: string;
  questionType: "multiple_choice" | "true_false" | "short_answer";
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficultyLevel: "easy" | "medium" | "hard";
  points: number;
  module: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  certificationId: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  timeTakenMinutes: number;
  answers: Record<string, string>;
  startedAt: string;
  completedAt: string;
}

// 🔄 DATABASE INTEGRATION
// Current: Mock quiz questions for demo
// Replace with: Supabase query filtered by certification ID
export const mockQuizQuestions: QuizQuestion[] = [
  {
    id: "q-001",
    certificationId: "google-cloud-digital-leader",
    questionText: "What is the primary benefit of cloud computing for businesses?",
    questionType: "multiple_choice",
    options: [
      "Reduced hardware costs only",
      "Scalability, flexibility, and cost optimization",
      "Faster internet speeds",
      "Better graphics performance"
    ],
    correctAnswer: "Scalability, flexibility, and cost optimization",
    explanation: "Cloud computing offers multiple benefits including the ability to scale resources up or down based on demand, flexibility to access services from anywhere, and cost optimization through pay-as-you-use models.",
    difficultyLevel: "easy",
    points: 1,
    module: "Cloud Fundamentals"
  },
  {
    id: "q-002",
    certificationId: "google-cloud-digital-leader",
    questionText: "Which Google Cloud service is primarily used for data warehousing?",
    questionType: "multiple_choice",
    options: [
      "Cloud SQL",
      "BigQuery",
      "Cloud Storage",
      "Firestore"
    ],
    correctAnswer: "BigQuery",
    explanation: "BigQuery is Google Cloud's fully-managed, serverless data warehouse that enables scalable analysis over petabytes of data.",
    difficultyLevel: "medium",
    points: 2,
    module: "Google Cloud Services"
  },
  {
    id: "q-003",
    certificationId: "google-cloud-digital-leader",
    questionText: "True or False: Cloud computing eliminates all security concerns for businesses.",
    questionType: "true_false",
    options: ["True", "False"],
    correctAnswer: "False",
    explanation: "While cloud providers offer robust security measures, businesses still need to implement proper security practices and maintain shared responsibility for security.",
    difficultyLevel: "easy",
    points: 1,
    module: "Cloud Security"
  },
  {
    id: "q-004",
    certificationId: "aws-cloud-practitioner",
    questionText: "What does the AWS Shared Responsibility Model define?",
    questionType: "multiple_choice",
    options: [
      "How costs are shared between AWS and customers",
      "Security responsibilities between AWS and customers",
      "How data is shared between AWS services",
      "Support responsibilities between AWS and partners"
    ],
    correctAnswer: "Security responsibilities between AWS and customers",
    explanation: "The AWS Shared Responsibility Model defines which security responsibilities belong to AWS (security of the cloud) and which belong to the customer (security in the cloud).",
    difficultyLevel: "medium",
    points: 2,
    module: "AWS Security"
  },
  {
    id: "q-005",
    certificationId: "aws-cloud-practitioner",
    questionText: "Which AWS service provides scalable compute capacity in the cloud?",
    questionType: "multiple_choice",
    options: [
      "Amazon S3",
      "Amazon RDS",
      "Amazon EC2", 
      "Amazon Route 53"
    ],
    correctAnswer: "Amazon EC2",
    explanation: "Amazon Elastic Compute Cloud (EC2) provides scalable computing capacity in the AWS cloud, allowing you to launch virtual servers as needed.",
    difficultyLevel: "easy",
    points: 1,
    module: "Core AWS Services"
  },
  {
    id: "q-006",
    certificationId: "google-data-analytics",
    questionText: "In data analysis, what is the purpose of data cleaning?",
    questionType: "multiple_choice",
    options: [
      "To make data look prettier",
      "To remove or correct inaccurate, incomplete, or irrelevant data",
      "To reduce file size only",
      "To encrypt sensitive information"
    ],
    correctAnswer: "To remove or correct inaccurate, incomplete, or irrelevant data",
    explanation: "Data cleaning is the process of identifying and correcting errors, inconsistencies, and inaccuracies in datasets to improve data quality for analysis.",
    difficultyLevel: "easy",
    points: 1,
    module: "Data Preparation"
  },
  {
    id: "q-007",
    certificationId: "google-data-analytics",
    questionText: "Which type of chart is best for showing trends over time?",
    questionType: "multiple_choice",
    options: [
      "Pie chart",
      "Bar chart",
      "Line chart",
      "Scatter plot"
    ],
    correctAnswer: "Line chart",
    explanation: "Line charts are ideal for displaying trends and changes over time, as they clearly show the progression of data points connected by a line.",
    difficultyLevel: "easy",
    points: 1,
    module: "Data Visualization"
  },
  {
    id: "q-008",
    certificationId: "freecodecamp-web-development",
    questionText: "What does CSS stand for?",
    questionType: "multiple_choice",
    options: [
      "Computer Style Sheets",
      "Cascading Style Sheets",
      "Creative Style System",
      "Coded Style Standards"
    ],
    correctAnswer: "Cascading Style Sheets",
    explanation: "CSS stands for Cascading Style Sheets, which is used to describe the presentation and styling of HTML documents.",
    difficultyLevel: "easy",
    points: 1,
    module: "CSS Basics"
  }
];

// 🔄 DATABASE INTEGRATION
// Current: Mock quiz attempts for demo
// Replace with: Supabase query to get user's quiz history
export const mockQuizAttempts: QuizAttempt[] = [
  {
    id: "attempt-001",
    userId: "user-123",
    certificationId: "google-cloud-digital-leader",
    totalQuestions: 3,
    correctAnswers: 2,
    scorePercentage: 67,
    timeTakenMinutes: 8,
    answers: {
      "q-001": "Scalability, flexibility, and cost optimization",
      "q-002": "Cloud Storage",
      "q-003": "False"
    },
    startedAt: "2024-02-08T10:00:00Z",
    completedAt: "2024-02-08T10:08:00Z"
  },
  {
    id: "attempt-002",
    userId: "user-123", 
    certificationId: "aws-cloud-practitioner",
    totalQuestions: 2,
    correctAnswers: 2,
    scorePercentage: 100,
    timeTakenMinutes: 5,
    answers: {
      "q-004": "Security responsibilities between AWS and customers",
      "q-005": "Amazon EC2"
    },
    startedAt: "2023-12-15T14:30:00Z",
    completedAt: "2023-12-15T14:35:00Z"
  }
];

export const getQuestionsByCertificationId = (certificationId: string): QuizQuestion[] => {
  return mockQuizQuestions.filter(q => q.certificationId === certificationId);
};

export const getUserAttemptsByCertificationId = (userId: string, certificationId: string): QuizAttempt[] => {
  return mockQuizAttempts.filter(a => a.userId === userId && a.certificationId === certificationId);
};

export const getQuizStats = (userId: string, certificationId: string) => {
  const attempts = getUserAttemptsByCertificationId(userId, certificationId);
  
  if (attempts.length === 0) {
    return {
      totalAttempts: 0,
      bestScore: 0,
      averageScore: 0,
      totalTimeSpent: 0,
      lastAttemptDate: null
    };
  }

  const bestScore = Math.max(...attempts.map(a => a.scorePercentage));
  const averageScore = attempts.reduce((sum, a) => sum + a.scorePercentage, 0) / attempts.length;
  const totalTimeSpent = attempts.reduce((sum, a) => sum + a.timeTakenMinutes, 0);
  const lastAttemptDate = attempts.sort((a, b) => 
    new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  )[0].completedAt;

  return {
    totalAttempts: attempts.length,
    bestScore: Math.round(bestScore),
    averageScore: Math.round(averageScore),
    totalTimeSpent,
    lastAttemptDate
  };
};