import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Upload } from "lucide-react";
import { Navigate } from "react-router-dom";

const Profile = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    avatarUrl: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        bio: profile.bio || "",
        avatarUrl: profile.avatarUrl || "",
      });
    }
  }, [profile]);

  // Redirect if not authenticated
  if (!authLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#000814] text-gray-100">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <p className="text-gray-400">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName,
          bio: formData.bio,
          avatar_url: formData.avatarUrl,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000814] text-gray-100">
      <Header />
      <main className="container mx-auto px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            My Profile
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            Manage your personal information and preferences.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Picture Section */}
            <Card className="bg-[#001d3d] border-[#003566] md:col-span-1">
              <CardHeader>
                <CardTitle className="text-white text-center">Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={formData.avatarUrl} alt={formData.fullName} />
                  <AvatarFallback className="bg-[#003566] text-[#ffd60a] text-4xl">
                    {formData.fullName?.charAt(0) || user.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="w-full">
                  <Label className="text-gray-300">Avatar URL</Label>
                  <Input
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                    className="bg-[#000814] border-[#003566] text-white placeholder-gray-500"
                    placeholder="https://example.com/avatar.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Paste a URL to an image
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information Section */}
            <Card className="bg-[#001d3d] border-[#003566] md:col-span-2">
              <CardHeader>
                <CardTitle className="text-white">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-gray-300 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    value={user.email || ""}
                    disabled
                    className="bg-[#000f24] border-[#003566] text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <Label className="text-gray-300 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="bg-[#000814] border-[#003566] text-white placeholder-gray-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Bio</Label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="bg-[#000814] border-[#003566] text-white placeholder-gray-500 min-h-[100px]"
                    placeholder="Tell us about yourself..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    A brief description about you and your learning goals
                  </p>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#ffc300] text-[#001d3d] font-bold hover:bg-[#ffd60a]"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Information */}
          <Card className="bg-[#001d3d] border-[#003566] mt-6">
            <CardHeader>
              <CardTitle className="text-white">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Account Type</p>
                  <p className="text-white font-semibold">
                    {profile?.isSuperAdmin ? "Super Admin" : profile?.isAdmin ? "Admin" : "Student"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Member Since</p>
                  <p className="text-white font-semibold">
                    {profile?.joinedAt ? new Date(profile.joinedAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Total Certifications Completed</p>
                  <p className="text-white font-semibold">
                    {profile?.totalCertificationsCompleted || 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Learning Streak</p>
                  <p className="text-white font-semibold">
                    {profile?.learningStreak || 0} days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
