import { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { format } from 'date-fns';
import { Feather } from '@expo/vector-icons';
import { useJournal } from '@/hooks/useJournal';
import { Button } from '@/components/ui/Button';
import { MoodPicker } from '@/components/ui/MoodPicker';

export default function NewJournalEntry() {
  const router = useRouter();
  const { statId } = useLocalSearchParams<{ statId?: string }>();

  const { createEntry } = useJournal();
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(3);
  const [actions, setActions] = useState<string[]>([]);
  const [actionInput, setActionInput] = useState('');
  const [loading, setLoading] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');

  function addAction() {
    const trimmed = actionInput.trim();
    if (!trimmed || actions.includes(trimmed)) return;
    setActions([...actions, trimmed]);
    setActionInput('');
  }

  function removeAction(a: string) {
    setActions(actions.filter((x) => x !== a));
  }

  async function handleSubmit() {
    if (!content.trim()) {
      Alert.alert('Write something first');
      return;
    }
    setLoading(true);
    try {
      await createEntry({
        content: content.trim(),
        moodScore: mood,
        oppositeActions: actions,
        linkedStatId: statId ?? null,
        entryDate: today,
      });
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
        <View className="flex-row items-center justify-between mt-4 mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-muted text-base">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-white font-bold text-base">{format(new Date(), 'EEE, MMM d')}</Text>
          <View style={{ width: 50 }} />
        </View>

        <Text className="text-white font-bold text-xl mb-1">How did you go opposite today?</Text>
        <Text className="text-muted text-sm mb-5">Log what you did differently from the crowd</Text>

        {/* Journal content */}
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Write about your opposite actions today…"
          placeholderTextColor="#555"
          multiline
          className="bg-surface border border-border rounded-2xl p-4 text-white text-base leading-6 min-h-32 mb-6"
          textAlignVertical="top"
        />

        {/* Mood */}
        <Text className="text-white font-semibold mb-3">How are you feeling?</Text>
        <MoodPicker value={mood} onChange={setMood} />

        {/* Opposite actions tags */}
        <Text className="text-white font-semibold mt-6 mb-3">Opposite actions taken</Text>
        <View className="flex-row gap-2 mb-3">
          <TextInput
            value={actionInput}
            onChangeText={setActionInput}
            onSubmitEditing={addAction}
            placeholder="e.g. Woke up at 5am"
            placeholderTextColor="#555"
            returnKeyType="done"
            className="flex-1 bg-surface border border-border rounded-xl px-4 py-3 text-white text-sm"
          />
          <TouchableOpacity onPress={addAction} className="bg-green/20 border border-green/40 rounded-xl px-4 items-center justify-center">
            <Feather name="plus" size={18} color="#39FF14" />
          </TouchableOpacity>
        </View>
        {actions.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mb-4">
            {actions.map((a) => (
              <TouchableOpacity
                key={a}
                onPress={() => removeAction(a)}
                className="flex-row items-center gap-1 bg-green/10 border border-green/30 rounded-full px-3 py-1.5"
              >
                <Text className="text-green text-sm">{a}</Text>
                <Feather name="x" size={12} color="#39FF14" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {statId && (
          <View className="flex-row items-center gap-2 bg-surface border border-green/30 rounded-xl px-4 py-3 mb-4">
            <Feather name="link" size={14} color="#39FF14" />
            <Text className="text-green text-sm">Linked to a stat (+5 pts)</Text>
          </View>
        )}

        <Button label="Save Entry" onPress={handleSubmit} loading={loading} className="mt-2 mb-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
