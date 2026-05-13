import '../src/globals.css';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSession } from '@/hooks/useSession';
import { useBadges } from '@/hooks/useBadges';
import { useAuthStore } from '@/stores/authStore';
import { BadgeToast } from '@/components/ui/BadgeToast';

function BadgeListener() {
  const { session } = useAuthStore();
  const { newBadge } = useBadges(session?.user?.id);
  return newBadge ? <BadgeToast badgeId={newBadge.badge_id} /> : null;
}

export default function RootLayout() {
  useSession();

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0A0A0A' } }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="journal/new" options={{ presentation: 'modal' }} />
        <Stack.Screen name="journal/[id]" />
        <Stack.Screen name="tracker/new-goal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="tracker/new-habit" options={{ presentation: 'modal' }} />
        <Stack.Screen name="tracker/[goalId]" />
        <Stack.Screen name="stats/[id]" />
        <Stack.Screen name="profile/index" />
        <Stack.Screen name="profile/settings" />
      </Stack>
      <BadgeListener />
    </GestureHandlerRootView>
  );
}
