import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/constants/colors';
import { getCategoryMeta } from '@/constants/categories';
import type { Task } from '@/types/task';

type TaskCardProps = {
  task: Task;
  onPress: (task: Task) => void;
  onLongPress: (task: Task) => void;
  onToggleStatus: (task: Task) => void;
};

function TaskCardComponent({ task, onPress, onLongPress, onToggleStatus }: TaskCardProps) {
  const category = getCategoryMeta(task.category);
  const completed = task.status === 'completed';
  const timeText = task.endTime ? `${task.startTime} - ${task.endTime}` : task.startTime;

  return (
    <TouchableOpacity
      style={[styles.card, completed && styles.cardCompleted]}
      onPress={() => onPress(task)}
      onLongPress={() => onLongPress(task)}
      activeOpacity={0.7}
    >
      <View style={[styles.categoryBar, { backgroundColor: category.color }]} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text
            style={[styles.title, completed && styles.titleCompleted]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          <View style={[styles.categoryTag, { backgroundColor: `${category.color}15` }]}>
            <Ionicons name={category.icon || 'folder-outline'} size={12} color={category.color} />
            <Text style={[styles.categoryText, { color: category.color }]}>{category.label}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={13} color={colors.textTertiary} />
            <Text style={styles.metaText}>{timeText}</Text>
          </View>
          {task.location ? (
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={13} color={colors.textTertiary} />
              <Text style={styles.metaText} numberOfLines={1}>
                {task.location}
              </Text>
            </View>
          ) : null}
          {task.isFeatured ? (
            <View style={styles.featuredBadge}>
              <Ionicons name="star" size={12} color={colors.warning} />
              <Text style={styles.featuredText}>重点</Text>
            </View>
          ) : null}
        </View>

        {task.note ? (
          <Text style={styles.note} numberOfLines={1}>
            {task.note}
          </Text>
        ) : null}
      </View>

      <TouchableOpacity
        style={styles.statusButton}
        onPress={() => onToggleStatus(task)}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <View style={[styles.statusCircle, completed && styles.statusCircleCompleted]}>
          {completed && <Ionicons name="checkmark" size={16} color={colors.surface} />}
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export const TaskCard = memo(TaskCardComponent);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    overflow: 'hidden',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)',
  },
  cardCompleted: {
    opacity: 0.65,
  },
  categoryBar: {
    width: 4,
    alignSelf: 'stretch',
    borderRadius: 2,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: `${colors.warning}12`,
    borderRadius: 4,
  },
  featuredText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.warning,
  },
  note: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 8,
    lineHeight: 16,
  },
  statusButton: {
    paddingLeft: 12,
  },
  statusCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCircleCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
});
