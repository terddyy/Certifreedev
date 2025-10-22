import { supabase } from "@/lib/supabase";

export type UserProgressRow = {
  id: string;
  user_id: string;
  certification_id: string;
  status: string; // planned | in_progress | completed | paused
  started_at: string | null;
  completed_at: string | null;
};

export async function isTaking(userId: string, certificationId: string) {
  const { data, error } = await supabase
    .from("user_progress")
    .select("id, status")
    .eq("user_id", userId)
    .eq("certification_id", certificationId)
    .limit(1);
  if (error) return { data: false, error };
  return { data: (data as Pick<UserProgressRow, 'id' | 'status'>[] || []).some((r) => r.status === "in_progress"), error: null };
}

export async function startTaking(userId: string, certificationId: string) {
  // Upsert a row with status in_progress
  const { data, error } = await supabase
    .from("user_progress")
    .upsert(
      { user_id: userId, certification_id: certificationId, status: "in_progress", started_at: new Date().toISOString() },
      { onConflict: "user_id,certification_id" }
    );
  return { data, error };
}

export async function stopTaking(userId: string, certificationId: string) {
  // Either delete row or set status back to planned; choose delete for simplicity
  const { data, error } = await supabase
    .from("user_progress")
    .delete()
    .eq("user_id", userId)
    .eq("certification_id", certificationId);
  return { data, error };
}

/**
 * Check if a user has completed a certification
 */
export async function isCompleted(userId: string, certificationId: string) {
  const { data, error } = await supabase
    .from("user_progress")
    .select("id, status")
    .eq("user_id", userId)
    .eq("certification_id", certificationId)
    .eq("status", "completed")
    .limit(1);
  
  if (error) return { data: false, error };
  return { data: (data && data.length > 0), error: null };
}

/**
 * Mark a certification as completed
 */
export async function markAsCompleted(userId: string, certificationId: string) {
  const { data, error } = await supabase
    .from("user_progress")
    .upsert(
      {
        user_id: userId,
        certification_id: certificationId,
        status: "completed",
        completed_at: new Date().toISOString(),
        started_at: new Date().toISOString(), // If not already set
      },
      { onConflict: "user_id,certification_id" }
    );
  return { data, error };
}

/**
 * Mark a certification as in progress (uncomplete it)
 */
export async function markAsInProgress(userId: string, certificationId: string) {
  const { data, error } = await supabase
    .from("user_progress")
    .update({
      status: "in_progress",
      completed_at: null,
    })
    .eq("user_id", userId)
    .eq("certification_id", certificationId);
  return { data, error };
}

export async function countTakersFor(certificationIds: string[]) {
  if (certificationIds.length === 0) return {} as Record<string, number>;
  const { data, error } = await supabase
    .from("user_progress")
    .select("certification_id")
    .eq("status", "in_progress")
    .in("certification_id", certificationIds);
  if (error) return {} as Record<string, number>;

  const counts: Record<string, number> = {};
  (data as { certification_id: string }[] || []).forEach((row) => {
    counts[row.certification_id] = (counts[row.certification_id] || 0) + 1;
  });
  return counts;
} 