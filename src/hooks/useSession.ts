import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import type { Profile } from '@/types/app';

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return data ?? null;
}

export function useSession() {
  const { setSession, setProfile, setLoading } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setProfile(profile);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setProfile(profile);
      } else {
        setProfile(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [setSession, setProfile, setLoading]);
}
