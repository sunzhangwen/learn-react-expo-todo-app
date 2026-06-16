import { StyleSheet, Text, View } from 'react-native';

import { CATEGORIES } from '@/constants/categories';
import { colors } from '@/constants/colors';
import { globalStyles } from '@/constants/styles';

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
          <View style={[styles.dot, { backgroundColor: category.color }]} />
          <Text style={styles.count}>{counts[category.key]}</Text>
          <Text style={globalStyles.textSecondary}>{category.label}</Text>
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
    ...globalStyles.card,
    paddingVertical: 16,
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  count: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
