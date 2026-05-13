import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { LeaderboardEntry } from '@/types/app';

type Props = {
  entry: LeaderboardEntry;
  isCurrentUser?: boolean;
  scoreKey?: 'weekly_score' | 'total_score';
};

const RANK_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

export function LeaderboardRow({ entry, isCurrentUser, scoreKey = 'weekly_score' }: Props) {
  const rankColor = entry.rank <= 3 ? RANK_COLORS[entry.rank - 1] : '#888';
  const score = scoreKey === 'weekly_score' ? entry.weekly_score : entry.total_score;

  return (
    <View
      className={`flex-row items-center px-4 py-3 border-b border-border ${
        isCurrentUser ? 'bg-green/10' : ''
      }`}
    >
      <Text className="w-8 font-bold text-sm" style={{ color: rankColor }}>
        {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}
      </Text>
      <View className="flex-1 ml-2">
        <Text className="text-white font-semibold text-sm">{entry.display_name ?? entry.username}</Text>
        <Text className="text-muted text-xs">@{entry.username}</Text>
      </View>
      <View className="flex-row items-center gap-1">
        <Feather name="zap" size={14} color="#39FF14" />
        <Text className="text-green font-bold text-base">{(score ?? 0).toLocaleString()}</Text>
      </View>
    </View>
  );
}
