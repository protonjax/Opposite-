import { useState } from 'react';
import { View, Text, TextInput, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { signIn } from '@/lib/auth';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (!email || !password) {
      Alert.alert('Fill in all fields');
      return;
    }
    setLoading(true);
    const { error } = await signIn(email.trim().toLowerCase(), password);
    setLoading(false);
    if (error) {
      Alert.alert('Sign in failed', error.message);
    } else {
      router.replace('/(tabs)');
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView className="flex-1 px-6" keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => router.back()} className="mt-4 mb-8">
          <Text className="text-muted text-base">← Back</Text>
        </TouchableOpacity>

        <Text className="text-white font-black text-3xl mb-2">Welcome back</Text>
        <Text className="text-muted text-base mb-8">Sign in to your account</Text>

        <View className="gap-4">
          <View>
            <Text className="text-muted text-sm mb-1">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#555"
              autoCapitalize="none"
              keyboardType="email-address"
              className="bg-surface border border-border rounded-xl px-4 py-4 text-white text-base"
            />
          </View>

          <View>
            <Text className="text-muted text-sm mb-1">Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Your password"
              placeholderTextColor="#555"
              secureTextEntry
              className="bg-surface border border-border rounded-xl px-4 py-4 text-white text-base"
            />
          </View>

          <Button label="Sign In" onPress={handleSignIn} loading={loading} className="mt-2" />
          <Button label="Create an account" variant="ghost" onPress={() => router.push('/(auth)/sign-up')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
