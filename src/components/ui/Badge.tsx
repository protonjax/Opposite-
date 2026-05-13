import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BADGE_MAP } from '@/constants/badges';

type Props = {
  badgeId: string;
  locked?: boolean;
  size?: 'sm' | 'md';
};

export function BadgePill({ badgeId, locked = false, size = 'md' }: Props) {
  const def = BADGE_MAP[badgeId];
  if (!def) return null;

  const iconSize = size === 'sm' ? 14 : 18;
  const opacity = locked ? 'opacity-30' : '';

  return (
    <View className={`items-center ${opacity}`}>
      <View
        className={`rounded-full items-center justify-center ${size === 'sm' ? 'w-10 h-10' : 'w-14 h-14'}`}
        style={{ backgroundColor: locked ? '#222' : def.color + '22', borderWidth: 1.5, borderColor: locked ? '#333' : def.color }}
      >
        <Feather name={def.icon as any} size={iconSize} color={locked ? '#555' : def.color} />
      </View>
      {size === 'md' && (
        <Text className="text-white text-xs mt-1 font-medium text-center" numberOfLines={2}>
          {def.name}
        </Text>
      )}
    </View>
  );
}
