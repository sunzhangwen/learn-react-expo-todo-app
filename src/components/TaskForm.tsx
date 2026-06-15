import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Task, TaskCategory } from '../types/task';
import { colors, categoryColors, categoryNames } from '../constants/colors';
import { validateTaskForm } from '../utils/validators';

interface TaskFormProps {
  initialData?: Task;
  onSubmit: (data: Partial<Task>) => void;
  onCancel?: () => void;
  submitting?: boolean;
  initialDate?: string;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  submitting = false,
  initialDate,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState<TaskCategory>(initialData?.category || 'work');
  const [startTime, setStartTime] = useState(initialData?.startTime || '09:00');
  const [endTime, setEndTime] = useState(initialData?.endTime || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [note, setNote] = useState(initialData?.note || '');
  const [errors, setErrors] = useState<string[]>([]);

  const validate = useCallback(() => {
    const errs = validateTaskForm(title, startTime, endTime);
    setErrors(errs);
    return errs.length === 0;
  }, [title, startTime, endTime]);

  const handleSubmit = useCallback(() => {
    if (!validate()) return;
    onSubmit({
      title: title.trim(),
      category,
      startTime,
      endTime: endTime || undefined,
      location: location.trim() || undefined,
      note: note.trim() || undefined,
      date: initialData?.date || initialDate || new Date().toISOString().slice(0, 10),
      status: initialData?.status || 'pending',
    });
  }, [title, category, startTime, endTime, location, note, initialData, initialDate, validate, onSubmit]);

  const isFormValid = useMemo(() => {
    return title.trim() && startTime;
  }, [title, startTime]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* 标题 */}
        <View style={styles.section}>
          <Text style={styles.label}>任务标题 *</Text>
          <TextInput
            style={styles.input}
            placeholder="输入任务标题"
            placeholderTextColor={colors.textTertiary}
            value={title}
            onChangeText={setTitle}
            editable={!submitting}
            maxLength={50}
          />
        </View>

        {/* 分类 */}
        <View style={styles.section}>
          <Text style={styles.label}>任务分类 *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={setCategory as any}
              enabled={!submitting}
            >
              {Object.entries(categoryNames).map(([key, name]) => (
                <Picker.Item key={key} label={name} value={key} />
              ))}
            </Picker>
          </View>
        </View>

        {/* 时间 */}
        <View style={styles.section}>
          <View style={styles.timeRow}>
            <View style={styles.timeField}>
              <Text style={styles.label}>开始时间 *</Text>
              <TextInput
                style={styles.input}
                placeholder="HH:mm"
                placeholderTextColor={colors.textTertiary}
                value={startTime}
                onChangeText={setStartTime}
                editable={!submitting}
                maxLength={5}
              />
            </View>
            <View style={styles.timeField}>
              <Text style={styles.label}>结束时间</Text>
              <TextInput
                style={styles.input}
                placeholder="HH:mm"
                placeholderTextColor={colors.textTertiary}
                value={endTime}
                onChangeText={setEndTime}
                editable={!submitting}
                maxLength={5}
              />
            </View>
          </View>
        </View>

        {/* 地点 */}
        <View style={styles.section}>
          <Text style={styles.label}>任务地点</Text>
          <TextInput
            style={styles.input}
            placeholder="输入地点（可选）"
            placeholderTextColor={colors.textTertiary}
            value={location}
            onChangeText={setLocation}
            editable={!submitting}
            maxLength={80}
          />
        </View>

        {/* 备注 */}
        <View style={styles.section}>
          <Text style={styles.label}>任务备注</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="输入备注（可选）"
            placeholderTextColor={colors.textTertiary}
            value={note}
            onChangeText={setNote}
            multiline
            editable={!submitting}
            maxLength={300}
          />
        </View>

        {/* 错误提示 */}
        {errors.length > 0 && (
          <View style={styles.errorBox}>
            {errors.map((err, idx) => (
              <Text key={idx} style={styles.errorText}>
                • {err}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>

      {/* 底部按钮 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
          disabled={submitting}
        >
          <Text style={styles.cancelButtonText}>取消</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            styles.submitButton,
            (!isFormValid || submitting) && styles.disabledButton,
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid || submitting}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? '保存中...' : initialData ? '保存修改' : '保存任务'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pickerContainer: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  timeRow: {
    flexDirection: 'row',
  },
  timeField: {
    flex: 1,
    marginRight: 12,
  },
  errorBox: {
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 12,
    color: colors.warning,
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  submitButton: {
    backgroundColor: colors.primary,
  },
  disabledButton: {
    backgroundColor: colors.textTertiary,
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
