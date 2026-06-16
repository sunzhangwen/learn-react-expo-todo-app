import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Loading } from '@/components/Loading';
import { getCategoryMeta } from '@/constants/categories';
import { colors } from '@/constants/colors';
import { deleteTask, getTaskById, updateTaskStatus } from '@/services/taskService';
import type { Task } from '@/types/task';
import { formatDateLabel } from '@/utils/date';

/** 任务详情页（需求第 10 节）。 */
export default function TaskDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const res = await getTaskById(id);
      if (!res.data) {
        setNotFound(true);
        setTask(null);
      } else {
        setTask(res.data);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载任务失败');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // 聚焦刷新：编辑返回后展示最新数据。
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const handleToggle = useCallback(async () => {
    if (!task) {
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = task.status === 'completed' ? 'pending' : 'completed';
    try {
      const res = await updateTaskStatus(task.id, next);
      setTask(res.data);
    } catch (e) {
      Alert.alert('操作失败', e instanceof Error ? e.message : '请稍后重试');
    }
  }, [task]);

  const handleDelete = useCallback(() => {
    if (!task) {
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('删除任务', `确定删除「${task.title}」吗？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTask(task.id);
            router.back();
          } catch (e) {
            Alert.alert('删除失败', e instanceof Error ? e.message : '请稍后重试');
          }
        },
      },
    ]);
  }, [task, router]);

  const handleEdit = useCallback(() => {
    if (task) {
      router.push(`/task-form?mode=edit&id=${task.id}`);
    }
  }, [task, router]);

  const renderBody = () => {
    if (loading) {
      return <Loading />;
    }
    if (error) {
      return <ErrorState message={error} onRetry={load} />;
    }
    if (notFound || !task) {
      return <EmptyState icon="search-outline" message="任务不存在" />;
    }

    const category = getCategoryMeta(task.category);
    const completed = task.status === 'completed';

    return (
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[`${category.color}15`, `${category.color}05`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.titleGradient}
        >
          <View style={styles.titleRow}>
            <Text style={styles.title}>{task.title}</Text>
            <View style={[styles.categoryTag, { backgroundColor: `${category.color}1A` }]}>
              <Text style={[styles.categoryText, { color: category.color }]}>{category.label}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.card}>
          <DetailRow icon="calendar-outline" label="日期" value={formatDateLabel(task.date)} />
          <DetailRow icon="time-outline" label="开始时间" value={task.startTime} />
          <DetailRow icon="time-outline" label="结束时间" value={task.endTime || '未设置'} />
          <DetailRow icon="location-outline" label="地点" value={task.location || '未设置'} />
          <DetailRow icon="document-text-outline" label="备注" value={task.note || '无'} />
          <DetailRow
            icon={completed ? 'checkmark-circle' : 'ellipse-outline'}
            label="完成状态"
            value={completed ? '已完成' : '待办'}
            valueColor={completed ? colors.success : colors.warning}
          />
          <DetailRow icon="add-circle-outline" label="创建时间" value={formatDateTime(task.createdAt)} />
          <DetailRow icon="refresh-outline" label="更新时间" value={formatDateTime(task.updatedAt)} last />
        </View>

        <TouchableOpacity style={styles.toggleButton} onPress={handleToggle} activeOpacity={0.85}>
          <Ionicons
            name={completed ? 'arrow-undo-outline' : 'checkmark-done-outline'}
            size={18}
            color={colors.primary}
          />
          <Text style={styles.toggleButtonText}>
            {completed ? '标记为待办' : '标记为已完成'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>任务详情</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleEdit} hitSlop={8} disabled={!task}>
            <Ionicons name="create-outline" size={22} color={task ? colors.primary : colors.border} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} hitSlop={8} disabled={!task}>
            <Ionicons name="trash-outline" size={22} color={task ? colors.warning : colors.border} />
          </TouchableOpacity>
        </View>
      </View>

      {renderBody()}
    </SafeAreaView>
  );
}

type DetailRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  valueColor?: string;
  last?: boolean;
};

function DetailRow({ icon, label, value, valueColor, last }: DetailRowProps) {
  return (
    <View style={[styles.detailRow, !last && styles.detailRowBorder]}>
      <Ionicons name={icon} size={18} color={colors.textTertiary} />
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, valueColor ? { color: valueColor } : null]} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return iso;
  }
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 16,
  },
  titleGradient: {
    borderRadius: 8,
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  categoryTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 10,
  },
  detailRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    width: 72,
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'right',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  toggleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
});
