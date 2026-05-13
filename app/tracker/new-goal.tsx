import { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useGoals } from '@/hooks/useGoals';
import { Button } from '@/components/ui/Button';

const CATEGORIES = ['health', 'finance', 'productivity', 'social'];

export default function NewGoal() {
  const router = useRouter();
  const { createGoal } = useGoals();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!title.trim()) {
      Alert.alert('Give your goal a title');
      return;
    }
    setLoading(true);
    try {
      await createGoal({ title: title.trim(), description: description.trim() || undefined, category: category || undefined });
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
          <Text className="text-white font-bold text-base">New Goal</Text>
          <View style={{ width: 50 }} />
        </View>

        <Text className="text-muted text-sm mb-1">Goal Title *</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="What are you working towards?"
          placeholderTextColor="#555"
          className="bg-surface border border-border rounded-xl px-4 py-4 text-white text-base mb-4"
        />

        <Text className="text-muted text-sm mb-1">Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Why is this goal important to you?"
          placeholderTextColor="#555"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          className="bg-surface border border-border rounded-xl px-4 py-4 text-white text-base mb-4 min-h-20"
        />

        <Text className="text-muted text-sm mb-2">Category</Text>
        <View className="flex-row flex-wrap gap-2 mb-6">
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setCategory(c === category ? '' : c)}
              className={`rounded-full px-4 py-2 border ${category === c ? 'bg-green/20 border-green' : 'bg-surface border-border'}`}
            >
              <Text className={`text-sm font-medium capitalize ${category === c ? 'text-green' : 'text-muted'}`}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button label="Create Goal" onPress={handleCreate} loading={loading} className="mb-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
