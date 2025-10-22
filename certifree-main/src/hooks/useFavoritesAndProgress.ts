/**
 * useFavoritesAndProgress Hook
 * Manages favorite and taking state with optimistic updates
 */

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  isFavorited,
  isTaking,
  addFavorite,
  removeFavorite,
  startTaking,
  stopTaking,
  countTakersFor,
} from '@/services/certificationService';
import { Certification } from '@/lib/types/certifications';
import { componentDebug } from '@/lib/debugger';

const debug = componentDebug('useFavoritesAndProgress');

export const useFavoritesAndProgress = (certifications: Certification[]) => {
  const { toast } = useToast();
  const { profile } = useAuth();
  
  const [favoriteIds, setFavoriteIds] = useState<Record<string, boolean>>({});
  const [takingIds, setTakingIds] = useState<Record<string, boolean>>({});
  const [takersCount, setTakersCount] = useState<Record<string, number>>({});

  // Load states for all visible certifications
  useEffect(() => {
    if (!certifications.length) return;

    const loadStates = async () => {
      debug.log('Loading favorite and taking states', { count: certifications.length });

      // Load favorite states
      const favoriteEntries = await Promise.all(
        certifications.map(async (cert) => {
          if (!profile?.id) return [cert.id, false] as const;
          const { data } = await isFavorited(profile.id, cert.id);
          return [cert.id, !!data] as const;
        })
      );

      const favoriteMap: Record<string, boolean> = {};
      favoriteEntries.forEach(([id, fav]) => {
        favoriteMap[id] = fav;
      });
      setFavoriteIds(favoriteMap);

      // Load taking states
      const takingEntries = await Promise.all(
        certifications.map(async (cert) => {
          if (!profile?.id) return [cert.id, false] as const;
          const { data } = await isTaking(profile.id, cert.id);
          return [cert.id, !!data] as const;
        })
      );

      const takingMap: Record<string, boolean> = {};
      takingEntries.forEach(([id, taking]) => {
        takingMap[id] = taking;
      });
      setTakingIds(takingMap);

      // Load takers count
      const counts = await countTakersFor(certifications.map((c) => c.id));
      setTakersCount(counts);

      debug.log('States loaded', {
        favorites: Object.keys(favoriteMap).length,
        taking: Object.keys(takingMap).length,
        counts: Object.keys(counts).length,
      });
    };

    loadStates();
  }, [certifications, profile?.id]);

  // Toggle favorite with optimistic update
  const toggleFavorite = async (certId: string) => {
    if (!profile?.id) {
      toast({ title: 'Please sign in to favorite.' });
      return;
    }

    const isFav = !!favoriteIds[certId];
    
    // Optimistic update
    setFavoriteIds((prev) => ({ ...prev, [certId]: !isFav }));
    debug.log('Toggling favorite', { certId, currentState: isFav });

    const { error } = isFav
      ? await removeFavorite(profile.id, certId)
      : await addFavorite(profile.id, certId);

    if (error) {
      // Revert on error
      setFavoriteIds((prev) => ({ ...prev, [certId]: isFav }));
      debug.error('Failed to toggle favorite', { error: error.message });
      toast({
        title: 'Could not update favorites',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      debug.log('Favorite toggled successfully', { certId, newState: !isFav });
    }
  };

  // Toggle taking with optimistic update
  const toggleTaking = async (certId: string) => {
    if (!profile?.id) {
      toast({ title: 'Please sign in to track progress.' });
      return;
    }

    const taking = !!takingIds[certId];
    
    // Optimistic updates
    setTakingIds((prev) => ({ ...prev, [certId]: !taking }));
    setTakersCount((prev) => ({
      ...prev,
      [certId]: Math.max(0, (prev[certId] || 0) + (taking ? -1 : 1)),
    }));
    debug.log('Toggling taking', { certId, currentState: taking });

    const { error } = taking
      ? await stopTaking(profile.id, certId)
      : await startTaking(profile.id, certId);

    if (error) {
      // Revert on error
      setTakingIds((prev) => ({ ...prev, [certId]: taking }));
      setTakersCount((prev) => ({
        ...prev,
        [certId]: Math.max(0, (prev[certId] || 0) + (taking ? 1 : -1)),
      }));
      debug.error('Failed to toggle taking', { error: error.message });
      toast({
        title: 'Could not update status',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      debug.log('Taking toggled successfully', { certId, newState: !taking });
    }
  };

  return {
    favoriteIds,
    takingIds,
    takersCount,
    toggleFavorite,
    toggleTaking,
  };
};
