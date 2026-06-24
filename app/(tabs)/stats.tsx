import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryCards } from '@/components/CategoryCards';
import { ErrorState } from '@/components/ErrorState';
import { Loading } from '@/components/Loading';
import { StatsRow } from '@/components/StatsRow';
import { colors } from '@/constants/colors';
import { globalStyles } from '@/constants/styles';
import { useUserProfile } from '@/hooks/useUserProfile';

/** 数据统计页。从"我的"菜单进入。 */
export default function StatsScreen() {
  const router = useRouter();
  const { user, loading, error, refresh } = useUserProfile();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return (
    <SafeAreaView style={globalStyles.safe} edges={['top']}>
      <View style={globalStyles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={globalStyles.headerTitle}>数据统计</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <Loading />
      ) : error && !user ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : user ? (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={globalStyles.sectionTitle}>任务概况</Text>
            <StatsRow
              items={[
                { label: '今日待办', value: user.stats.todayPending },
                { label: '发布事项', value: user.stats.totalPublished },
                { label: '已完成', value: user.stats.totalCompleted, color: colors.success },
              ]}
            />
          </View>

          <View style={styles.section}>
            <Text style={globalStyles.sectionTitle}>分类统计</Text>
            <CategoryCards counts={user.categories} />
          </View>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 24,
  },
  section: {
    gap: 10,
  },
});
