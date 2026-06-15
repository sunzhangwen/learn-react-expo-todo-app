import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../types/task';
import { colors, categoryColors, categoryNames } from '../constants/colors';

interface TaskCardProps {
  task: Task;
  onPress?: (task: Task) => void;
  onToggleStatus?: (id: string) => void;
  onLongPress?: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onPress, onToggleStatus, onLongPress }) => {
  const catColor = categoryColors[task.category];
  const isCompleted = task.status === 'completed';
  
  const handleToggle = useCallback(() => {
    onToggleStatus?.(task.id);
  }, [task.id, onToggleStatus]);

  return (
    <TouchableOpacity
      style={[styles.card, isCompleted && styles.completedCard]}
      onPress={() => onPress?.(task)}
      onLongPress={() => onLongPress?.(task)}
      delayLongPress={500}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleToggle} style={styles.checkbox}>
          <Ionicons
            name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
            size={24}
            color={isCompleted ? colors.success : colors.border}
          />
        </TouchableOpacity>
        <View style={styles.titleArea}>
          <Text style={[styles.title, isCompleted && styles.titleCompleted]}>{task.title}</Text>
          <View style={styles.meta}>
            <View style={[styles.badge, { backgroundColor: catColor }]}>
              <Text style={styles.badgeText}>{categoryNames[task.category]}</Text>
            </View>
            <Text style={styles.time}>{task.startTime}</Text>
          </View>
        </View>
      </View>
      {(task.location || task.note) && (
        <View style={styles.detail}>
          {task.location && <Text style={styles.detailText}>📍 {task.location}</Text>}
          {task.note && <Text style={styles.detailText} numberOfLines={1}>💬 {task.note}</Text>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  completedCard: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  titleArea: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  detail: {
    marginTop: 8,
    marginLeft: 36,
  },
  detailText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
});
