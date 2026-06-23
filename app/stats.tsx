import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryCards } from '@/components/CategoryCards';
import { ErrorState } from '@/components/ErrorState';
import { Loading } from '@/components/Loading';
import { StatsRow } from '@/components/StatsRow';
import { useTheme } from '@/hooks/useTheme';
import { useUserProfile } from '@/hooks/useUserProfile';

/** 数据统计页面 */
export default function StatsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, loading, error, refresh } = useUserProfile();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>数据统计</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <Loading />
      ) : error && !user ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : user ? (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>任务概览</Text>
          <StatsRow
            items={[
              { label: '今日待办', value: user.stats.todayPending, icon: 'today-outline', color: colors.primary },
              { label: '发布事项', value: user.stats.totalPublished, icon: 'document-text-outline', color: colors.textSecondary },
              { label: '已完成', value: user.stats.totalCompleted, icon: 'checkmark-circle-outline', color: colors.success },
            ]}
          />

          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>分类统计</Text>
          <CategoryCards counts={user.categories} />
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
});
