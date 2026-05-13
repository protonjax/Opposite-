import { View, Text, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';

export default function Welcome() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-1 px-6 justify-between py-12">
        <View className="items-center mt-16">
          <Text className="text-green font-black text-6xl tracking-tighter">⊘</Text>
          <Text className="text-white font-black text-4xl mt-4 tracking-tight">The Opposite</Text>
          <Text className="text-muted text-lg mt-2 text-center leading-7">
            Stop doing what everyone else does.{'\n'}Start winning.
          </Text>
        </View>

        <View className="gap-4">
          <View className="bg-surface border border-border rounded-2xl p-4 gap-3">
            {[
              { icon: '📊', text: 'See what most people do — then do the opposite' },
              { icon: '📓', text: 'Journal your contrarian actions daily' },
              { icon: '🎯', text: 'Track goals and habits that actually matter' },
              { icon: '🏆', text: 'Compete to be the most opposite person alive' },
            ].map(({ icon, text }) => (
              <View key={text} className="flex-row items-center gap-3">
                <Text style={{ fontSize: 20 }}>{icon}</Text>
                <Text className="text-white text-sm flex-1">{text}</Text>
              </View>
            ))}
          </View>

          <Button label="Get Started" onPress={() => router.push('/(auth)/sign-up')} />
          <Button
            label="I already have an account"
            variant="ghost"
            onPress={() => router.push('/(auth)/sign-in')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
