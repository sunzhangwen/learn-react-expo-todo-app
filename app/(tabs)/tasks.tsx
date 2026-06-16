import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';
import {
  Alert,
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
import { colors } from '@/constants/colors';
import { useTasks } from '@/hooks/useTasks';
import type { Task } from '@/types/task';
import { formatDateLabel, getToday, isToday } from '@/utils/date';

/** 任务列表页（需求第 7 节）。 */
export default function TasksScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(getToday());
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
      Alert.alert('删除任务', `确定删除「${task.title}」吗？`, [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              await remove(task.id);
            } catch (e) {
              Alert.alert('删除失败', e instanceof Error ? e.message : '请稍后重试');
            }
          },
        },
      ]);
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
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{isToday(selectedDate) ? '今天' : selectedDate}</Text>
      </View>

      <DateTabs selectedDate={selectedDate} onSelect={setSelectedDate} />

      <Text style={styles.dateLabel}>{formatDateLabel(selectedDate)}</Text>

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
          colors={[colors.primary, '#6C5CE7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={32} color={colors.surface} />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dateLabel: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
    fontSize: 13,
    color: colors.textSecondary,
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
