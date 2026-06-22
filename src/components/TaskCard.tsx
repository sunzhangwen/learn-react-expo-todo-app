import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { getCategoryMeta } from '@/constants/categories';
import { useCardHover, Animated } from '@/hooks/useAnimated';
import { useTheme } from '@/hooks/useTheme';
import type { Task } from '@/types/task';

type TaskCardProps = {
  task: Task;
  onPress: (task: Task) => void;
  onLongPress: (task: Task) => void;
  onToggleStatus: (task: Task) => void;
};

function TaskCardComponent({ task, onPress, onLongPress, onToggleStatus }: TaskCardProps) {
  const { colors } = useTheme();
  const category = getCategoryMeta(task.category);
  const completed = task.status === 'completed';
  const timeText = task.endTime ? `${task.startTime} - ${task.endTime}` : task.startTime;
  const { animatedStyle, onPressIn, onPressOut } = useCardHover();

  return (
    <Animated.View style={[styles.card, { backgroundColor: colors.surface }, completed && styles.cardCompleted, animatedStyle]}>
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => onPress(task)}
        onLongPress={() => onLongPress(task)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.9}
      >
      <View style={[styles.categoryBar, { backgroundColor: category.color }]} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text
            style={[styles.title, { color: colors.textPrimary }, completed && { textDecorationLine: 'line-through', color: colors.textTertiary }]}
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
            <Text style={[styles.metaText, { color: colors.textTertiary }]}>{timeText}</Text>
          </View>
          {task.location ? (
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={13} color={colors.textTertiary} />
              <Text style={[styles.metaText, { color: colors.textTertiary }]} numberOfLines={1}>
                {task.location}
              </Text>
            </View>
          ) : null}
          {task.isFeatured ? (
            <View style={[styles.featuredBadge, { backgroundColor: `${colors.warning}12` }]}>
              <Ionicons name="star" size={12} color={colors.warning} />
              <Text style={[styles.featuredText, { color: colors.warning }]}>重点</Text>
            </View>
          ) : null}
        </View>

        {task.note ? (
          <Text style={[styles.note, { color: colors.textTertiary }]} numberOfLines={1}>
            {task.note}
          </Text>
        ) : null}
      </View>

      <TouchableOpacity
        style={styles.statusButton}
        onPress={() => onToggleStatus(task)}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <View style={[styles.statusCircle, { borderColor: colors.border }, completed && { backgroundColor: colors.success, borderColor: colors.success }]}>
          {completed && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
        </View>
      </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

export const TaskCard = memo(TaskCardComponent);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    overflow: 'hidden',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)',
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  featuredText: {
    fontSize: 11,
    fontWeight: '600',
  },
  note: {
    fontSize: 12,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
});
