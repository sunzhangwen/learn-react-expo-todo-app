import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../../src/hooks/useTasks';
import { TaskCard } from '../../src/components/TaskCard';
import { Loading } from '../../src/components/Loading';
import { EmptyState } from '../../src/components/EmptyState';
import { ErrorState } from '../../src/components/ErrorState';
import { DateTabs } from '../../src/components/DateTabs';
import { colors } from '../../src/constants/colors';
import { getDateDisplay } from '../../src/utils/date';

export default function TasksPage() {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const { tasks, loading, refreshing, error, refresh, toggleStatus, remove } =
    useTasks(selectedDate);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const handleTaskPress = useCallback(
    (task: any) => {
      router.push({ pathname: '/task-detail/[id]', params: { id: task.id } });
    },
    [router]
  );

  const handleNewTask = useCallback(() => {
    router.push({ pathname: '/task-form', params: { mode: 'create', date: selectedDate } });
  }, [router, selectedDate]);

  const handleTaskLongPress = useCallback((taskId: string) => {
    setSelectedTask(taskId);
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['取消', '删除'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
        },
        (idx) => {
          if (idx === 1) {
            handleDelete(taskId);
          }
        }
      );
    } else {
      Alert.alert('删除任务', '确定要删除这个任务吗？', [
        { text: '取消' },
        { text: '删除', onPress: () => handleDelete(taskId) },
      ]);
    }
  }, []);

  const handleDelete = async (taskId: string) => {
    try {
      await remove(taskId);
      Alert.alert('成功', '任务已删除');
    } catch (e: any) {
      Alert.alert('错误', e.message);
    }
  };

  const handleToggle = useCallback(
    async (taskId: string) => {
      try {
        await toggleStatus(taskId);
      } catch (e: any) {
        Alert.alert('错误', e.message);
      }
    },
    [toggleStatus]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* 标题和操作 */}
      <View style={styles.header}>
        <Text style={styles.title}>{selectedDate === today ? '今天' : '选定日期'}</Text>
      </View>

      {/* 日期标签栏 */}
      <DateTabs selectedDate={selectedDate} onDateChange={setSelectedDate} />

      {/* 日期说明 */}
      <Text style={styles.dateDisplay}>{getDateDisplay(selectedDate)}</Text>

      {/* 任务列表 */}
      {loading && !refreshing ? (
        <Loading />
      ) : error && tasks.length === 0 ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : tasks.length === 0 ? (
        <View style={{ flex: 1 }}>
          <EmptyState icon="checkmark-circle-outline" message="暂无任务" />
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onPress={handleTaskPress}
              onLongPress={() => handleTaskLongPress(item.id)}
              onToggleStatus={handleToggle}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={refresh}
        />
      )}

      {/* 悬浮新增按钮 */}
      <TouchableOpacity style={styles.fab} onPress={handleNewTask} activeOpacity={0.7}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dateDisplay: {
    paddingHorizontal: 20,
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
});
