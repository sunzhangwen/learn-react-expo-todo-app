import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';
import { globalStyles } from '@/constants/styles';

/** 日历扩展占位页（需求第 8 节）。 */
export default function CalendarScreen() {
  return (
    <SafeAreaView style={globalStyles.safe} edges={['top']}>
      <View style={globalStyles.center}>
        <View style={styles.card}>
          <Ionicons name="calendar" size={48} color={colors.primary} />
          <Text style={styles.title}>功能开发中</Text>
          <Text style={globalStyles.subtitle}>敬请期待</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 320,
    ...globalStyles.card,
    paddingVertical: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
  },
  title: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
