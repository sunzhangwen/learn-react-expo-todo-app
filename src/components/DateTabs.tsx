import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { colors } from '@/constants/colors';
import { buildDateTabs } from '@/utils/date';

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

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {items.map((item) => {
        const active = item.date === selectedDate;
        return (
          <TouchableOpacity
            key={item.date}
            style={[styles.item, active && styles.itemActive]}
            onPress={() => onSelect(item.date)}
            activeOpacity={0.8}
          >
            <Text style={[styles.month, active && styles.textActive]}>{item.month}</Text>
            <Text style={[styles.day, active && styles.textActive]}>{item.day}</Text>
            <Text style={[styles.weekday, active && styles.textActive]}>{item.weekday}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 10,
  },
  item: {
    width: 56,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  month: {
    fontSize: 11,
    color: colors.textTertiary,
  },
  day: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginVertical: 2,
  },
  weekday: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  textActive: {
    color: colors.surface,
  },
});
