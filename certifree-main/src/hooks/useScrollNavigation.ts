/**
 * Custom hook for smooth scroll navigation
 * Handles both same-page and cross-page hash navigation
 */

import { useNavigate, useLocation } from "react-router-dom";
import { useCallback } from "react";

export const useScrollNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Small delay to ensure page is rendered
      requestAnimationFrame(() => {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  const navigateToSection = useCallback(
    (href: string) => {
      // Check if it's a hash link (e.g., /#about, /#contact)
      if (href.startsWith("/#")) {
        const sectionId = href.substring(2); // Remove "/#"
        
        // If we're already on the home page
        if (location.pathname === "/") {
          scrollToSection(sectionId);
        } else {
          // Navigate to home page with hash
          navigate("/", { replace: false });
          
          // Wait for navigation to complete, then scroll
          setTimeout(() => {
            scrollToSection(sectionId);
          }, 100);
        }
      } else {
        // Normal navigation
        navigate(href);
      }
    },
    [location.pathname, navigate, scrollToSection]
  );

  return { navigateToSection, scrollToSection };
};
