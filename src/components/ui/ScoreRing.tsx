import Svg, { Circle } from 'react-native-svg';
import { View, Text } from 'react-native';

type Props = {
  score: number;
  size?: number;
};

const MILESTONES = [100, 250, 500, 1000, 2500, 5000];

export function ScoreRing({ score, size = 140 }: Props) {
  const nextMilestone = MILESTONES.find((m) => m > score) ?? MILESTONES[MILESTONES.length - 1];
  const prevMilestone = MILESTONES[MILESTONES.indexOf(nextMilestone) - 1] ?? 0;
  const progress = Math.min((score - prevMilestone) / (nextMilestone - prevMilestone), 1);

  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View className="items-center justify-center" style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="#222" strokeWidth={strokeWidth} fill="none"
        />
        <Circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="#39FF14" strokeWidth={strokeWidth} fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          originX={size / 2} originY={size / 2}
        />
      </Svg>
      <View className="items-center">
        <Text className="text-white font-bold text-2xl">{score.toLocaleString()}</Text>
        <Text className="text-muted text-xs">/ {nextMilestone.toLocaleString()}</Text>
      </View>
    </View>
  );
}
