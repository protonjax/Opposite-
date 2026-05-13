import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';
import type { Goal } from '@/types/app';

type Props = { goal: Goal };

export function GoalCard({ goal }: Props) {
  const router = useRouter();
  const activeHabits = goal.habits?.filter((h) => h.is_active) ?? [];
  const completedToday = activeHabits.filter((h) => h.completedToday).length;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/tracker/${goal.id}`)}
      className="bg-surface border border-border rounded-2xl p-4 mb-3"
      activeOpacity={0.8}
    >
      <View className="flex-row justify-between items-start mb-1">
        <Text className="text-white font-semibold text-base flex-1 mr-2" numberOfLines={1}>{goal.title}</Text>
        {goal.is_completed && (
          <View className="bg-green/20 border border-green/40 rounded-full px-2 py-0.5">
            <Text className="text-green text-xs font-bold">Done</Text>
          </View>
        )}
      </View>

      {goal.target_date && (
        <Text className="text-muted text-xs mb-3">
          Target: {format(new Date(goal.target_date + 'T00:00:00'), 'MMM d, yyyy')}
        </Text>
      )}

      {activeHabits.length > 0 && !goal.is_completed && (
        <View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-muted text-xs">Today's habits</Text>
            <Text className="text-white text-xs">{completedToday}/{activeHabits.length}</Text>
          </View>
          <View className="bg-border rounded-full h-1.5">
            <View
              className="bg-green rounded-full h-1.5"
              style={{ width: activeHabits.length > 0 ? `${(completedToday / activeHabits.length) * 100}%` : '0%' }}
            />
          </View>
        </View>
      )}

      {activeHabits.length === 0 && !goal.is_completed && (
        <View className="flex-row items-center gap-1">
          <Feather name="plus-circle" size={12} color="#888" />
          <Text className="text-muted text-xs">Add habits to track</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
