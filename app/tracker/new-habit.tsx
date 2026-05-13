import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useHabits } from '@/hooks/useHabits';
import { Button } from '@/components/ui/Button';

export default function NewHabit() {
  const router = useRouter();
  const { goalId } = useLocalSearchParams<{ goalId: string }>();
  const { createHabit } = useHabits(goalId);
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!title.trim()) {
      Alert.alert('Give your habit a name');
      return;
    }
    setLoading(true);
    try {
      await createHabit({ title: title.trim(), frequency });
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-1 px-4">
        <View className="flex-row items-center justify-between mt-4 mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-muted text-base">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-white font-bold text-base">New Habit</Text>
          <View style={{ width: 50 }} />
        </View>

        <Text className="text-muted text-sm mb-1">Habit Name *</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Walk 8,000 steps"
          placeholderTextColor="#555"
          className="bg-surface border border-border rounded-xl px-4 py-4 text-white text-base mb-6"
          autoFocus
        />

        <Text className="text-muted text-sm mb-2">Frequency</Text>
        <View className="flex-row gap-3 mb-8">
          {(['daily', 'weekly'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFrequency(f)}
              className={`flex-1 py-3 rounded-xl border items-center ${
                frequency === f ? 'bg-green/20 border-green' : 'bg-surface border-border'
              }`}
            >
              <Text className={`font-semibold capitalize ${frequency === f ? 'text-green' : 'text-muted'}`}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button label="Add Habit" onPress={handleCreate} loading={loading} />
      </View>
    </SafeAreaView>
  );
}
