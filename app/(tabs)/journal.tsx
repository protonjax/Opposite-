import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useJournal } from '@/hooks/useJournal';
import { useAuthStore } from '@/stores/authStore';
import { JournalEntryCard } from '@/components/journal/JournalEntryCard';
import { StreakCounter } from '@/components/ui/StreakCounter';
import { format } from 'date-fns';

export default function JournalTab() {
  const router = useRouter();
  const { profile } = useAuthStore();
  const { entries, isLoading, refresh } = useJournal();

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const hasToday = entries.some((e) => e.entry_date === todayStr);

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <FlatList
        data={entries}
        keyExtractor={(e) => e.id}
        onRefresh={refresh}
        refreshing={isLoading}
        ListHeaderComponent={
          <View className="px-4 pt-4 mb-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white font-black text-2xl">Journal</Text>
              <StreakCounter streak={profile?.streak_days ?? 0} />
            </View>

            {!hasToday ? (
              <TouchableOpacity
                onPress={() => router.push('/journal/new')}
                className="bg-green/10 border border-green rounded-2xl p-4 flex-row items-center gap-3"
              >
                <View className="w-10 h-10 bg-green rounded-full items-center justify-center">
                  <Feather name="edit-3" size={18} color="#0A0A0A" />
                </View>
                <View className="flex-1">
                  <Text className="text-green font-bold text-base">Write today's entry</Text>
                  <Text className="text-muted text-sm">Log your opposite actions</Text>
                </View>
                <Feather name="chevron-right" size={20} color="#39FF14" />
              </TouchableOpacity>
            ) : (
              <View className="bg-surface border border-green/30 rounded-2xl p-4 flex-row items-center gap-3">
                <Feather name="check-circle" size={20} color="#39FF14" />
                <Text className="text-green font-semibold">Today's entry logged ✓</Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View className="px-4">
            <JournalEntryCard entry={item} />
          </View>
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View className="px-4 py-12 items-center">
              <Feather name="book-open" size={40} color="#333" />
              <Text className="text-white font-semibold text-lg mt-4">No entries yet</Text>
              <Text className="text-muted text-sm text-center mt-2">
                Start logging your opposite actions{'\n'}to earn Opposite Score
              </Text>
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* FAB */}
      <TouchableOpacity
        onPress={() => router.push('/journal/new')}
        className="absolute bottom-24 right-4 w-14 h-14 bg-green rounded-full items-center justify-center shadow-lg"
        activeOpacity={0.8}
      >
        <Feather name="plus" size={24} color="#0A0A0A" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
