import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useOppositeStats } from '@/hooks/useOppositeStats';
import { useAuthStore } from '@/stores/authStore';
import { StatCard } from '@/components/feed/StatCard';
import { ScoreRing } from '@/components/ui/ScoreRing';

export default function FeedTab() {
  const router = useRouter();
  const { profile } = useAuthStore();
  const { stats, dailyStat, isLoading, refresh } = useOppositeStats();

  const otherStats = stats.filter((s) => s.id !== dailyStat?.id);

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <FlatList
        data={otherStats}
        keyExtractor={(s) => s.id}
        onRefresh={refresh}
        refreshing={isLoading}
        ListHeaderComponent={
          <View className="px-4 pt-4">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-green font-black text-2xl tracking-tight">⊘ Opposite</Text>
                <Text className="text-muted text-sm">Be the 1%</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/profile')} className="items-center">
                <ScoreRing score={profile?.opposite_score ?? 0} size={60} />
              </TouchableOpacity>
            </View>

            {/* Daily featured stat */}
            {dailyStat && (
              <View className="mb-2">
                <StatCard stat={dailyStat} featured />
              </View>
            )}

            <Text className="text-muted text-xs uppercase tracking-widest font-semibold mb-3">All Stats</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="px-4">
            <StatCard stat={item} />
          </View>
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View className="px-4 py-12 items-center">
              <Feather name="zap" size={40} color="#333" />
              <Text className="text-muted text-base mt-3">Stats loading…</Text>
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}
