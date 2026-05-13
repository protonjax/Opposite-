import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { OppositeStat } from '@/types/app';

type Props = {
  stat: OppositeStat;
  featured?: boolean;
};

const CATEGORY_COLORS: Record<string, string> = {
  health:      '#FF4444',
  finance:     '#FFD700',
  productivity: '#FF6B00',
  social:      '#9B59FF',
};

export function StatCard({ stat, featured = false }: Props) {
  const router = useRouter();
  const color = CATEGORY_COLORS[stat.category] ?? '#888';

  return (
    <TouchableOpacity
      onPress={() => router.push(`/stats/${stat.id}`)}
      activeOpacity={0.85}
      className={`rounded-2xl overflow-hidden mb-4 ${featured ? 'border-2 border-green' : 'border border-border'}`}
    >
      {featured && (
        <View className="bg-green px-3 py-1">
          <Text className="text-bg text-xs font-bold tracking-widest uppercase">Today's Opposite</Text>
        </View>
      )}
      <View className="flex-row">
        {/* Left: Most people */}
        <View className="flex-1 bg-surface p-4">
          <View className="flex-row items-center gap-1 mb-2">
            <Feather name="users" size={12} color="#FF4444" />
            <Text className="text-red text-xs font-bold uppercase tracking-wide">Most People</Text>
          </View>
          <Text className="text-muted text-sm leading-5">{stat.stat_label}</Text>
          <Text className="text-red font-semibold text-base mt-2">{stat.stat_value}</Text>
        </View>

        {/* Divider */}
        <View className="w-px bg-border" />

        {/* Right: The Opposite */}
        <View className="flex-1 bg-surface p-4">
          <View className="flex-row items-center gap-1 mb-2">
            <Feather name="zap" size={12} color="#39FF14" />
            <Text className="text-green text-xs font-bold uppercase tracking-wide">The Opposite</Text>
          </View>
          <Text className="text-white text-sm leading-5">{stat.opposite_label}</Text>
          <Text className="text-green font-semibold text-sm mt-2">{stat.opposite_value}</Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between px-4 py-2 bg-surface border-t border-border">
        <View className="flex-row items-center gap-1">
          <View className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <Text className="text-muted text-xs capitalize">{stat.category}</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Feather name="trending-up" size={12} color="#888" />
          <Text className="text-muted text-xs">Impact {stat.impact_score}/10</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
