import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useOppositeStat } from '@/hooks/useOppositeStats';
import { Button } from '@/components/ui/Button';

const CATEGORY_COLORS: Record<string, string> = {
  health:      '#FF4444',
  finance:     '#FFD700',
  productivity: '#FF6B00',
  social:      '#9B59FF',
};

export default function StatDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { stat, isLoading } = useOppositeStat(id);

  if (isLoading || !stat) {
    return (
      <SafeAreaView className="flex-1 bg-bg items-center justify-center">
        <Text className="text-muted">Loading…</Text>
      </SafeAreaView>
    );
  }

  const color = CATEGORY_COLORS[stat.category] ?? '#888';

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView className="flex-1 px-4">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-1 mt-4 mb-6">
          <Feather name="arrow-left" size={18} color="#888" />
          <Text className="text-muted">Back</Text>
        </TouchableOpacity>

        <View className="flex-row items-center gap-2 mb-4">
          <View className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <Text className="text-muted text-sm capitalize">{stat.category}</Text>
          <Text className="text-muted text-sm">·</Text>
          <Feather name="trending-up" size={12} color="#888" />
          <Text className="text-muted text-sm">Impact {stat.impact_score}/10</Text>
        </View>

        {/* Most People panel */}
        <View className="bg-red/10 border border-red/30 rounded-2xl p-5 mb-4">
          <View className="flex-row items-center gap-2 mb-3">
            <Feather name="users" size={16} color="#FF4444" />
            <Text className="text-red font-bold uppercase tracking-wide">Most People</Text>
          </View>
          <Text className="text-white text-xl font-bold leading-7 mb-2">{stat.stat_label}</Text>
          <Text className="text-red/80 text-base">{stat.stat_value}</Text>
        </View>

        {/* The Opposite panel */}
        <View className="bg-green/10 border border-green/30 rounded-2xl p-5 mb-4">
          <View className="flex-row items-center gap-2 mb-3">
            <Feather name="zap" size={16} color="#39FF14" />
            <Text className="text-green font-bold uppercase tracking-wide">The Opposite</Text>
          </View>
          <Text className="text-white text-xl font-bold leading-7 mb-2">{stat.opposite_label}</Text>
          <Text className="text-green/80 text-base">{stat.opposite_value}</Text>
        </View>

        {stat.source && (
          <View className="flex-row items-start gap-2 mb-8 px-1">
            <Feather name="book" size={14} color="#555" style={{ marginTop: 2 }} />
            <Text className="text-muted text-xs flex-1">{stat.source}</Text>
          </View>
        )}

        <Button
          label="Log this as my opposite action"
          onPress={() => router.push({ pathname: '/journal/new', params: { statId: stat.id } })}
          className="mb-8"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
