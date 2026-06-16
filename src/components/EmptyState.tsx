import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';

type EmptyStateProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  message?: string;
};

export function EmptyState({ icon = 'file-tray-outline', message = '暂无数据' }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={56} color={colors.textTertiary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textTertiary,
  },
});
