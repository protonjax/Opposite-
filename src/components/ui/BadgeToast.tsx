import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BADGE_MAP } from '@/constants/badges';

type Props = { badgeId: string };

export function BadgeToast({ badgeId }: Props) {
  const def = BADGE_MAP[badgeId];
  if (!def) return null;

  return (
    <View
      className="absolute bottom-24 left-4 right-4 bg-surface border border-green rounded-2xl p-4 flex-row items-center gap-3"
      style={{ zIndex: 999 }}
    >
      <View className="w-10 h-10 rounded-full bg-green/20 items-center justify-center">
        <Feather name={def.icon as any} size={18} color={def.color} />
      </View>
      <View className="flex-1">
        <Text className="text-green font-bold text-sm">Badge Unlocked!</Text>
        <Text className="text-white text-base font-semibold">{def.name}</Text>
        <Text className="text-muted text-xs">{def.description}</Text>
      </View>
    </View>
  );
}
