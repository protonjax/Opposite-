import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';
import { useBadges } from '@/hooks/useBadges';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { StreakCounter } from '@/components/ui/StreakCounter';
import { BadgePill } from '@/components/ui/Badge';
import { signOut } from '@/lib/auth';
import { BADGES } from '@/constants/badges';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, reset } = useAuthStore();
  const { badges } = useBadges();

  const earnedIds = new Set(badges.map((b) => b.badge_id));

  async function handleSignOut() {
    await signOut();
    reset();
    router.replace('/(auth)/welcome');
  }

  if (!profile) return null;

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 pt-4 mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={22} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/profile/settings')}>
            <Feather name="settings" size={22} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Profile summary */}
        <View className="items-center px-4 mb-8">
          <View className="w-20 h-20 rounded-full bg-surface border-2 border-green items-center justify-center mb-3">
            <Text className="text-white font-black text-3xl">
              {(profile.display_name ?? profile.username)[0].toUpperCase()}
            </Text>
          </View>
          <Text className="text-white font-black text-2xl">{profile.display_name ?? profile.username}</Text>
          <Text className="text-muted text-sm">@{profile.username}</Text>
        </View>

        {/* Score ring + stats */}
        <View className="flex-row justify-around items-center px-4 mb-8">
          <ScoreRing score={profile.opposite_score} size={140} />
          <View className="gap-4">
            <View className="items-center">
              <StreakCounter streak={profile.streak_days} />
            </View>
            <View className="items-center">
              <Feather name="award" size={16} color="#FFD700" />
              <Text className="text-white font-bold text-lg">{profile.longest_streak}</Text>
              <Text className="text-muted text-xs">best streak</Text>
            </View>
            <View className="items-center">
              <Feather name="shield" size={16} color="#9B59FF" />
              <Text className="text-white font-bold text-lg">{badges.length}</Text>
              <Text className="text-muted text-xs">badges</Text>
            </View>
          </View>
        </View>

        {/* Badges */}
        <View className="px-4 mb-8">
          <Text className="text-white font-bold text-lg mb-4">Badges</Text>
          <View className="flex-row flex-wrap gap-4">
            {BADGES.map((b) => (
              <BadgePill key={b.id} badgeId={b.id} locked={!earnedIds.has(b.id)} />
            ))}
          </View>
        </View>

        <View className="px-4 mb-12">
          <TouchableOpacity
            onPress={handleSignOut}
            className="flex-row items-center gap-2 bg-surface border border-border rounded-xl px-4 py-4"
          >
            <Feather name="log-out" size={18} color="#FF4444" />
            <Text className="text-red font-semibold">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
