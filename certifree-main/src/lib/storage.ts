import { supabase } from "@/lib/supabase";

const BUCKET = "cert-assets";

export async function uploadCertificationAsset(file: File, certificationId: string) {
  const timestamp = Date.now();
  const sanitized = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
  const path = `${certificationId}/${timestamp}_${sanitized}`;
  const { data, error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type || undefined,
  });
  if (error) return { url: null as string | null, error };
  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
  return { url: pub.publicUrl as string, error: null };
} 