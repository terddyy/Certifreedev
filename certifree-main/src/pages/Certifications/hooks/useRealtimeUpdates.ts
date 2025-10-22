/**
 * Custom hook for handling realtime Supabase updates
 */

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface UseRealtimeUpdatesProps {
  onInsert?: (payload: any) => void;
  toast: (props: { title: string; description?: string }) => void;
}

export const useRealtimeUpdates = ({ onInsert, toast }: UseRealtimeUpdatesProps) => {
  useEffect(() => {
    const channel = supabase
      .channel("certifications-inserts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "certifications" },
        (payload) => {
          const title = (payload.new as any)?.title || "New certification";
          
          toast({ 
            title: "New certification added", 
            description: title 
          });
          
          if (onInsert) {
            onInsert(payload);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast, onInsert]);
};
