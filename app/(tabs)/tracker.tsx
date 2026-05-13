import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useGoals } from '@/hooks/useGoals';
import { GoalCard } from '@/components/tracker/GoalCard';

export default function TrackerTab() {
  const router = useRouter();
  const { goals, isLoading, refresh } = useGoals();

  const active = goals.filter((g) => g.is_active && !g.is_completed);
  const completed = goals.filter((g) => g.is_completed);

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <FlatList
        data={active}
        keyExtractor={(g) => g.id}
        onRefresh={refresh}
        refreshing={isLoading}
        ListHeaderComponent={
          <View className="px-4 pt-4 mb-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white font-black text-2xl">Tracker</Text>
              <TouchableOpacity
                onPress={() => router.push('/tracker/new-goal')}
                className="flex-row items-center gap-1 bg-green/10 border border-green/30 rounded-full px-3 py-1.5"
              >
                <Feather name="plus" size={14} color="#39FF14" />
                <Text className="text-green text-sm font-semibold">New Goal</Text>
              </TouchableOpacity>
            </View>

            {active.length === 0 && !isLoading && (
              <View className="py-8 items-center">
                <Feather name="target" size={40} color="#333" />
                <Text className="text-white font-semibold text-lg mt-4">No active goals</Text>
                <Text className="text-muted text-sm text-center mt-2">
                  Add a goal to start tracking{'\n'}your opposite habits
                </Text>
                <TouchableOpacity
                  onPress={() => router.push('/tracker/new-goal')}
                  className="mt-4 bg-green rounded-xl px-6 py-3"
                >
                  <Text className="text-bg font-bold">Create First Goal</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View className="px-4">
            <GoalCard goal={item} />
          </View>
        )}
        ListFooterComponent={
          completed.length > 0 ? (
            <View className="px-4 mt-4">
              <Text className="text-muted text-xs uppercase tracking-widest font-semibold mb-3">Completed</Text>
              {completed.map((g) => <GoalCard key={g.id} goal={g} />)}
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity
        onPress={() => router.push('/tracker/new-goal')}
        className="absolute bottom-24 right-4 w-14 h-14 bg-green rounded-full items-center justify-center"
        activeOpacity={0.8}
      >
        <Feather name="plus" size={24} color="#0A0A0A" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
