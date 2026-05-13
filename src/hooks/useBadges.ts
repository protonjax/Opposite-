import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import type { UserBadge } from '@/types/app';

export function useBadges(userId?: string) {
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [newBadge, setNewBadge] = useState<UserBadge | null>(null);
  const { session } = useAuthStore();
  const targetId = userId ?? session?.user?.id;

  async function load() {
    if (!targetId) return;
    const { data } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', targetId)
      .order('earned_at', { ascending: false });
    setBadges(data ?? []);
  }

  useEffect(() => {
    if (!targetId) return;
    load();

    // Listen for newly earned badges (own user only)
    if (targetId !== session?.user?.id) return;
    const channel = supabase
      .channel('badges-' + targetId)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'user_badges', filter: `user_id=eq.${targetId}` },
        (payload) => {
          const badge = payload.new as UserBadge;
          setBadges((prev) => [badge, ...prev]);
          setNewBadge(badge);
          setTimeout(() => setNewBadge(null), 4000);
        },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [targetId]);

  return { badges, newBadge, refresh: load };
}
