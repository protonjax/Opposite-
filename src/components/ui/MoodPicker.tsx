import { View, Text, TouchableOpacity } from 'react-native';

const MOODS = ['😩', '😕', '😐', '😊', '🔥'];
const LABELS = ['Burnt', 'Low', 'OK', 'Good', 'Fire'];

type Props = {
  value: number;
  onChange: (value: number) => void;
};

export function MoodPicker({ value, onChange }: Props) {
  return (
    <View className="flex-row justify-between">
      {MOODS.map((emoji, i) => {
        const score = i + 1;
        const selected = value === score;
        return (
          <TouchableOpacity
            key={score}
            onPress={() => onChange(score)}
            className={`items-center flex-1 py-2 rounded-xl mx-1 ${selected ? 'bg-surface border border-green' : ''}`}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 24 }}>{emoji}</Text>
            <Text className={`text-xs mt-1 ${selected ? 'text-green' : 'text-muted'}`}>{LABELS[i]}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
