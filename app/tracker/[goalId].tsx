import { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useGoals } from '@/hooks/useGoals';
import { useHabits } from '@/hooks/useHabits';
import { HabitRow } from '@/components/tracker/HabitRow';
import { StreakCalendar } from '@/components/tracker/StreakCalendar';
import { Button } from '@/components/ui/Button';

export default function GoalDetail() {
  const { goalId } = useLocalSearchParams<{ goalId: string }>();
  const router = useRouter();
  const { goals, completeGoal } = useGoals();
  const { habits, isLoading, load, logHabit } = useHabits(goalId);

  const goal = goals.find((g) => g.id === goalId);

  useEffect(() => { load(); }, [goalId]);

  if (!goal) {
    return (
      <SafeAreaView className="flex-1 bg-bg items-center justify-center">
        <Text className="text-muted">Goal not found</Text>
      </SafeAreaView>
    );
  }

  // Merge all logs for the calendar
  const allLogs = habits.flatMap((h) => h.logs ?? []);
  const maxStreak = Math.max(0, ...habits.map((h) => h.streak ?? 0));

  async function handleComplete() {
    Alert.alert('Complete Goal?', 'This will mark your goal as done and award +50 pts.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Complete',
        onPress: async () => {
          try {
            await completeGoal(goal!.id);
          } catch (e: any) {
            Alert.alert('Error', e.message);
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView className="flex-1 px-4">
        <View className="flex-row items-center gap-2 mt-4 mb-6">
          <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-1">
            <Feather name="arrow-left" size={18} color="#888" />
            <Text className="text-muted">Back</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between items-start mb-4">
          <Text className="text-white font-black text-2xl flex-1 mr-4">{goal.title}</Text>
          {goal.is_completed && (
            <View className="bg-green/20 border border-green/40 rounded-full px-3 py-1">
              <Text className="text-green text-xs font-bold">Completed</Text>
            </View>
          )}
        </View>

        {goal.description ? (
          <Text className="text-muted text-sm leading-5 mb-6">{goal.description}</Text>
        ) : null}

        {maxStreak > 0 && (
          <View className="flex-row items-center gap-2 mb-4 bg-surface border border-border rounded-xl px-4 py-3">
            <Feather name="zap" size={16} color="#FFD700" />
            <Text className="text-white font-semibold">Best streak: {maxStreak} days</Text>
          </View>
        )}

        {allLogs.length > 0 && (
          <View className="bg-surface border border-border rounded-2xl p-4 mb-6">
            <StreakCalendar logs={allLogs} />
          </View>
        )}

        {/* Habits */}
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-white font-bold text-lg">Habits</Text>
          {!goal.is_completed && (
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/tracker/new-habit', params: { goalId: goal.id } })}
              className="flex-row items-center gap-1"
            >
              <Feather name="plus" size={14} color="#39FF14" />
              <Text className="text-green text-sm">Add</Text>
            </TouchableOpacity>
          )}
        </View>

        {habits.length === 0 && !isLoading ? (
          <View className="py-6 items-center">
            <Text className="text-muted text-sm">No habits yet — add one to start tracking</Text>
          </View>
        ) : (
          <View className="bg-surface border border-border rounded-2xl px-4 mb-6">
            {habits.map((h) => (
              <HabitRow key={h.id} habit={h} onLog={logHabit} />
            ))}
          </View>
        )}

        {!goal.is_completed && (
          <Button
            label="Mark Goal Complete (+50 pts)"
            variant="secondary"
            onPress={handleComplete}
            className="mb-8"
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
