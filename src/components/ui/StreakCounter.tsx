import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

type Props = {
  streak: number;
  label?: string;
};

export function StreakCounter({ streak, label = 'day streak' }: Props) {
  return (
    <View className="flex-row items-center gap-1">
      <Feather name="zap" size={16} color={streak > 0 ? '#FFD700' : '#555'} />
      <Text className="text-white font-bold text-base">{streak}</Text>
      <Text className="text-muted text-sm">{label}</Text>
    </View>
  );
}
