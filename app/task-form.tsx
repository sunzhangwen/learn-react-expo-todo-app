import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Loading } from '@/components/Loading';
import { TaskForm, type TaskFormHandle, type TaskFormInitial } from '@/components/TaskForm';
import { colors } from '@/constants/colors';
import { globalStyles } from '@/constants/styles';
import { createTask, getTaskById, updateTask } from '@/services/taskService';
import type { TaskPayload } from '@/types/task';
import { getToday } from '@/utils/date';

/** 任务表单页（需求第 9 节）：新增与编辑共用。 */
export default function TaskFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string; date?: string; id?: string }>();
  const mode = params.mode === 'edit' ? 'edit' : 'create';

  const formRef = useRef<TaskFormHandle>(null);
  const [initial, setInitial] = useState<TaskFormInitial | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 初始化表单初值（需求第 9 节路由参数处理，useEffect）。
  useEffect(() => {
    let active = true;
    async function init() {
      if (mode === 'create') {
        setInitial({ date: params.date ?? getToday(), status: 'pending' });
        return;
      }
      if (!params.id) {
        setLoadError('缺少任务 ID');
        return;
      }
      try {
        const res = await getTaskById(params.id);
        if (!active) {
          return;
        }
        if (!res.data) {
          setLoadError('任务不存在');
          return;
        }
        const t = res.data;
        setInitial({
          title: t.title,
          category: t.category,
          startTime: t.startTime,
          endTime: t.endTime,
          location: t.location,
          note: t.note,
          date: t.date,
          status: t.status,
        });
      } catch (e) {
        if (active) {
          setLoadError(e instanceof Error ? e.message : '加载任务失败');
        }
      }
    }
    init();
    return () => {
      active = false;
    };
  }, [mode, params.id, params.date]);

  const handleSubmit = useCallback(
    async (payload: TaskPayload) => {
      setSubmitting(true);
      try {
        if (mode === 'create') {
          await createTask(payload);
        } else if (params.id) {
          await updateTask(params.id, payload);
        }
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // 成功后返回上一页；任务列表与首页通过 useFocusEffect 自动刷新。
        router.back();
      } catch (e) {
        // 失败后保留表单内容并提示。
        Alert.alert('保存失败', e instanceof Error ? e.message : '请稍后重试');
      } finally {
        setSubmitting(false);
      }
    },
    [mode, params.id, router],
  );

  const submitLabel = mode === 'create' ? '保存任务' : '保存修改';

  return (
    <SafeAreaView style={globalStyles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8} disabled={submitting}>
          <Text style={styles.headerSide}>取消</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{mode === 'create' ? '添加任务' : '编辑任务'}</Text>
        <TouchableOpacity
          onPress={() => formRef.current?.submit()}
          hitSlop={8}
          disabled={submitting || !initial}
        >
          <Text style={[styles.headerSide, styles.headerDone]}>完成</Text>
        </TouchableOpacity>
      </View>

      {loadError ? (
        <View style={styles.center}>
          <Text style={globalStyles.errorText}>{loadError}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>返回</Text>
          </TouchableOpacity>
        </View>
      ) : !initial ? (
        <Loading />
      ) : (
        <KeyboardAvoidingView
          style={globalStyles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={globalStyles.flex}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <TaskForm
              ref={formRef}
              initial={initial}
              submitting={submitting}
              submitLabel={submitLabel}
              onSubmit={handleSubmit}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSide: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  headerDone: {
    color: colors.primary,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  backButtonText: {
    color: colors.surface,
    fontWeight: '600',
  },
});
