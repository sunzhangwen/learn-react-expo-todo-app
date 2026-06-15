import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TaskForm } from '../src/components/TaskForm';
import { useTasks } from '../src/hooks/useTasks';
import * as taskService from '../src/services/taskService';
import { colors } from '../src/constants/colors';
import { Task } from '../src/types/task';

export default function TaskFormPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode: string; id?: string; date?: string }>();
  const { create, update } = useTasks();
  const [initialTask, setInitialTask] = useState<Task | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const mode = params.mode || 'create';
  const isEdit = mode === 'edit';

  useEffect(() => {
    if (isEdit && params.id) {
      setLoading(true);
      taskService
        .getTaskById(params.id)
        .then(setInitialTask)
        .catch((e) => Alert.alert('错误', e.message))
        .finally(() => setLoading(false));
    }
  }, [isEdit, params.id]);

  const handleSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      if (isEdit && initialTask) {
        await update(initialTask.id, data);
        Alert.alert('成功', '任务已更新');
      } else {
        await create(data);
        Alert.alert('成功', '任务已创建');
      }
      router.back();
    } catch (e: any) {
      Alert.alert('错误', e.message || '操作失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>加载中...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} disabled={submitting}>
          <Text style={styles.headerButtonText}>取消</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEdit ? '编辑任务' : '添加任务'}</Text>
        <View style={styles.spacer} />
      </View>
      <TaskForm
        initialData={initialTask || undefined}
        initialDate={params.date}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        submitting={submitting}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  headerButtonText: {
    fontSize: 16,
    color: colors.textTertiary,
    fontWeight: '600',
  },
  spacer: {
    width: 60,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 40,
    color: colors.textSecondary,
  },
});
