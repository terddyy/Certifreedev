// 🔄 DATABASE INTEGRATION POINT
// Current: Mock user data for frontend development
// Replace with: Supabase Auth - const { data: { user } } = await supabase.auth.getUser()
// Table: profiles (extends auth.users)
// Dependencies: @supabase/supabase-js

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  subscriptionTier: "free" | "premium";
  learningStreak: number;
  totalCertificationsCompleted: number;
  joinedAt: string;
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    newsletter: boolean;
    learningReminders: boolean;
  };
  stats: {
    hoursLearned: number;
    averageScore: number;
    skillsLearned: string[];
    currentGoal: string;
  };
}

export interface UserProgress {
  certificationId: string;
  status: "planned" | "in_progress" | "completed" | "paused";
  progressPercentage: number;
  timeSpentMinutes: number;
  startedAt: string;
  completedAt?: string;
  lastActivityAt: string;
  notes: string;
}

export interface UserAchievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt: string;
  category: "learning" | "milestone" | "streak" | "social";
}

// 🔄 DATABASE INTEGRATION
// Current: Hardcoded mock user for demo
// Replace with: Supabase Auth user and profile data
export const mockCurrentUser: UserProfile = {
  id: "user-123",
  email: "alex.johnson@example.com",
  fullName: "Alex Johnson",
  avatarUrl: "/api/placeholder/150/150",
  bio: "Passionate about cloud computing and data science. Currently transitioning into a tech career.",
  subscriptionTier: "free",
  learningStreak: 15,
  totalCertificationsCompleted: 3,
  joinedAt: "2023-09-15",
  preferences: {
    emailNotifications: true,
    pushNotifications: true,
    newsletter: true,
    learningReminders: true
  },
  stats: {
    hoursLearned: 287,
    averageScore: 89,
    skillsLearned: ["AWS", "Python", "SQL", "Tableau", "Project Management"],
    currentGoal: "Complete Google Cloud Professional Certificate"
  }
};

// 🔄 DATABASE INTEGRATION
// Current: Mock progress data
// Replace with: Supabase query - supabase.from('user_certifications').select('*').eq('user_id', userId)
export const mockUserProgress: UserProgress[] = [
  {
    certificationId: "google-cloud-digital-leader",
    status: "in_progress",
    progressPercentage: 65,
    timeSpentMinutes: 1440, // 24 hours
    startedAt: "2024-01-10",
    lastActivityAt: "2024-02-08",
    notes: "Great content, really enjoying the hands-on labs"
  },
  {
    certificationId: "aws-cloud-practitioner",
    status: "completed",
    progressPercentage: 100,
    timeSpentMinutes: 2100, // 35 hours
    startedAt: "2023-11-15",
    completedAt: "2023-12-20",
    lastActivityAt: "2023-12-20",
    notes: "Excellent foundation course, passed the exam with 85%"
  },
  {
    certificationId: "google-data-analytics",
    status: "completed",
    progressPercentage: 100,
    timeSpentMinutes: 10800, // 180 hours
    startedAt: "2023-08-01",
    completedAt: "2023-11-10",
    lastActivityAt: "2023-11-10",
    notes: "Amazing course! Really prepared me for my current data analyst role"
  },
  {
    certificationId: "microsoft-az-900",
    status: "planned",
    progressPercentage: 0,
    timeSpentMinutes: 0,
    startedAt: "",
    lastActivityAt: "",
    notes: "Planning to start after completing Google Cloud certification"
  }
];

// 🔄 DATABASE INTEGRATION
// Current: Mock achievements
// Replace with: Supabase query - supabase.from('user_achievements').select('*').eq('user_id', userId)
export const mockUserAchievements: UserAchievement[] = [
  {
    id: "first-certification",
    title: "First Steps",
    description: "Completed your first certification",
    iconName: "award",
    unlockedAt: "2023-11-10",
    category: "milestone"
  },
  {
    id: "week-streak",
    title: "Consistent Learner",
    description: "Maintained a 7-day learning streak",
    iconName: "fire",
    unlockedAt: "2024-01-25",
    category: "streak"
  },
  {
    id: "hundred-hours",
    title: "Dedicated Student",
    description: "Logged 100+ hours of learning",
    iconName: "clock",
    unlockedAt: "2024-01-30",
    category: "learning"
  },
  {
    id: "three-certifications",
    title: "Certificate Collector",
    description: "Completed 3 certifications",
    iconName: "star",
    unlockedAt: "2023-12-20",
    category: "milestone"
  }
];

export const mockRecentActivity = [
  {
    id: "1",
    type: "certification_completed",
    title: "Completed AWS Cloud Practitioner",
    description: "Finished with a score of 85%",
    timestamp: "2023-12-20T14:30:00Z",
    icon: "award"
  },
  {
    id: "2", 
    type: "quiz_passed",
    title: "Passed Module 3 Quiz",
    description: "Google Cloud Digital Leader - Scored 92%",
    timestamp: "2024-02-08T10:15:00Z",
    icon: "checkCircle"
  },
  {
    id: "3",
    type: "streak_milestone",
    title: "15-Day Learning Streak!",
    description: "Keep up the great work",
    timestamp: "2024-02-08T09:00:00Z",
    icon: "fire"
  },
  {
    id: "4",
    type: "certification_started",
    title: "Started Google Cloud Digital Leader",
    description: "Beginning your cloud journey",
    timestamp: "2024-01-10T16:45:00Z",
    icon: "play"
  }
];