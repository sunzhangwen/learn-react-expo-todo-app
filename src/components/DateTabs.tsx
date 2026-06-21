import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/constants/colors';
import { buildDateTabs, getToday } from '@/utils/date';

type DateTabsProps = {
  selectedDate: string;
  onSelect: (date: string) => void;
};

/**
 * 日期标签栏（需求第 7 节）：前 2 天到后 4 天共 7 天，横向滚动。
 */
export function DateTabs({ selectedDate, onSelect }: DateTabsProps) {
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
            style={[styles.item, active && styles.itemActive, isToday && !active && styles.itemToday]}
            onPress={() => onSelect(item.date)}
            activeOpacity={0.7}
          >
            {isToday && !active && <View style={styles.todayDot} />}
            <Text style={[styles.month, active && styles.textActive, isToday && !active && styles.textToday]}>
              {item.month}
            </Text>
            <Text style={[styles.day, active && styles.textActive, isToday && !active && styles.textToday]}>
              {item.day}
            </Text>
            <Text style={[styles.weekday, active && styles.textActive, isToday && !active && styles.textToday]}>
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
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
  },
  itemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    boxShadow: '0px 4px 12px rgba(64, 128, 255, 0.3)',
  },
  itemToday: {
    borderColor: `${colors.primary}40`,
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginBottom: 4,
  },
  month: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textTertiary,
  },
  day: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginVertical: 2,
  },
  weekday: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  textActive: {
    color: colors.surface,
  },
  textToday: {
    color: colors.primary,
  },
});
