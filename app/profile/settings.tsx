import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';

export default function Settings() {
  const router = useRouter();
  const { profile, setProfile } = useAuthStore();
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '');
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!profile) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .update({ display_name: displayName.trim() || profile.username })
      .eq('id', profile.id)
      .select()
      .single();
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setProfile(data);
      router.back();
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
        <View className="flex-row items-center gap-3 mt-4 mb-8">
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={22} color="#888" />
          </TouchableOpacity>
          <Text className="text-white font-bold text-xl">Settings</Text>
        </View>

        <Text className="text-muted text-sm mb-1">Display Name</Text>
        <TextInput
          value={displayName}
          onChangeText={setDisplayName}
          placeholder={profile?.username}
          placeholderTextColor="#555"
          className="bg-surface border border-border rounded-xl px-4 py-4 text-white text-base mb-6"
        />

        <View className="bg-surface border border-border rounded-xl px-4 py-4 mb-2">
          <Text className="text-muted text-xs mb-1">Username (cannot be changed)</Text>
          <Text className="text-white">@{profile?.username}</Text>
        </View>

        <Button label="Save Changes" onPress={handleSave} loading={loading} className="mt-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
