import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Navigate } from "react-router-dom";

interface LogEntry {
  id: string;
  created_at: string;
  user_id: string | null;
  action: string;
  details: string | null;
}

const AdminLogs = () => {
  const { profile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not super-admin after loading completes
  if (!authLoading && !profile?.isSuperAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    if (!profile?.isSuperAdmin) return;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("app_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) {
        toast({ title: "Failed to load logs", description: error.message, variant: "destructive" });
      } else {
        setLogs((data || []) as any);
      }
      setLoading(false);
    })();
  }, [profile?.isAdmin, profile?.isSuperAdmin]);

  if (!profile?.isAdmin && !profile?.isSuperAdmin) {
    return (
      <div className="min-h-screen bg-[#000814] text-gray-100">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <p>You must be an admin to view logs.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000814] text-gray-100">
      <Header />
      <main className="container mx-auto px-6 py-12 md:py-16">
        <Card className="bg-[#001d3d] border-[#003566]">
          <CardHeader>
            <CardTitle className="text-white">Website Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-300">Loading logs...</p>
            ) : logs.length === 0 ? (
              <p className="text-gray-300">No logs yet.</p>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start justify-between border border-[#003566] rounded-md p-3 bg-[#000f24]">
                    <div>
                      <p className="text-white font-medium">{log.action}</p>
                      {log.details && <p className="text-sm text-gray-400">{log.details}</p>}
                    </div>
                    <div className="text-xs text-gray-400">{new Date(log.created_at).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLogs; 