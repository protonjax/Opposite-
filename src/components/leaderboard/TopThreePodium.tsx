import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { LeaderboardEntry } from '@/types/app';

type Props = {
  entries: LeaderboardEntry[];
  scoreKey?: 'weekly_score' | 'total_score';
};

export function TopThreePodium({ entries, scoreKey = 'weekly_score' }: Props) {
  const [first, second, third] = entries;
  if (!first) return null;

  function Spot({ entry, height, crown }: { entry: LeaderboardEntry; height: number; crown?: boolean }) {
    const score = scoreKey === 'weekly_score' ? entry.weekly_score : entry.total_score;
    return (
      <View className="items-center flex-1">
        {crown && <Feather name="award" size={20} color="#FFD700" style={{ marginBottom: 4 }} />}
        <View
          className="w-14 h-14 rounded-full bg-surface border-2 items-center justify-center mb-2"
          style={{ borderColor: crown ? '#FFD700' : '#888' }}
        >
          <Text className="text-white font-bold text-lg">
            {(entry.display_name ?? entry.username)[0].toUpperCase()}
          </Text>
        </View>
        <Text className="text-white text-xs font-semibold" numberOfLines={1}>
          {entry.display_name ?? entry.username}
        </Text>
        <Text className="text-green text-xs font-bold">{(score ?? 0).toLocaleString()}</Text>
        <View
          className="w-full mt-2 rounded-t-lg items-center justify-end pb-2"
          style={{ height, backgroundColor: crown ? '#39FF1420' : '#14141480', borderTopWidth: 1, borderColor: crown ? '#39FF14' : '#333' }}
        >
          <Text style={{ color: crown ? '#FFD700' : '#888', fontWeight: 'bold' }}>
            {entry.rank}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row items-end px-4 mt-4 mb-2" style={{ height: 180 }}>
      {second ? <Spot entry={second} height={100} /> : <View className="flex-1" />}
      {first && <Spot entry={first} height={130} crown />}
      {third ? <Spot entry={third} height={80} /> : <View className="flex-1" />}
    </View>
  );
}
