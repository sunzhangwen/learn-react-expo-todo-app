import React, { useMemo, useCallback } from 'react';
import { View, TouchableOpacity, Text, ScrollView, StyleSheet } from 'react-native';
import { getNext7Days, formatDate, getDayOfWeek, isToday } from '../utils/date';
import { colors } from '../constants/colors';

interface DateTabsProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export const DateTabs: React.FC<DateTabsProps> = ({ selectedDate, onDateChange }) => {
  const dates = useMemo(() => getNext7Days(), []);

  const handlePress = useCallback(
    (date: string) => {
      onDateChange(date);
    },
    [onDateChange]
  );

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {dates.map((date) => {
        const isSelected = date === selectedDate;
        const today = isToday(date);
        return (
          <TouchableOpacity
            key={date}
            style={[styles.tab, isSelected && styles.selectedTab]}
            onPress={() => handlePress(date)}
          >
            <Text style={[styles.month, isSelected && styles.selectedText]}>
              {new Date(date + 'T00:00:00').getMonth() + 1}月
            </Text>
            <Text style={[styles.day, isSelected && styles.selectedText]}>
              {getDayOfWeek(date)}
            </Text>
            <Text style={[styles.date, isSelected && styles.selectedText]}>
              {new Date(date + 'T00:00:00').getDate()}
            </Text>
            {today && !isSelected && <View style={styles.todayDot} />}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedTab: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  month: {
    fontSize: 11,
    color: colors.textTertiary,
    fontWeight: '600',
  },
  day: {
    fontSize: 12,
    color: colors.textSecondary,
    marginVertical: 2,
    fontWeight: '600',
  },
  date: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  selectedText: {
    color: '#fff',
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
});
