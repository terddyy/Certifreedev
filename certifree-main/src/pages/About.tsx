import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users,
  Award,
  BookOpen,
  Shield,
  Globe,
  Heart,
  Target,
  Lightbulb,
  ArrowRight,
  Linkedin,
  Twitter,
  Github,
  Sparkles,
  TrendingUp,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { useGlobalStats } from "@/hooks/useGlobalStats";
import { motion } from "framer-motion";

const About = () => {
  const { stats, loading, error } = useGlobalStats();

  // Animation variants for stagger effects
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  const values = [
    {
      icon: Heart,
      title: "Accessible Education",
      description: "Quality education should be free and accessible to everyone, regardless of background or financial situation.",
      gradient: "from-red-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Every certification is carefully vetted to ensure it meets industry standards and provides real value.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Building a worldwide community of learners who support and inspire each other's professional growth.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Lightbulb,
      title: "Innovation Focus",
      description: "Continuously improving our platform with cutting-edge features to enhance the learning experience.",
      gradient: "from-yellow-500 to-orange-500"
    }
  ];

  const team = [
    {
      name: "Terd Inocentes",
      role: "CEO & Founder",
      bio: "IBM Full Stack Software Developer | Oracle Gen AI Professional | AWS Cloud Consultant | Google Cloud Innovator",
      image: "/images/pfp/terd.jpg",
      linkedin: "#",
      twitter: "#",
      github: "#",
      profileUrl: "https://terd.zentariph.com"
    },
    {
      name: "Gayle Florencio",
      role: "Co-Founder & Lead Designer",
      bio: "Frontend Developer & UI/UX Designer passionate about creating intuitive and beautiful user experiences.",
      image: "/images/pfp/gayle.jpg",
      linkedin: "#",
      twitter: "#",
      github: "#",
      profileUrl: "https://www.facebook.com/gaylemnq"
    },
    {
      name: "Jerry Yan Ken La Torre",
      role: "Operations Manager",
      bio: "Documentary Specialist & Researcher ensuring quality and accuracy across the platform.",
      image: "/images/pfp/azy.jpg",
      linkedin: "#",
      twitter: "#",
      github: "#",
      profileUrl: "https://www.facebook.com/azylatorre0198"
    }
  ];

  const milestones = [
    {
      year: "2025",
      quarter: "Q1",
      title: "Platform Launch",
      description: "CertiFree launched with a mission to democratize access to quality certifications worldwide.",
      icon: Sparkles,
      color: "text-[#ffd60a]"
    },
    {
      year: "2025",
      quarter: "Q2",
      title: "Growing Community",
      description: "Rapidly expanding our catalog and building a thriving community of learners.",
      icon: TrendingUp,
      color: "text-[#003566]"
    },
    {
      year: "2025",
      quarter: "Q3+",
      title: "Future Vision",
      description: "Expanding to include AI-powered learning paths, mentorship programs, and enterprise solutions.",
      icon: Target,
      color: "text-[#ffc300]"
    }
  ];

  return (
    <div className="min-h-screen bg-[#000814]">
      <Header />
      
      <main>
          {/* Team Section */}
        <section className="py-20 bg-[#000814]">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Meet the Team
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Passionate students dedicated to democratizing education
              </p>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            >
              {team.map((member, index) => (
                <motion.div key={member.name} variants={itemVariants}>
                  <Card className="bg-[#001d3d] border-[#003566] hover:border-[#ffd60a] transition-all duration-300 text-center group h-full">
                    <CardContent className="p-8">
                      {member.profileUrl && member.profileUrl !== '#' ? (
                        <a href={member.profileUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${member.name}'s profile`}>
                          <Avatar className="h-28 w-28 mx-auto mb-6 ring-4 ring-[#003566] group-hover:ring-[#ffd60a] transition-all duration-300">
                            <AvatarImage src={member.image} alt={member.name} />
                            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-[#003566] to-[#001d3d] text-white">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        </a>
                      ) : (
                        <Avatar className="h-28 w-28 mx-auto mb-6 ring-4 ring-[#003566] group-hover:ring-[#ffd60a] transition-all duration-300">
                          <AvatarImage src={member.image} alt={member.name} />
                          <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-[#003566] to-[#001d3d] text-white">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      {member.profileUrl && member.profileUrl !== '#' ? (
                        <h3 className="text-xl font-bold text-white mb-2">
                          <a href={member.profileUrl} target="_blank" rel="noopener noreferrer" className="hover:underline" aria-label={`Open ${member.name}'s profile`}>
                            {member.name}
                          </a>
                        </h3>
                      ) : (
                        <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                      )}
                      <p className="text-[#ffd60a] font-semibold text-sm mb-4 uppercase tracking-wide">{member.role}</p>
                      <p className="text-gray-400 text-sm leading-relaxed mb-6">
                        {member.bio}
                      </p>
                      
                      <div className="flex justify-center gap-3">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="hover:bg-[#003566] hover:text-[#ffd60a] transition-colors" 
                          asChild
                        >
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s LinkedIn`}>
                            <Linkedin className="h-5 w-5" />
                          </a>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="hover:bg-[#003566] hover:text-[#ffd60a] transition-colors" 
                          asChild
                        >
                          <a href={member.twitter} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s Twitter`}>
                            <Twitter className="h-5 w-5" />
                          </a>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="hover:bg-[#003566] hover:text-[#ffd60a] transition-colors" 
                          asChild
                        >
                          <a href={member.github} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s GitHub`}>
                            <Github className="h-5 w-5" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#000814] via-[#001d3d] to-[#003566] text-white py-20 md:py-28">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#ffd60a] rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#003566] rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <Badge variant="outline" className="mb-6 bg-[#ffd60a]/10 border-[#ffd60a]/30 text-[#ffd60a] px-6 py-2 text-sm font-semibold">
                About CertiFree
              </Badge>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                Empowering Careers Through
                <span className="block text-[#ffd60a]">Free Education</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
                We're on a mission to make quality certifications accessible to everyone, 
                breaking down barriers and opening doors to new opportunities.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-[#001d3d] border-y border-[#003566]">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#ffd60a] border-r-transparent"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-400">
                <p>Unable to load statistics</p>
              </div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
              >
                <motion.div variants={itemVariants}>
                  <Card className="bg-[#000814] border-[#003566] text-center hover:border-[#ffd60a] transition-all duration-300 group">
                    <CardContent className="p-8">
                      <Users className="h-12 w-12 text-[#ffd60a] mb-4 mx-auto group-hover:scale-110 transition-transform duration-300" />
                      <p className="text-5xl font-extrabold text-white mb-2">{stats.totalUsers.toLocaleString()}+</p>
                      <h3 className="text-lg font-semibold text-gray-400 uppercase tracking-wide">Active Learners</h3>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card className="bg-[#000814] border-[#003566] text-center hover:border-[#ffd60a] transition-all duration-300 group">
                    <CardContent className="p-8">
                      <BookOpen className="h-12 w-12 text-[#ffd60a] mb-4 mx-auto group-hover:scale-110 transition-transform duration-300" />
                      <p className="text-5xl font-extrabold text-white mb-2">{stats.totalCertifications.toLocaleString()}+</p>
                      <h3 className="text-lg font-semibold text-gray-400 uppercase tracking-wide">Certifications</h3>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card className="bg-[#000814] border-[#003566] text-center hover:border-[#ffd60a] transition-all duration-300 group">
                    <CardContent className="p-8">
                      <Award className="h-12 w-12 text-[#ffd60a] mb-4 mx-auto group-hover:scale-110 transition-transform duration-300" />
                      <p className="text-5xl font-extrabold text-white mb-2">{stats.totalCertificationsCompleted.toLocaleString()}+</p>
                      <h3 className="text-lg font-semibold text-gray-400 uppercase tracking-wide">Completed</h3>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Mission & Values Section */}
        <section className="py-20 bg-[#000814]">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Our Core Values
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                The principles that guide everything we do
              </p>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
            >
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div key={value.title} variants={itemVariants}>
                    <Card className="bg-[#001d3d] border-[#003566] hover:border-[#ffd60a] transition-all duration-300 group h-full">
                      <CardContent className="p-8">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                        <p className="text-gray-400 leading-relaxed">{value.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Journey/Timeline Section */}
        <section className="py-20 bg-[#001d3d]">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Our Journey
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                From vision to reality, here's how we're building the future of free education
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-8"
              >
                {milestones.map((milestone, index) => {
                  const Icon = milestone.icon;
                  return (
                    <motion.div 
                      key={`${milestone.year}-${milestone.quarter}`}
                      variants={itemVariants}
                      className="flex items-start gap-6 group"
                    >
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-2xl bg-[#000814] border-2 border-[#003566] flex items-center justify-center group-hover:border-[#ffd60a] transition-colors duration-300">
                            <Icon className={`h-8 w-8 ${milestone.color}`} />
                          </div>
                          {index < milestones.length - 1 && (
                            <div className="absolute left-10 top-20 w-0.5 h-16 bg-[#003566]"></div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1 pb-8">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className="bg-[#ffd60a] text-black font-semibold">
                            {milestone.year} {milestone.quarter}
                          </Badge>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">{milestone.title}</h3>
                        <p className="text-gray-400 leading-relaxed text-lg">{milestone.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </section>

      

        {/* CTA Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#003566] via-[#001d3d] to-[#000814] text-white py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#ffd60a] rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#ffd60a] rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <Zap className="h-16 w-16 text-[#ffd60a] mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                Ready to Transform Your Career?
              </h2>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
                Join thousands of learners advancing their careers with free, 
                industry-recognized certifications from the world's top providers.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-[#ffd60a] hover:bg-[#ffc300] text-black font-bold py-6 px-10 rounded-full text-lg shadow-lg transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <Link to="/certifications">
                    Explore Certifications
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-white text-white hover:bg-white hover:text-[#003566] font-semibold py-6 px-10 rounded-full text-lg transition-all duration-300"
                  asChild
                >
                  <Link to="/contact">
                    Get in Touch
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;