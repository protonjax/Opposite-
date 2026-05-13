import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/stores/authStore';

export default function Index() {
  const { session, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A0A0A', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#39FF14" />
      </View>
    );
  }

  return session ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)/welcome" />;
}
