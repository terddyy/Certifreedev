import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { UserProgress, UserAchievement } from '@/lib/mock-data/users';
import { componentDebug, startTimer, endTimer } from '@/lib/debugger';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  bio?: string;
  subscriptionTier: "free" | "premium";
  learningStreak: number;
  totalCertificationsCompleted: number;
  joinedAt: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    newsletter: boolean;
    learningReminders: boolean;
  };
  stats: {
    hoursLearned: number;
    averageScore: number;
    skillsLearned: string[];
    currentGoal: string;
  };
  userProgress: { // Updated type for userProgress
    id: string;
    user_id: string;
    course_id: string; // Changed from certification_id
    status: string; 
    enrolled_at: string | null; // Changed from started_at
    progress_percentage: number; // Added
  }[];
  userAchievements: UserAchievement[];
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const debug = componentDebug('useAuth');
  
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  });

  const profileChannelRef = useRef<any | null>(null);

  const isFetchingSession = useRef(false); // Moved useRef outside useEffect

  const subscribeToProfileUpdates = (userId: string) => {
    try {
      if (profileChannelRef.current) {
        supabase.removeChannel(profileChannelRef.current);
        profileChannelRef.current = null;
      }
      const channel = supabase
        .channel(`profiles-changes-${userId}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` }, (payload) => {
          const updated: any = payload.new;
          setAuthState((prev) => {
            if (!prev.user) return prev;
            const mergedProfile: UserProfile = {
              id: updated?.id || prev.profile?.id || userId,
              email: updated?.email || prev.profile?.email || '',
              fullName: updated?.full_name || updated?.fullName || prev.profile?.fullName || 'User',
              avatarUrl: updated?.avatar_url || updated?.avatarUrl || prev.profile?.avatarUrl || '',
              bio: updated?.bio ?? prev.profile?.bio ?? '',
              subscriptionTier: updated?.subscription_tier || updated?.subscriptionTier || prev.profile?.subscriptionTier || 'free',
              learningStreak: updated?.learning_streak || updated?.learningStreak || prev.profile?.learningStreak || 0,
              totalCertificationsCompleted: updated?.total_certifications_completed || updated?.totalCertificationsCompleted || prev.profile?.totalCertificationsCompleted || 0,
              joinedAt: updated?.joined_at || prev.profile?.joinedAt || new Date().toISOString(),
              isAdmin: (updated?.is_admin ?? prev.profile?.isAdmin ?? false) as boolean,
              isSuperAdmin: (updated?.is_super_admin ?? prev.profile?.isSuperAdmin ?? false) as boolean,
              preferences: {
                emailNotifications: updated?.preferences?.emailNotifications ?? prev.profile?.preferences.emailNotifications ?? true,
                pushNotifications: updated?.preferences?.pushNotifications ?? prev.profile?.preferences.pushNotifications ?? true,
                newsletter: updated?.preferences?.newsletter ?? prev.profile?.preferences.newsletter ?? false,
                learningReminders: updated?.preferences?.learningReminders ?? prev.profile?.preferences.learningReminders ?? true,
              },
              stats: {
                hoursLearned: updated?.stats?.hoursLearned || updated?.stats?.hours_learned || prev.profile?.stats.hoursLearned || 0,
                averageScore: updated?.stats?.averageScore || updated?.stats?.average_score || prev.profile?.stats.averageScore || 0,
                skillsLearned: updated?.stats?.skillsLearned || updated?.stats?.skills_learned || prev.profile?.stats.skillsLearned || [],
                currentGoal: updated?.stats?.currentGoal || updated?.stats?.current_goal || prev.profile?.stats.currentGoal || 'Complete your first certification',
              },
              userProgress: prev.profile?.userProgress || [],
              userAchievements: prev.profile?.userAchievements || [],
            };
            debug.log('Profile updated via realtime', { isAdmin: mergedProfile.isAdmin, isSuperAdmin: mergedProfile.isSuperAdmin });
            return { ...prev, profile: mergedProfile };
          });
        })
        .subscribe();
      profileChannelRef.current = channel;
    } catch (err: any) {
      debug.error('Failed to subscribe to profile updates', { error: err.message });
    }
  };

  useEffect(() => {

    const getActiveSession = async () => {
      if (isFetchingSession.current) { // Prevent re-entry if already fetching
        debug.log('getActiveSession: Already fetching, skipping.');
        return;
      }
      isFetchingSession.current = true; // Set flag at the start
      
      setAuthState(prev => ({ ...prev, loading: true }));
      debug.log('Starting session fetch');
      
      debug.startTimer('getActiveSession'); // Always start timer at the beginning

      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
          debug.log('Session found', { userId: session.user.id });
          setAuthState(prev => ({ ...prev, user: session.user }));
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          debug.log('Profile fetched', { profile });
          
          // User progress for external certifications only
          const { data: userProgress, error: userProgressError } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', session.user.id);
          
          if (userProgressError) throw userProgressError;

          debug.log('User progress fetched', { progressCount: userProgress?.length });
          
          const { data: userAchievements, error: userAchievementsError } = await supabase
            .from('user_achievements')
            .select('*')
            .eq('user_id', session.user.id);

          if (userAchievementsError) throw userAchievementsError;

          debug.log('User achievements fetched', { achievementsCount: userAchievements?.length });

          // Transform and provide defaults for missing fields
          const transformedProfile: UserProfile = {
            id: profile?.id || session.user.id,
            email: profile?.email || session.user.email || '',
            fullName: profile?.full_name || profile?.fullName || session.user.user_metadata?.full_name || 'User',
            avatarUrl: profile?.avatar_url || profile?.avatarUrl || '',
            bio: profile?.bio || '',
            subscriptionTier: profile?.subscription_tier || profile?.subscriptionTier || 'free',
            learningStreak: profile?.learning_streak || profile?.learningStreak || 0,
            totalCertificationsCompleted: profile?.total_certifications_completed || profile?.totalCertificationsCompleted || 0,
            joinedAt: profile?.joined_at || profile?.joinedAt || new Date().toISOString(),
            isAdmin: profile?.is_admin || false,
            isSuperAdmin: profile?.is_super_admin || false,
            preferences: {
              emailNotifications: profile?.preferences?.emailNotifications || true,
              pushNotifications: profile?.preferences?.pushNotifications || true,
              newsletter: profile?.preferences?.newsletter || false,
              learningReminders: profile?.preferences?.learningReminders || true,
            },
            stats: {
              hoursLearned: profile?.stats?.hoursLearned || profile?.stats?.hours_learned || 0,
              averageScore: profile?.stats?.averageScore || profile?.stats?.average_score || 0,
              skillsLearned: profile?.stats?.skillsLearned || profile?.stats?.skills_learned || [],
              currentGoal: profile?.stats?.currentGoal || profile?.stats?.current_goal || 'Complete your first certification',
            },
            userProgress: userProgress || [], // Simplified assignment
            userAchievements: userAchievements as UserAchievement[] || [],
          };

          debug.log('Profile transformation complete', { transformedProfile });
          
          setAuthState(prev => ({
            ...prev,
            profile: transformedProfile,
            loading: false,
          }));

          // Subscribe to realtime profile updates for this user
          subscribeToProfileUpdates(session.user.id);
          
        } else {
          debug.log('No session found');
          setAuthState(prev => ({ ...prev, user: null, profile: null, loading: false }));
          if (profileChannelRef.current) {
            supabase.removeChannel(profileChannelRef.current);
            profileChannelRef.current = null;
          }
        }
      } catch (error: any) {
        debug.error("Error fetching session or profile", { error: error.message });
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }));
      } finally {
        debug.endTimer('getActiveSession'); // Always end timer in finally
        isFetchingSession.current = false; // Reset flag
      }
    };

    getActiveSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUserId = authState.user?.id; // Capture current user ID before state update
      setAuthState(prev => ({ ...prev, user: session?.user || null, loading: false }));

      const newUserId = session?.user?.id;

      // Only re-fetch profile if a new session is established or the user changes AND not already fetching
      if (newUserId && newUserId !== currentUserId && !isFetchingSession.current) {
        debug.log('Auth state change detected: New user session or user changed, re-fetching profile.', { newUserId });
        getActiveSession();
        subscribeToProfileUpdates(newUserId);
      } else if (!newUserId && currentUserId) {
        // User logged out
        debug.log('Auth state change detected: User logged out.', { oldUserId: currentUserId });
        if (profileChannelRef.current) {
          supabase.removeChannel(profileChannelRef.current);
          profileChannelRef.current = null;
        }
        // Ensure authState is fully reset if logging out
        setAuthState({ user: null, profile: null, loading: false, error: null });
      }
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
      if (profileChannelRef.current) {
        supabase.removeChannel(profileChannelRef.current);
        profileChannelRef.current = null;
      }
    };
  }, []);

  return authState;
}; 