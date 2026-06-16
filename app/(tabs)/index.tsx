import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Loading } from '@/components/Loading';
import { StatsRow } from '@/components/StatsRow';
import { TaskCard } from '@/components/TaskCard';
import { colors } from '@/constants/colors';
import { globalStyles } from '@/constants/styles';
import { useTasks } from '@/hooks/useTasks';
import type { Task } from '@/types/task';
import { getToday } from '@/utils/date';

/** 首页（需求第 6 节）。 */
export default function HomeScreen() {
  const router = useRouter();
  const { tasks, loading, error, refresh, toggleStatus } = useTasks();

  // 页面聚焦时刷新统计（需求第 3 节 useFocusEffect）。
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const today = getToday();

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const pending = total - completed;
    const todayPending = tasks.filter(
      (t) => t.date === today && t.status === 'pending',
    ).length;
    return { total, completed, pending, todayPending };
  }, [tasks, today]);

  // 最近任务：按更新时间倒序取前 5 条。
  const recentTasks = useMemo(
    () =>
      [...tasks]
        .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
        .slice(0, 5),
    [tasks],
  );

  // 重点任务：今天标记为重点的待办任务列表。
  const featuredTasks = useMemo(
    () => tasks.filter((t) => t.date === today && t.isFeatured && t.status === 'pending'),
    [tasks, today],
  );

  const handleOpenTask = useCallback(
    (task: Task) => router.push(`/task-detail/${task.id}`),
    [router],
  );
  const handleToggle = useCallback((task: Task) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleStatus(task.id);
  }, [toggleStatus]);
  const handleCreate = useCallback(
    () => router.push(`/task-form?mode=create&date=${today}`),
    [router, today],
  );

  return (
    <SafeAreaView style={globalStyles.safe} edges={['top']}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.headerTitle}>首页</Text>
        <TouchableOpacity onPress={handleCreate} hitSlop={8}>
          <Ionicons name="add-circle" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : (
        <ScrollView contentContainerStyle={globalStyles.content} showsVerticalScrollIndicator={false}>
          <StatsRow
            items={[
              { label: '总任务', value: stats.total },
              { label: '已完成', value: stats.completed, color: colors.success },
              { label: '未完成', value: stats.pending, color: colors.warning },
              { label: '今日待办', value: stats.todayPending },
            ]}
          />

          {featuredTasks.length > 0 ? (
            <View style={styles.section}>
              <Text style={globalStyles.sectionTitle}>重点任务</Text>
              <View style={styles.list}>
                {featuredTasks.map((task) => (
                  <TouchableOpacity
                    key={task.id}
                    style={styles.featuredCard}
                    onPress={() => handleOpenTask(task)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="star" size={20} color={colors.warning} />
                    <View style={styles.featuredBody}>
                      <Text style={globalStyles.textPrimary} numberOfLines={1}>
                        {task.title}
                      </Text>
                      <Text style={globalStyles.textSecondary}>{task.startTime} 开始</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : null}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={globalStyles.sectionTitle}>最近任务</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/tasks')} hitSlop={8}>
                <Text style={styles.link}>查看全部</Text>
              </TouchableOpacity>
            </View>

            {recentTasks.length === 0 ? (
              <EmptyState message="暂无任务，点击右上角添加" />
            ) : (
              <View style={styles.list}>
                {recentTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onPress={handleOpenTask}
                    onLongPress={handleOpenTask}
                    onToggleStatus={handleToggle}
                  />
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleCreate} activeOpacity={0.85}>
            <LinearGradient
              colors={[colors.primary, '#6C5CE7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryButtonGradient}
            >
              <Ionicons name="add" size={20} color={colors.surface} />
              <Text style={globalStyles.primaryButtonText}>新增任务</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  link: {
    fontSize: 13,
    color: colors.primary,
  },
  list: {
    gap: 10,
  },
  featuredCard: {
    flexDirection: 'row',
    alignItems: 'center',
    ...globalStyles.card,
    padding: 14,
    gap: 12,
  },
  featuredBody: {
    flex: 1,
    gap: 4,
  },
  primaryButton: {
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
  },
});
