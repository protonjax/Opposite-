import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useAuthStore } from '@/stores/authStore';
import { LeaderboardRow } from '@/components/leaderboard/LeaderboardRow';
import { TopThreePodium } from '@/components/leaderboard/TopThreePodium';

type Tab = 'weekly' | 'alltime';

export default function LeaderboardTab() {
  const [activeTab, setActiveTab] = useState<Tab>('weekly');
  const { weekly, allTime, isLoading, refreshWeekly, refreshAllTime } = useLeaderboard();
  const { profile } = useAuthStore();

  const entries = activeTab === 'weekly' ? weekly : allTime;
  const scoreKey = activeTab === 'weekly' ? 'weekly_score' : 'total_score';

  function refresh() {
    if (activeTab === 'weekly') refreshWeekly(); else refreshAllTime();
  }

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <FlatList
        data={entries.slice(3)}
        keyExtractor={(e) => e.id + activeTab}
        onRefresh={refresh}
        refreshing={isLoading}
        ListHeaderComponent={
          <View className="pt-4">
            <Text className="text-white font-black text-2xl px-4 mb-4">Rankings</Text>

            {/* Tab toggle */}
            <View className="flex-row mx-4 mb-2 bg-surface rounded-xl p-1">
              {(['weekly', 'alltime'] as Tab[]).map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setActiveTab(t)}
                  className={`flex-1 py-2 rounded-lg items-center ${activeTab === t ? 'bg-green' : ''}`}
                >
                  <Text className={`font-semibold text-sm ${activeTab === t ? 'text-bg' : 'text-muted'}`}>
                    {t === 'weekly' ? 'This Week' : 'All Time'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TopThreePodium entries={entries.slice(0, 3)} scoreKey={scoreKey} />

            {entries.length > 3 && (
              <View className="border-t border-border mt-2">
                {entries.slice(0, 3).map((e) => null)}
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <LeaderboardRow
            entry={item}
            scoreKey={scoreKey}
            isCurrentUser={item.id === profile?.id}
          />
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View className="py-12 items-center px-4">
              <Text className="text-muted text-base text-center">
                No scores yet.{'\n'}Start journaling to get on the board!
              </Text>
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}
