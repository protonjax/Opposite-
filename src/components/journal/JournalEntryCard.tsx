import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { Feather } from '@expo/vector-icons';
import type { JournalEntry } from '@/types/app';

const MOODS = ['', '😩', '😕', '😐', '😊', '🔥'];

type Props = { entry: JournalEntry };

export function JournalEntryCard({ entry }: Props) {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.push(`/journal/${entry.id}`)}
      className="bg-surface border border-border rounded-2xl p-4 mb-3"
      activeOpacity={0.8}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-muted text-sm">
          {format(new Date(entry.entry_date + 'T00:00:00'), 'EEE, MMM d')}
        </Text>
        <View className="flex-row items-center gap-2">
          {entry.mood_score ? <Text style={{ fontSize: 18 }}>{MOODS[entry.mood_score]}</Text> : null}
          <View className="flex-row items-center gap-1">
            <Feather name="zap" size={12} color="#39FF14" />
            <Text className="text-green text-xs font-bold">+{entry.score_earned}</Text>
          </View>
        </View>
      </View>
      <Text className="text-white text-sm leading-5" numberOfLines={2}>{entry.content}</Text>
      {entry.opposite_actions.length > 0 && (
        <View className="flex-row flex-wrap gap-1 mt-2">
          {entry.opposite_actions.slice(0, 3).map((a, i) => (
            <View key={i} className="bg-green/10 border border-green/30 rounded-full px-2 py-0.5">
              <Text className="text-green text-xs">{a}</Text>
            </View>
          ))}
          {entry.opposite_actions.length > 3 && (
            <Text className="text-muted text-xs self-center">+{entry.opposite_actions.length - 3}</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
