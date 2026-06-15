import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../../src/hooks/useTasks';
import { useUserProfile } from '../../src/hooks/useUserProfile';
import { TaskCard } from '../../src/components/TaskCard';
import { Loading } from '../../src/components/Loading';
import { EmptyState } from '../../src/components/EmptyState';
import { ErrorState } from '../../src/components/ErrorState';
import { colors } from '../../src/constants/colors';

export default function Home() {
  const router = useRouter();
  const { tasks, loading, error, refresh } = useTasks();
  const { user } = useUserProfile();

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayTasks = tasks.filter((t) => t.date === today);
    const completed = tasks.filter((t) => t.status === 'completed');
    const pending = tasks.filter((t) => t.status === 'pending');

    return {
      total: tasks.length,
      completed: completed.length,
      pending: pending.length,
      today: todayTasks.length,
    };
  }, [tasks]);

  const recentTasks = useMemo(() => {
    return tasks.slice(0, 3);
  }, [tasks]);

  const handleNewTask = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    router.push({ pathname: '/task-form', params: { mode: 'create', date: today } });
  }, [router]);

  const handleTaskPress = useCallback(
    (taskId: string) => {
      router.push({ pathname: '/task-detail/[id]', params: { id: taskId } });
    },
    [router]
  );

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={refresh} />;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <FlatList
        data={[1]}
        renderItem={() => (
          <>
            {/* 标题 */}
            <View style={styles.header}>
              <Text style={styles.title}>首页</Text>
              {user && <Text style={styles.userName}>{user.name}</Text>}
            </View>

            {/* 统计卡片 */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.total}</Text>
                <Text style={styles.statLabel}>总任务</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.completed}</Text>
                <Text style={styles.statLabel}>已完成</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.pending}</Text>
                <Text style={styles.statLabel}>待完成</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.today}</Text>
                <Text style={styles.statLabel}>今日待办</Text>
              </View>
            </View>

            {/* 最近任务 */}
            {recentTasks.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>最近任务</Text>
                {recentTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onPress={() => handleTaskPress(task.id)}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptyBox}>
                <Ionicons name="checkbox-outline" size={48} color={colors.textTertiary} />
                <Text style={styles.emptyText}>暂无任务</Text>
              </View>
            )}

            {/* 快捷按钮 */}
            <View style={styles.quickButtons}>
              <TouchableOpacity
                style={[styles.quickButton, styles.qb1]}
                onPress={() => router.push('/(tabs)/tasks')}
              >
                <Ionicons name="list" size={20} color={colors.primary} />
                <Text style={styles.quickButtonText}>查看全部</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.quickButton, styles.qb2]} onPress={handleNewTask}>
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={[styles.quickButtonText, { color: '#fff' }]}>新增任务</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        keyExtractor={() => 'home'}
        scrollEnabled={true}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userName: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  emptyBox: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 40,
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  quickButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  quickButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  qb1: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  qb2: {
    backgroundColor: colors.primary,
  },
  quickButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});
