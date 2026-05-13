import { useState } from 'react';
import { View, Text, TextInput, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { signUp } from '@/lib/auth';

export default function SignUp() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!username || !email || !password) {
      Alert.alert('Fill in all fields');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const { error } = await signUp(email.trim().toLowerCase(), password, username.trim().toLowerCase());
    setLoading(false);
    if (error) {
      Alert.alert('Sign up failed', error.message);
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

        <Text className="text-white font-black text-3xl mb-2">Join the 1%</Text>
        <Text className="text-muted text-base mb-8">Create your Opposite account</Text>

        <View className="gap-4">
          <View>
            <Text className="text-muted text-sm mb-1">Username</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="yourname"
              placeholderTextColor="#555"
              autoCapitalize="none"
              autoCorrect={false}
              className="bg-surface border border-border rounded-xl px-4 py-4 text-white text-base"
            />
          </View>

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
              placeholder="Min. 6 characters"
              placeholderTextColor="#555"
              secureTextEntry
              className="bg-surface border border-border rounded-xl px-4 py-4 text-white text-base"
            />
          </View>

          <Button label="Create Account" onPress={handleSignUp} loading={loading} className="mt-2" />
          <Button label="Sign in instead" variant="ghost" onPress={() => router.push('/(auth)/sign-in')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
