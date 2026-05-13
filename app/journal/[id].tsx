import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useJournalStore } from '@/stores/journalStore';

const MOODS = ['', '😩', '😕', '😐', '😊', '🔥'];
const MOOD_LABELS = ['', 'Burnt Out', 'Low', 'OK', 'Good', 'On Fire'];

export default function JournalEntryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const entry = useJournalStore((s) => s.entries.find((e) => e.id === id));

  if (!entry) {
    return (
      <SafeAreaView className="flex-1 bg-bg items-center justify-center">
        <Text className="text-muted">Entry not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView className="flex-1 px-4">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-1 mt-4 mb-6">
          <Feather name="arrow-left" size={18} color="#888" />
          <Text className="text-muted">Back</Text>
        </TouchableOpacity>

        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-white font-black text-xl">
            {format(new Date(entry.entry_date + 'T00:00:00'), 'EEEE, MMMM d')}
          </Text>
          <View className="flex-row items-center gap-1 bg-green/10 border border-green/30 rounded-full px-3 py-1">
            <Feather name="zap" size={12} color="#39FF14" />
            <Text className="text-green text-xs font-bold">+{entry.score_earned} pts</Text>
          </View>
        </View>

        {entry.mood_score && (
          <View className="flex-row items-center gap-2 bg-surface border border-border rounded-2xl px-4 py-3 mb-4">
            <Text style={{ fontSize: 24 }}>{MOODS[entry.mood_score]}</Text>
            <Text className="text-white font-semibold">{MOOD_LABELS[entry.mood_score]}</Text>
          </View>
        )}

        <Text className="text-white text-base leading-7 mb-6">{entry.content}</Text>

        {entry.opposite_actions.length > 0 && (
          <View className="mb-6">
            <Text className="text-muted text-xs uppercase tracking-widest font-semibold mb-3">Opposite Actions</Text>
            <View className="flex-row flex-wrap gap-2">
              {entry.opposite_actions.map((a, i) => (
                <View key={i} className="bg-green/10 border border-green/30 rounded-full px-3 py-1.5">
                  <Text className="text-green text-sm">{a}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {entry.opposite_stats && (
          <View className="bg-surface border border-border rounded-2xl p-4 mb-4">
            <Text className="text-muted text-xs uppercase tracking-widest font-semibold mb-2">Linked Stat</Text>
            <Text className="text-white font-semibold">{entry.opposite_stats.stat_label}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
