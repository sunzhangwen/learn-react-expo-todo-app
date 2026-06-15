import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

interface EmptyStateProps {
  icon?: string;
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon = 'inbox', message = '暂无数据' }) => {
  return (
    <View style={styles.container}>
      <Ionicons name={icon as any} size={48} color={colors.textTertiary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
});
