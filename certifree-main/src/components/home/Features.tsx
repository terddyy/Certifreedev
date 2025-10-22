import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Clock, 
  Award, 
  BookOpen, 
  Users, 
  TrendingUp,
  Search,
  Star,
  CheckCircle
} from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "100% Free & Verified",
      description: "All certifications are completely free from verified providers",
      badge: "Verified",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Search,
      title: "Smart Discovery",
      description: "Find certifications tailored to your career goals and interests",
      badge: "AI-Powered",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      icon: TrendingUp,
      title: "Career Impact",
      description: "Track how each certification boosts your career potential",
      badge: "Analytics",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      icon: Clock,
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed progress insights",
      badge: "Real-time",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Learn from reviews and experiences of fellow learners",
      badge: "10K+ Users",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      icon: Award,
      title: "Skill Validation",
      description: "Earn recognized credentials that matter to employers",
      badge: "Industry Recognized",
      color: "text-accent",
      bgColor: "bg-accent/10"
    }
  ];

  const categories = [
    { name: "Cloud Computing", count: "120+", icon: "☁️" },
    { name: "Cybersecurity", count: "85+", icon: "🔒" },
    { name: "Data Science", count: "95+", icon: "📊" },
    { name: "DevOps", count: "70+", icon: "⚙️" },
    { name: "Business", count: "60+", icon: "💼" },
    { name: "Software Dev", count: "90+", icon: "💻" }
  ];

  
  ;
};