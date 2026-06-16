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
      activeOpacity={0.8}
    >
      <View style={[styles.categoryBar, { backgroundColor: category.color }]} />
      <View style={styles.body}>
        <View style={styles.headerRow}>
          <Text
            style={[styles.title, completed && styles.titleCompleted]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          <View style={[styles.categoryTag, { backgroundColor: `${category.color}1A` }]}>
            <Text style={[styles.categoryText, { color: category.color }]}>{category.label}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
          <Text style={styles.metaText}>{timeText}</Text>
          {task.location ? (
            <>
              <Ionicons
                name="location-outline"
                size={14}
                color={colors.textTertiary}
                style={styles.metaIconSpacing}
              />
              <Text style={styles.metaText} numberOfLines={1}>
                {task.location}
              </Text>
            </>
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
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons
          name={completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={26}
          color={completed ? colors.success : colors.textTertiary}
        />
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
    borderRadius: 8,
    padding: 12,
    overflow: 'hidden',
  },
  cardCompleted: {
    opacity: 0.6,
  },
  categoryBar: {
    width: 4,
    alignSelf: 'stretch',
    borderRadius: 2,
    marginRight: 12,
  },
  body: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginRight: 8,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  metaIconSpacing: {
    marginLeft: 12,
  },
  note: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 6,
  },
  statusButton: {
    paddingLeft: 12,
  },
});
