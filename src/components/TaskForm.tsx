import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react';
import { StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { CATEGORIES } from '@/constants/categories';
import { colors } from '@/constants/colors';
import { DEFAULT_TASK_CATEGORY } from '@/constants/config';
import type { TaskCategory, TaskPayload, TaskStatus } from '@/types/task';
import {
  LOCATION_MAX_LENGTH,
  NOTE_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  hasErrors,
  validateTaskForm,
  type TaskFormValues,
} from '@/utils/validators';

export type TaskFormInitial = {
  title?: string;
  category?: TaskCategory;
  startTime?: string;
  endTime?: string;
  location?: string;
  note?: string;
  date: string;
  status?: TaskStatus;
  isFeatured?: boolean;
};

type TaskFormProps = {
  initial: TaskFormInitial;
  submitting: boolean;
  submitLabel: string;
  onSubmit: (payload: TaskPayload) => void;
};

export type TaskFormHandle = {
  submit: () => void;
};

/**
 * 任务表单组件（需求第 9、20 节）。
 * 接收初始值、提交状态、提交回调；内部完成字段校验。
 * 通过 ref 暴露 submit()，供页面顶部“完成”按钮调用。
 */
export const TaskForm = forwardRef<TaskFormHandle, TaskFormProps>(function TaskForm(
  { initial, submitting, submitLabel, onSubmit },
  ref,
) {
  const [title, setTitle] = useState(initial.title ?? '');
  const [category, setCategory] = useState<TaskCategory>(
    initial.category ?? DEFAULT_TASK_CATEGORY,
  );
  const [startTime, setStartTime] = useState(initial.startTime ?? '');
  const [endTime, setEndTime] = useState(initial.endTime ?? '');
  const [location, setLocation] = useState(initial.location ?? '');
  const [note, setNote] = useState(initial.note ?? '');
  const [isFeatured, setIsFeatured] = useState(initial.isFeatured ?? false);
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormValues, string>>>({});

  const handleSubmit = useCallback(() => {
    const values: TaskFormValues = { title, startTime, endTime, location, note };
    const nextErrors = validateTaskForm(values);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      return;
    }
    onSubmit({
      title: title.trim(),
      category,
      startTime: startTime.trim(),
      endTime: endTime.trim() || undefined,
      location: location.trim() || undefined,
      note: note.trim() || undefined,
      date: initial.date,
      status: initial.status ?? 'pending',
      isFeatured,
    });
  }, [title, category, startTime, endTime, location, note, isFeatured, initial, onSubmit]);

  useImperativeHandle(ref, () => ({ submit: handleSubmit }), [handleSubmit]);

  const titleCounter = useMemo(() => `${title.length}/${TITLE_MAX_LENGTH}`, [title]);

  return (
    <View style={styles.container}>
      {/* 任务标题 */}
      <Field label="任务标题" required error={errors.title}>
        <TextInput
          style={styles.input}
          placeholder="请输入任务标题"
          placeholderTextColor={colors.textTertiary}
          value={title}
          maxLength={TITLE_MAX_LENGTH}
          onChangeText={setTitle}
        />
        <Text style={styles.counter}>{titleCounter}</Text>
      </Field>

      {/* 任务分类 */}
      <Field label="任务分类" required>
        <View style={styles.categoryRow}>
          {CATEGORIES.map((item) => {
            const active = item.key === category;
            return (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.categoryChip,
                  active && { backgroundColor: item.color, borderColor: item.color },
                ]}
                onPress={() => setCategory(item.key)}
                activeOpacity={0.8}
              >
                <Text style={[styles.categoryChipText, active && styles.categoryChipTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Field>

      {/* 时间 */}
      <View style={styles.timeRow}>
        <View style={styles.timeCol}>
          <Field label="开始时间" required error={errors.startTime}>
            <TextInput
              style={styles.input}
              placeholder="HH:mm"
              placeholderTextColor={colors.textTertiary}
              value={startTime}
              maxLength={5}
              onChangeText={setStartTime}
            />
          </Field>
        </View>
        <View style={styles.timeCol}>
          <Field label="结束时间" error={errors.endTime}>
            <TextInput
              style={styles.input}
              placeholder="HH:mm（选填）"
              placeholderTextColor={colors.textTertiary}
              value={endTime}
              maxLength={5}
              onChangeText={setEndTime}
            />
          </Field>
        </View>
      </View>

      {/* 地点 */}
      <Field label="任务地点" error={errors.location}>
        <TextInput
          style={styles.input}
          placeholder="请输入地点（选填）"
          placeholderTextColor={colors.textTertiary}
          value={location}
          maxLength={LOCATION_MAX_LENGTH}
          onChangeText={setLocation}
        />
      </Field>

      {/* 备注 */}
      <Field label="任务备注" error={errors.note}>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="请输入备注（选填）"
          placeholderTextColor={colors.textTertiary}
          value={note}
          maxLength={NOTE_MAX_LENGTH}
          onChangeText={setNote}
          multiline
          textAlignVertical="top"
        />
      </Field>

      {/* 重点任务 */}
      <View style={styles.featuredRow}>
        <View style={styles.featuredLeft}>
          <Ionicons name="star" size={20} color={colors.warning} />
          <Text style={styles.featuredLabel}>设为重点任务</Text>
        </View>
        <Switch
          value={isFeatured}
          onValueChange={setIsFeatured}
          trackColor={{ false: colors.border, true: `${colors.warning}80` }}
          thumbColor={isFeatured ? colors.warning : colors.surface}
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
        activeOpacity={0.8}
      >
        <Text style={styles.submitButtonText}>{submitting ? '提交中...' : submitLabel}</Text>
      </TouchableOpacity>
    </View>
  );
});

type FieldProps = {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
};

function Field({ label, required, error, children }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.requiredMark}> *</Text> : null}
      </Text>
      {children}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  requiredMark: {
    color: colors.warning,
  },
  input: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.textPrimary,
  },
  textarea: {
    height: 96,
    paddingTop: 12,
  },
  counter: {
    alignSelf: 'flex-end',
    marginTop: 4,
    fontSize: 11,
    color: colors.textTertiary,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  categoryChipText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  categoryChipTextActive: {
    color: colors.surface,
    fontWeight: '600',
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeCol: {
    flex: 1,
  },
  errorText: {
    marginTop: 6,
    fontSize: 12,
    color: colors.warning,
  },
  submitButton: {
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  featuredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  featuredLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featuredLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
