import React from "react";
import { Globe, Lightbulb, GraduationCap } from "lucide-react";

export const AboutSection = () => {
  return (
    <section id="about" className="scroll-mt-20 bg-[#001d3d] text-white py-12 sm:py-14 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 sm:mb-4 md:mb-6 leading-tight px-2">
            Our Mission: Empowering Futures, <br className="hidden sm:block" /> One Certification at a Time.
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 leading-relaxed px-4">
            At CertiFree, we believe that access to quality education and career advancement opportunities should be universal. We are dedicated to breaking down financial barriers, providing a curated platform for free, recognized IT and business certifications.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 px-4 sm:px-6">
            {/* Value Proposition 1 */}
            <div className="space-y-3 sm:space-y-4 md:space-y-6 flex flex-col items-center bg-[#000814]/40 p-5 sm:p-6 md:p-8 rounded-xl border border-[#003566]/50 hover:border-[#ffd60a]/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="p-3 sm:p-4 md:p-5 rounded-full bg-[#003566] text-[#ffd60a] shadow-lg">
                <Lightbulb className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Innovation & Accessibility</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-400 leading-relaxed max-w-sm">
                We constantly scout for the latest and most relevant free certifications, ensuring you stay ahead in a rapidly evolving job market. Education should be free and accessible to all.
              </p>
            </div>

            {/* Value Proposition 2 */}
            <div className="space-y-3 sm:space-y-4 md:space-y-6 flex flex-col items-center bg-[#000814]/40 p-5 sm:p-6 md:p-8 rounded-xl border border-[#003566]/50 hover:border-[#ffd60a]/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="p-3 sm:p-4 md:p-5 rounded-full bg-[#003566] text-[#ffd60a] shadow-lg">
                <GraduationCap className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Quality & Recognition</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-400 leading-relaxed max-w-sm">
                Every certification featured on CertiFree is from reputable organizations, offering genuine value and industry recognition to boost your professional profile.
              </p>
            </div>

            {/* Value Proposition 3 */}
            <div className="space-y-3 sm:space-y-4 md:space-y-6 flex flex-col items-center bg-[#000814]/40 p-5 sm:p-6 md:p-8 rounded-xl border border-[#003566]/50 hover:border-[#ffd60a]/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="p-3 sm:p-4 md:p-5 rounded-full bg-[#003566] text-[#ffd60a] shadow-lg">
                <Globe className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Community & Growth</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-400 leading-relaxed max-w-sm">
                Join a thriving community of learners. Share insights, collaborate on study materials, and grow together as you navigate your certification journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 