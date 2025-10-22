import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ParticleBackground from "./ParticleBackground";
import { useGlobalStats } from "@/hooks/useGlobalStats";

export const Hero = () => {
  const { stats: globalStats, loading: statsLoading, error: statsError } = useGlobalStats();

  // Log stats for debugging
  const stats = [
    { 
      label: "Users", 
      value: statsLoading ? "..." : `${globalStats?.totalUsers || 0}+` 
    },
    { 
      label: "Certifications", 
      value: statsLoading ? "..." : `${globalStats?.totalCertifications || 0}+` 
    },
    { 
      label: "Certifications Completed", 
      value: statsLoading ? "..." : `${globalStats?.totalCertificationsCompleted || 0}+` 
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#000814] text-white min-h-[calc(100dvh-64px)] flex items-center justify-center py-16 sm:py-20 md:py-24">
      <ParticleBackground />
      <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: `radial-gradient(ellipse at top left, #001d3d 0%, transparent 50%), radial-gradient(ellipse at bottom right, #003566 0%, transparent 50%)` }}></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 w-full">
        <div className="max-w-5xl mx-auto text-center space-y-5 sm:space-y-6 md:space-y-8">
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
            <Badge variant="outline" className="bg-[#ffc300]/10 border-[#ffc300]/30 text-[#ffd60a] px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base font-semibold rounded-full shadow-md backdrop-blur-sm">
               Level Up: Fresh Certifications Added Weekly
            </Badge>
          </motion.div>

          <motion.h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.15] sm:leading-tight tracking-tight px-2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}>
            Forge Your Future,
            <br className="hidden sm:block" />
            <span className="text-[#ffd60a]"> Certification by Certification.</span>
          </motion.h1>

          <motion.p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut", delay: 0.12 }}>
            Unlock a world of free, industry-recognized IT and business certifications.
            Gain the edge you need to accelerate your career, without the cost.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 px-4 max-w-md sm:max-w-none mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <Button className="bg-[#ffd60a] hover:bg-[#ffc300] text-black font-bold py-3 sm:py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg shadow-lg transition-all duration-300 w-full sm:w-auto" asChild>
              <Link to="/certifications">
                Start Your Journey <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
            <Button variant="outline" className="border-2 border-[#003566] text-white bg-[#001d3d] font-semibold py-3 sm:py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg shadow-lg hover:bg-[#003566] hover:border-[#003566] transition-all duration-300 w-full sm:w-auto" asChild>
              <Link to="/how-it-works">How does it work?</Link>
            </Button>
          </motion.div>

          <motion.div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 max-w-4xl mx-auto pt-2 sm:pt-4 md:pt-6 px-2 sm:px-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}>
            {stats.map((s, idx) => (
              <motion.div key={s.label} className="bg-[#001d3d] p-2.5 sm:p-3 md:p-4 lg:p-6 rounded-lg sm:rounded-xl shadow-xl border border-[#003566]" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 + idx * 0.08 }}>
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold text-[#ffd60a]">{s.value}</div>
                <div className="text-[0.5rem] sm:text-[0.6rem] md:text-[0.65rem] lg:text-xs uppercase tracking-wide text-gray-400 mt-0.5 sm:mt-1 leading-tight">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
