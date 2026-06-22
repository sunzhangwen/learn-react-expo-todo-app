import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { buildDateTabs, getToday } from '@/utils/date';

type DateTabsProps = {
  selectedDate: string;
  onSelect: (date: string) => void;
};

/**
 * 日期标签栏（需求第 7 节）：前 2 天到后 4 天共 7 天，横向滚动。
 */
export function DateTabs({ selectedDate, onSelect }: DateTabsProps) {
  const { colors } = useTheme();
  // 以选中日期为中心生成 7 天。
  const items = useMemo(() => buildDateTabs(selectedDate), [selectedDate]);
  const today = useMemo(() => getToday(), []);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {items.map((item) => {
        const active = item.date === selectedDate;
        const isToday = item.date === today;
        return (
          <TouchableOpacity
            key={item.date}
            style={[
              styles.item,
              { backgroundColor: colors.surface, borderColor: colors.borderLight },
              active && { backgroundColor: colors.primary, borderColor: colors.primary },
              isToday && !active && { borderColor: `${colors.primary}40` },
            ]}
            onPress={() => onSelect(item.date)}
            activeOpacity={0.7}
          >
            {isToday && !active && <View style={[styles.todayDot, { backgroundColor: colors.primary }]} />}
            <Text style={[styles.month, { color: colors.textTertiary }, active && { color: '#FFFFFF' }, isToday && !active && { color: colors.primary }]}>
              {item.month}
            </Text>
            <Text style={[styles.day, { color: colors.textPrimary }, active && { color: '#FFFFFF' }, isToday && !active && { color: colors.primary }]}>
              {item.day}
            </Text>
            <Text style={[styles.weekday, { color: colors.textSecondary }, active && { color: '#FFFFFF' }, isToday && !active && { color: colors.primary }]}>
              {item.weekday}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  item: {
    width: 56,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
  month: {
    fontSize: 11,
    fontWeight: '500',
  },
  day: {
    fontSize: 20,
    fontWeight: '800',
    marginVertical: 2,
  },
  weekday: {
    fontSize: 11,
    fontWeight: '500',
  },
});
