import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DateTabs } from '@/components/DateTabs';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Loading } from '@/components/Loading';
import { TaskCard } from '@/components/TaskCard';
import { globalStyles } from '@/constants/styles';
import { useTasks } from '@/hooks/useTasks';
import { useTheme } from '@/hooks/useTheme';
import type { Task } from '@/types/task';
import { alert, confirmAsync } from '@/utils/alert';
import { formatDateLabel, getToday, isToday } from '@/utils/date';

/** 任务列表页（需求第 7 节）。 */
export default function TasksScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(getToday());
  const { colors } = useTheme();
  const { tasks, loading, refreshing, error, refresh, toggleStatus, remove } =
    useTasks(selectedDate);

  // 页面聚焦刷新（需求第 3 节）。
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const handleOpen = useCallback(
    (task: Task) => router.push(`/task-detail/${task.id}`),
    [router],
  );

  const handleToggle = useCallback((task: Task) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleStatus(task.id);
  }, [toggleStatus]);

  const handleLongPress = useCallback(
    (task: Task) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      confirmAsync('删除任务', `确定删除「${task.title}」吗？`, () => {
        remove(task.id).catch((e) => {
          alert('删除失败', e instanceof Error ? e.message : '请稍后重试');
        });
      });
    },
    [remove],
  );

  const handleCreate = useCallback(
    () => router.push(`/task-form?mode=create&date=${selectedDate}`),
    [router, selectedDate],
  );

  const renderItem = useCallback(
    ({ item }: { item: Task }) => (
      <TaskCard
        task={item}
        onPress={handleOpen}
        onLongPress={handleLongPress}
        onToggleStatus={handleToggle}
      />
    ),
    [handleOpen, handleLongPress, handleToggle],
  );

  return (
    <SafeAreaView style={[globalStyles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[globalStyles.header, { borderBottomColor: colors.border }]}>
        <Text style={[globalStyles.headerTitle, { color: colors.textPrimary }]}>{isToday(selectedDate) ? '今天' : selectedDate}</Text>
      </View>

      <DateTabs selectedDate={selectedDate} onSelect={setSelectedDate} />

      <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>{formatDateLabel(selectedDate)}</Text>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={<EmptyState message="当天暂无任务" />}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          initialNumToRender={6}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />
          }
        />
      )}

      {/* 悬浮新增按钮（需求第 14 节） */}
      <TouchableOpacity style={styles.fab} onPress={handleCreate} activeOpacity={0.85}>
        <LinearGradient
          colors={colors.gradient.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dateLabel: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
    fontSize: 13,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    flexGrow: 1,
  },
  separator: {
    height: 10,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.2)',
  },
  fabGradient: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
});
