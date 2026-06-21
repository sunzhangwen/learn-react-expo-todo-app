import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';

export type StatItem = {
  label: string;
  value: number;
  color?: string;
  icon?: keyof typeof Ionicons.glyphMap;
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
          {item.icon && (
            <View style={[styles.iconContainer, item.color ? { backgroundColor: `${item.color}15` } : null]}>
              <Ionicons name={item.icon} size={16} color={item.color || colors.primary} />
            </View>
          )}
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
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: `${colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
