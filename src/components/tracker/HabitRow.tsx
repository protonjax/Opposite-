import { View, Text, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import type { Habit } from '@/types/app';

type Props = {
  habit: Habit;
  onLog: (habitId: string) => void;
};

export function HabitRow({ habit, onLog }: Props) {
  async function handlePress() {
    if (habit.completedToday) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLog(habit.id);
  }

  return (
    <View className="flex-row items-center gap-3 py-3 border-b border-border">
      <TouchableOpacity
        onPress={handlePress}
        className={`w-7 h-7 rounded-full border-2 items-center justify-center ${
          habit.completedToday ? 'bg-green border-green' : 'border-muted'
        }`}
        activeOpacity={0.7}
      >
        {habit.completedToday && <Feather name="check" size={14} color="#0A0A0A" />}
      </TouchableOpacity>
      <View className="flex-1">
        <Text className={`text-base ${habit.completedToday ? 'text-muted line-through' : 'text-white'}`}>
          {habit.title}
        </Text>
      </View>
      {habit.streak && habit.streak > 0 ? (
        <View className="flex-row items-center gap-1">
          <Feather name="zap" size={12} color="#FFD700" />
          <Text className="text-yellow-400 text-xs">{habit.streak}</Text>
        </View>
      ) : null}
    </View>
  );
}
