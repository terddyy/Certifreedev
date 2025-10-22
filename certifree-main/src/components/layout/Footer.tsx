import { BookOpen, Heart, Mail, Facebook, Github, Linkedin, Award, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollNavigation } from "@/hooks/useScrollNavigation";

export const Footer = () => {
  const { navigateToSection } = useScrollNavigation();
  
  const footerSections = [
    {
      title: "Platform",
      links: [
        { label: "All Certifications", href: "/certifications", icon: Award },
        { label: "My Favorites", href: "/favorites", icon: Heart },
        { label: "Dashboard", href: "/dashboard", icon: TrendingUp },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "How It Works", href: "/how-it-works" },
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/groups/1094040635392732", label: "Facebook" },
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Check if it's a hash navigation link
    if (href.startsWith("/#")) {
      e.preventDefault();
      navigateToSection(href);
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-[#000814] via-[#001d3d] to-[#000814] text-gray-300 border-t border-[#ffd60a]/20">
      {/* Decorative top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ffd60a] to-transparent"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Brand Section */}
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#ffd60a] rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-[#003566] to-[#001d3d] border border-[#ffd60a]/30 shadow-lg">
                <BookOpen className="h-7 w-7 text-[#ffd60a]" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white">
                Certi<span className="text-[#ffd60a]">Free</span>
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Your gateway to free IT & business certifications
              </p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4 text-left">
              <h4 className="font-bold text-white text-lg border-b border-[#ffd60a]/20 pb-2">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className="flex items-center gap-2 text-gray-400 hover:text-[#ffd60a] transition-all duration-200 group"
                    >
                      {link.icon && <link.icon className="h-4 w-4 opacity-100 group-hover:text-[#ffd60a] transition-colors" />}
                      <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social & Newsletter */}
          <div className="space-y-4 col-span-2 md:col-span-3 lg:col-span-1">
            <h4 className="font-bold text-white text-lg border-b border-[#ffd60a]/20 pb-2">
              Connect With Us
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                  aria-label={social.label}
                >
                  <div className="absolute inset-0 bg-[#ffd60a] rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-[#003566]/50 border border-[#ffd60a]/20 hover:border-[#ffd60a] hover:bg-[#003566] transition-all">
                    <social.icon className="h-5 w-5 text-gray-400 group-hover:text-[#ffd60a] transition-colors" />
                  </div>
                </a>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Join our community and stay updated with the latest free certifications!
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#ffd60a]/10 gap-4">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} <span className="text-[#ffd60a]">CertiFree</span>. All rights reserved.
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
            <span>for learners worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};