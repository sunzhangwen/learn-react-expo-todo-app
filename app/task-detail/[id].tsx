import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as taskService from '../../src/services/taskService';
import { Task } from '../../src/types/task';
import { colors, categoryColors, categoryNames } from '../../src/constants/colors';
import { getDateDisplay } from '../../src/utils/date';
import { useTasks } from '../../src/hooks/useTasks';

export default function TaskDetail() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { toggleStatus, remove } = useTasks();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadTask();
    }
  }, [params.id]);

  const loadTask = async () => {
    try {
      const t = await taskService.getTaskById(params.id!);
      setTask(t);
    } catch (e: any) {
      Alert.alert('错误', e.message || '加载失败');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!task) return;
    setUpdating(true);
    try {
      await toggleStatus(task.id);
      await loadTask();
      Alert.alert('成功', '状态已更新');
    } catch (e: any) {
      Alert.alert('错误', e.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleEdit = () => {
    router.push({ pathname: '/task-form', params: { mode: 'edit', id: task?.id } });
  };

  const handleDelete = () => {
    Alert.alert('删除任务', '确定要删除这个任务吗？', [
      { text: '取消', onPress: () => {} },
      {
        text: '删除',
        onPress: async () => {
          setUpdating(true);
          try {
            await remove(task!.id);
            Alert.alert('成功', '任务已删除');
            router.back();
          } catch (e: any) {
            Alert.alert('错误', e.message);
          } finally {
            setUpdating(false);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 40 }}>加载中...</Text>
      </SafeAreaView>
    );
  }

  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 40, color: colors.textSecondary }}>
          任务不存在
        </Text>
      </SafeAreaView>
    );
  }

  const catColor = categoryColors[task.category];
  const isCompleted = task.status === 'completed';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} disabled={updating}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>任务详情</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding}>
        {/* 标题 */}
        <View style={styles.section}>
          <Text style={[styles.title, isCompleted && styles.completedTitle]}>{task.title}</Text>
        </View>

        {/* 基本信息 */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>分类</Text>
            <View style={[styles.badge, { backgroundColor: catColor }]}>
              <Text style={styles.badgeText}>{categoryNames[task.category]}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>日期</Text>
            <Text style={styles.value}>{getDateDisplay(task.date)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>开始时间</Text>
            <Text style={styles.value}>{task.startTime}</Text>
          </View>

          {task.endTime && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>结束时间</Text>
              <Text style={styles.value}>{task.endTime}</Text>
            </View>
          )}

          {task.location && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>地点</Text>
              <Text style={styles.value}>{task.location}</Text>
            </View>
          )}

          {task.note && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>备注</Text>
              <Text style={styles.value}>{task.note}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.label}>状态</Text>
            <Text style={[styles.value, isCompleted && styles.completedStatus]}>
              {isCompleted ? '已完成' : '待完成'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>创建于</Text>
            <Text style={styles.timeText}>{new Date(task.createdAt).toLocaleString()}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>更新于</Text>
            <Text style={styles.timeText}>{new Date(task.updatedAt).toLocaleString()}</Text>
          </View>
        </View>
      </ScrollView>

      {/* 底部按钮 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerButton, styles.toggleButton]}
          onPress={handleToggleStatus}
          disabled={updating}
        >
          <Ionicons
            name={isCompleted ? 'close-circle' : 'checkmark-circle'}
            size={20}
            color="#fff"
          />
          <Text style={styles.footerButtonText}>
            {isCompleted ? '标记待完成' : '标记完成'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.footerButton, styles.editButton]}
          onPress={handleEdit}
          disabled={updating}
        >
          <Ionicons name="pencil" size={20} color="#fff" />
          <Text style={styles.footerButtonText}>编辑</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.footerButton, styles.deleteButton]}
          onPress={handleDelete}
          disabled={updating}
        >
          <Ionicons name="trash" size={20} color="#fff" />
          <Text style={styles.footerButtonText}>删除</Text>
        </TouchableOpacity>
      </View>
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
  spacer: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  section: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  value: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  completedStatus: {
    color: colors.success,
  },
  timeText: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  footerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  toggleButton: {
    backgroundColor: colors.success,
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.warning,
  },
  footerButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
});
