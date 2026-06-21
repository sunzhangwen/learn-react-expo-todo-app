import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { CATEGORIES } from '@/constants/categories';
import { colors } from '@/constants/colors';

type CategoryCardsProps = {
  counts: {
    work: number;
    personal: number;
    activity: number;
  };
};

/** 分类统计卡片（需求第 11 节：工作/个人/活动事项数量）。 */
export function CategoryCards({ counts }: CategoryCardsProps) {
  return (
    <View style={styles.row}>
      {CATEGORIES.map((category) => (
        <View key={category.key} style={styles.card}>
          <View style={[styles.iconContainer, { backgroundColor: `${category.color}15` }]}>
            <Ionicons name={category.icon} size={20} color={category.color} />
          </View>
          <Text style={[styles.count, { color: category.color }]}>{counts[category.key]}</Text>
          <Text style={styles.label}>{category.label}</Text>
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
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  count: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  label: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
