import { View, Text } from 'react-native';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import type { HabitLog } from '@/types/app';

type Props = { logs: HabitLog[] };

export function StreakCalendar({ logs }: Props) {
  const today = new Date();
  const days = eachDayOfInterval({ start: subDays(today, 29), end: today });
  const completedDates = new Set(logs.filter((l) => l.completed).map((l) => l.log_date));

  const weeks: Date[][] = [];
  let week: Date[] = [];
  days.forEach((d, i) => {
    week.push(d);
    if (week.length === 7 || i === days.length - 1) {
      weeks.push(week);
      week = [];
    }
  });

  return (
    <View>
      <Text className="text-muted text-xs mb-2">Last 30 days</Text>
      <View className="flex-row gap-1 flex-wrap">
        {days.map((d) => {
          const key = format(d, 'yyyy-MM-dd');
          const done = completedDates.has(key);
          const isToday = key === format(today, 'yyyy-MM-dd');
          return (
            <View
              key={key}
              className={`w-7 h-7 rounded-md items-center justify-center ${
                done ? 'bg-green' : 'bg-surface border border-border'
              } ${isToday && !done ? 'border-white' : ''}`}
            />
          );
        })}
      </View>
    </View>
  );
}
