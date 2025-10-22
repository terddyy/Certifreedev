import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCategory, deleteCategory, listCategories, updateCategory } from "@/lib/admin";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Navigate } from "react-router-dom";

const Settings = () => {
  const { user, profile, loading } = useAuth();
  const isAdmin = !!(profile?.isAdmin || profile?.isSuperAdmin);
  const isSuperAdmin = !!profile?.isSuperAdmin;
  const { toast } = useToast();
  // Redirect if not admin/super-admin after loading completes
  if (!loading && !isAdmin && !isSuperAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show loading state
  if (loading) {
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

  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", slug: "" });

  const refreshCategories = async () => {
    setLoadingCategories(true);
    const { data, error } = await listCategories();
    if (error) {
      toast({ title: "Failed to load categories", description: error.message, variant: "destructive" });
    } else {
      setCategories((data || []) as any);
    }
    setLoadingCategories(false);
  };

  useEffect(() => {
    if (isAdmin || isSuperAdmin) refreshCategories();
  }, [isAdmin, isSuperAdmin]);

  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (!isSuperAdmin) return;
    (async () => {
      setLoadingUsers(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, is_admin, joined_at")
        .order("joined_at", { ascending: false });
      if (!error) setUsers(data || []);
      setLoadingUsers(false);
    })();
  }, [isSuperAdmin]);

  const toggleAdmin = async (id: string, next: boolean) => {
    const prev = users;
    setUsers((u) => u.map((x) => (x.id === id ? { ...x, is_admin: next } : x)));
    const { error } = await supabase.from("profiles").update({ is_admin: next }).eq("id", id);
    if (error) {
      setUsers(prev);
      toast({ title: "Role update failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Role updated", description: next ? "User granted admin access" : "User revoked admin access" });
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase();
    return !q || u.email?.toLowerCase().includes(q) || (u.full_name || "").toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-[#000814] text-gray-100">
      <Header />
      <main className="container mx-auto px-6 py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Settings</h1>
        <p className="text-lg text-gray-400 max-w-2xl mb-8">
          Manage system configuration and user permissions.
        </p>

        <Tabs defaultValue="categories" className="space-y-8">
          <TabsList className="bg-[#001d3d] border border-[#003566]">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            {isSuperAdmin && <TabsTrigger value="users">User Management</TabsTrigger>}
          </TabsList>

          {/* Categories Management */}
          <TabsContent value="categories">
            <Card className="bg-[#001d3d] border-[#003566]">
              <CardHeader>
                <CardTitle className="text-white">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-gray-300">Name</Label>
                    <Input value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} className="bg-[#000814] border-[#003566] text-white placeholder-gray-500" placeholder="e.g., Computer Studies" />
                  </div>
                  <div>
                    <Label className="text-gray-300">Slug</Label>
                    <Input value={newCategory.slug} onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })} className="bg-[#000814] border-[#003566] text-white placeholder-gray-500" placeholder="computer-studies (any url-safe text)" />
                    <p className="text-xs text-gray-500 mt-1">Slug can be any URL-safe text (lowercase letters, numbers, dashes). It doesn’t need to match the name.</p>
                  </div>
                  <div className="flex items-end">
                    <Button
                      className="bg-[#ffc300] text-[#001d3d] font-bold hover:bg-[#ffd60a]"
                      onClick={async () => {
                        const { error } = await createCategory(newCategory);
                        if (error) {
                          toast({ title: "Create category failed", description: error.message, variant: "destructive" });
                        } else {
                          toast({ title: "Category created" });
                          setNewCategory({ name: "", slug: "" });
                          refreshCategories();
                        }
                      }}
                    >
                      Add Category
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between bg-[#000f24] border border-[#003566] rounded-md px-3 py-2">
                      <span className="text-gray-200">{cat.name}</span>
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          className="border-[#003566] text-white hover:bg-[#003566]"
                          onClick={async () => {
                            const newName = prompt("Rename category", cat.name) || cat.name;
                            const newSlug = prompt("Slug", cat.slug) || cat.slug;
                            const { error } = await updateCategory(cat.id, { name: newName, slug: newSlug });
                            if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
                            else {
                              toast({ title: "Category updated" });
                              refreshCategories();
                            }
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={async () => {
                            if (!confirm(`Delete category "${cat.name}"?`)) return;
                            const { error } = await deleteCategory(cat.id);
                            if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
                            else {
                              toast({ title: "Category deleted" });
                              refreshCategories();
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {isSuperAdmin && (
            <TabsContent value="users">
              <div className="bg-[#001d3d] border border-[#003566] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Users</h2>
                  <Input placeholder="Search users..." className="w-64 bg-[#000814] border-[#003566] text-white" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-gray-400">
                        <th className="text-left py-2 px-3">Name</th>
                        <th className="text-left py-2 px-3">Email</th>
                        <th className="text-left py-2 px-3">Role</th>
                        <th className="text-left py-2 px-3">Created</th>
                        <th className="text-left py-2 px-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingUsers ? (
                        <tr><td className="py-6 px-3 text-gray-400" colSpan={7}>Loading...</td></tr>
                      ) : (
                        filteredUsers.map((u) => (
                          <tr key={u.id} className="border-t border-[#003566]">
                            <td className="py-2 px-3 text-gray-200">{u.full_name || "—"}</td>
                            <td className="py-2 px-3 text-gray-300">{u.email}</td>
                            <td className="py-2 px-3">
                              <span className={`text-xs px-2 py-1 rounded ${u.is_admin ? 'bg-red-900/40 text-red-300' : 'bg-[#003566] text-gray-200'}`}>{u.is_admin ? 'ADMIN' : 'STUDENT'}</span>
                            </td>
                            <td className="py-2 px-3 text-gray-300">{new Date(u.joined_at).toLocaleDateString()}</td>
                            <td className="py-2 px-3 flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">Admin</span>
                                <Switch checked={!!u.is_admin} onCheckedChange={(v) => toggleAdmin(u.id, v)} />
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Settings; 