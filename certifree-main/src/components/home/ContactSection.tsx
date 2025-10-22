import { Mail, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ContactSection = () => {
  return (
    <section id="contact" className="scroll-mt-20 bg-[#001d3d] text-white py-12 sm:py-14 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4">Get in touch</h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-8 sm:mb-10 px-4">
            Have questions, feedback, or partnership ideas? We'd love to hear from you.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-10 px-2 sm:px-0">
            <div className="bg-[#000f24] border border-[#003566] rounded-xl p-4 sm:p-5 md:p-6 text-left hover:border-[#ffd60a] transition-all duration-300 hover:transform hover:scale-105">
              <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-[#ffd60a] mb-2 sm:mb-3" />
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 text-white">Email</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-400 break-words">terddy03@gmail.com</p>
            </div>
            <div className="bg-[#000f24] border border-[#003566] rounded-xl p-4 sm:p-5 md:p-6 text-left hover:border-[#ffd60a] transition-all duration-300 hover:transform hover:scale-105">
              <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-[#ffd60a] mb-2 sm:mb-3" />
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 text-white">Community</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-400">Join our FB group to connect with learners.</p>
            </div>
            <div className="bg-[#000f24] border border-[#003566] rounded-xl p-4 sm:p-5 md:p-6 text-left hover:border-[#ffd60a] transition-all duration-300 hover:transform hover:scale-105 sm:col-span-2 md:col-span-1">
              <Send className="h-5 w-5 sm:h-6 sm:w-6 text-[#ffd60a] mb-2 sm:mb-3" />
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 text-white">Feature requests</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-400">Suggest improvements and new certifications.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 px-4 max-w-md sm:max-w-none mx-auto">
            <Button asChild className="bg-[#ffd60a] text-black hover:bg-[#ffc300] font-semibold px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg shadow-lg hover:shadow-[0_0_28px_rgba(255,214,10,0.45)] transform transition-all duration-300 hover:scale-[1.04] w-full sm:w-auto">
              <a href="/contact">Email us</a>
            </Button>
            <Button
              variant="outline"
              asChild
              className="bg-white text-[#001d3d] border-2 border-[#003566] hover:bg-[#003566] hover:text-white px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg transition-all duration-300 w-full sm:w-auto">
              <a href="https://www.facebook.com/groups/1094040635392732" target="_blank" rel="noopener noreferrer">Join community</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}; 