import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, Bell, LogOut, Settings, LayoutDashboard, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useScrollNavigation } from "@/hooks/useScrollNavigation";

interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const { navigateToSection } = useScrollNavigation();

  const navPrimary = [
    { label: "Certifications", href: "/certifications" },
    ...(user ? [{ label: "Dashboard", href: "/dashboard" } as const] : []),
    ...(user ? [{ label: "Favorites", href: "/favorites" } as const] : []),
    { label: "About", href: "/about" } as const,
    { label: "Contact", href: "/contact" } as const,
  ];
  const navSecondary = [
    { label: "About", href: "/about" } as const,
    { label: "Contact", href: "/contact" } as const,
  ];

  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsSearchOpen(false);
      setSearchQuery("");
      toast({
        title: "Search",
        description: `Searching for: "${searchQuery}"`,
      });
    }
  };

  const handleNotificationClick = () => {
    toast({ title: "Notifications", description: "You have no new notifications." });
  };

  const handleSignInClick = () => {
    navigate("/auth");
  };

  const handleLogout = async () => {
    if (!user) {
      toast({ title: "Logout Failed", description: "No active session to log out from.", variant: "destructive" });
      navigate("/auth");
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Logout Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      navigate("/auth");
    }
  };

  const canSeeSettings = !!(profile?.isAdmin || profile?.isSuperAdmin);

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Check if it's a hash navigation link
    if (href.startsWith("/#")) {
      e.preventDefault(); // Prevent default Link behavior
      navigateToSection(href);
      setIsMenuOpen(false); // Close mobile menu if open
    }
    // For regular links, let the Link component handle it normally
  };

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b border-[#001d3d] bg-[#000814]/90 backdrop-blur-lg shadow-md", className)} style={{marginTop: 0}}>
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <img src="/images/certifreelogovector.png" alt="CertiFree" className="w-10 h-10 rounded-md shadow-lg object-contain bg-transparent" />
          <div className="flex flex-col leading-none">
            <span className="text-xl font-bold text-white">Certi<span className="text-[#ffd60a]">Free</span></span>
            <span className="text-xs text-gray-400 hidden sm:block">Free IT Certifications</span>
          </div>
        </Link>

        {/* Desktop Navigation (show all) */}
        <nav className="hidden md:flex items-center space-x-6">
          {navPrimary.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-sm font-semibold text-gray-300 hover:text-[#ffd60a] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-2">
          {isSearchOpen && (
            <Input
              type="text"
              placeholder="Search certifications..."
              className="w-48 bg-[#001d3d] border-[#003566] text-white placeholder-gray-500 focus:border-[#ffc300] focus:ring-[#ffc300]"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchSubmit}
              onBlur={() => setIsSearchOpen(false)}
              autoFocus
            />
          )}
          <Button size="icon" variant="ghost" className="text-gray-300 hover:text-[#ffd60a] hover:bg-[#001d3d]" onClick={handleSearchClick}>
            <Search className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" className="relative text-gray-300 hover:text-[#ffd60a] hover:bg-[#001d3d]" onClick={handleNotificationClick}>
            <Bell className="h-5 w-5" />
            <div className="absolute top-0 right-0 h-2.5 w-2.5 bg-[#ffd60a] rounded-full animate-pulse"></div>
          </Button>

          {user ? (
            <>
              <div className="px-2 py-1 rounded-full text-xs font-semibold tracking-wide mr-1"
                   style={{ backgroundColor: '#001d3d', border: '1px solid #003566', color: '#ffd60a' }}>
                {profile?.isSuperAdmin ? 'super-admin' : profile?.isAdmin ? 'admin' : 'student'}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="relative rounded-full w-9 h-9 border border-[#003566]">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={profile?.avatarUrl} alt={profile?.fullName || "User"} />
                      <AvatarFallback className="bg-[#003566] text-[#ffd60a]">{profile?.fullName?.charAt(0) || user.email?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-[#001d3d] border-[#003566] text-gray-200" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal text-gray-100">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profile?.fullName || user.email}</p>
                      <p className="text-xs leading-none text-gray-400">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#003566]" />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")} className="focus:bg-[#003566] focus:text-[#ffd60a]">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")} className="focus:bg-[#003566] focus:text-[#ffd60a]">
                    <UserCircle className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  {canSeeSettings && (
                    <DropdownMenuItem onClick={handleSettingsClick} className="focus:bg-[#003566] focus:text-[#ffd60a]">
                      <Settings className="mr-2 h-4 w-4" /> Admin Settings
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-[#003566]" />
                  <DropdownMenuItem onClick={handleLogout} className="focus:bg-[#003566] focus:text-[#ffd60a]">
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button className="bg-[#ffc300] text-[#001d3d] font-bold px-5 py-2 rounded-full shadow-md hover:bg-[#ffd60a]" onClick={handleSignInClick}>Sign In</Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-[#ffd60a] hover:bg-[#001d3d]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-[#001d3d] bg-[#000814]/95 backdrop-blur-lg">
          <div className="container mx-auto px-6 py-4 space-y-3">
            {navPrimary.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="block text-base font-medium text-gray-200 hover:text-[#ffd60a] py-2"
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <Button className="text-gray-300 hover:text-[#ffd60a] w-full" variant="ghost" onClick={() => { setIsMenuOpen(false); navigate("/profile"); }}>
                <UserCircle className="mr-2 h-4 w-4" /> Profile
              </Button>
            )}
            {canSeeSettings && (
              <Button className="text-gray-300 hover:text-[#ffd60a] w-full" variant="ghost" onClick={() => { setIsMenuOpen(false); handleSettingsClick(); }}>
                <Settings className="mr-2 h-4 w-4" /> Admin Settings
              </Button>
            )}
            <div className="flex flex-col space-y-3 pt-4 border-t border-[#001d3d]">{user ? (
              <Button className="bg-[#ffc300] text-[#001d3d] font-bold px-5 py-2 rounded-full shadow-md hover:bg-[#ffd60a] w-full" onClick={handleLogout}>Log out</Button>
            ) : (
              <Button className="bg-[#ffc300] text-[#001d3d] font-bold px-5 py-2 rounded-full shadow-md hover:bg-[#ffd60a] w-full" onClick={handleSignInClick}>Sign In</Button>
            )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};