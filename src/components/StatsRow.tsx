import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';

export type StatItem = {
  label: string;
  value: number;
  color?: string;
};

type StatsRowProps = {
  items: StatItem[];
};

/** 统计数字卡片行（首页 / 我的页面共用）。 */
export function StatsRow({ items }: StatsRowProps) {
  return (
    <View style={styles.row}>
      {items.map((item) => (
        <View key={item.label} style={styles.card}>
          <Text style={[styles.value, item.color ? { color: item.color } : null]}>
            {item.value}
          </Text>
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textSecondary,
  },
});
