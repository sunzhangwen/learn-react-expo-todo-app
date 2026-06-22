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
import { globalStyles } from '@/constants/styles';
import { useTasks } from '@/hooks/useTasks';
import { useTheme } from '@/hooks/useTheme';
import type { Task } from '@/types/task';
import { getToday } from '@/utils/date';

/** 首页（需求第 6 节）。 */
export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
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
    <SafeAreaView style={[globalStyles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[globalStyles.header, { borderBottomColor: colors.border }]}>
        <Text style={[globalStyles.headerTitle, { color: colors.textPrimary }]}>首页</Text>
        <TouchableOpacity onPress={handleCreate} hitSlop={8}>
          <Ionicons name="add-circle" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <StatsRow
            items={[
              { label: '总任务', value: stats.total, icon: 'layers-outline' },
              { label: '已完成', value: stats.completed, icon: 'checkmark-circle-outline', color: colors.success },
              { label: '未完成', value: stats.pending, icon: 'time-outline', color: colors.warning },
              { label: '今日待办', value: stats.todayPending, icon: 'today-outline' },
            ]}
          />

          {featuredTasks.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="star" size={18} color={colors.warning} />
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>重点任务</Text>
                </View>
                <Text style={[styles.badge, { color: colors.warning, backgroundColor: `${colors.warning}15` }]}>{featuredTasks.length}</Text>
              </View>
              <View style={styles.list}>
                {featuredTasks.map((task) => (
                  <TouchableOpacity
                    key={task.id}
                    style={styles.featuredCard}
                    onPress={() => handleOpenTask(task)}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={[`${colors.warning}15`, `${colors.warning}05`]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.featuredGradient}
                    >
                      <View style={[styles.featuredIcon, { backgroundColor: `${colors.warning}20` }]}>
                        <Ionicons name="star" size={18} color={colors.warning} />
                      </View>
                      <View style={styles.featuredBody}>
                        <Text style={[styles.featuredTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                          {task.title}
                        </Text>
                        <View style={styles.featuredMeta}>
                          <Ionicons name="time-outline" size={12} color={colors.textTertiary} />
                          <Text style={[styles.featuredTime, { color: colors.textTertiary }]}>{task.startTime} 开始</Text>
                        </View>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : null}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>最近任务</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/tasks')} hitSlop={8}>
                <View style={styles.viewAllButton}>
                  <Text style={[styles.viewAllText, { color: colors.primary }]}>查看全部</Text>
                  <Ionicons name="arrow-forward" size={14} color={colors.primary} />
                </View>
              </TouchableOpacity>
            </View>

            {recentTasks.length === 0 ? (
              <EmptyState
                icon="clipboard-outline"
                message="暂无任务"
                submessage="点击下方按钮创建你的第一个任务"
              />
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
              colors={colors.gradient.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryButtonGradient}
            >
              <Ionicons name="add" size={22} color={colors.surface} />
              <Text style={styles.primaryButtonText}>新增任务</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 20,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  badge: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  list: {
    gap: 10,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  featuredCard: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  featuredGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  featuredIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredBody: {
    flex: 1,
    gap: 4,
  },
  featuredTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featuredTime: {
    fontSize: 12,
  },
  primaryButton: {
    height: 52,
    borderRadius: 14,
    overflow: 'hidden',
    boxShadow: '0px 4px 16px rgba(64, 128, 255, 0.3)',
  },
  primaryButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
