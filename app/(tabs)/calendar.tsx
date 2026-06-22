import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { globalStyles } from '@/constants/styles';
import { useTheme } from '@/hooks/useTheme';

/** 日历扩展占位页（需求第 8 节）。 */
export default function CalendarScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[globalStyles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[globalStyles.header, { borderBottomColor: colors.border }]}>
        <Text style={[globalStyles.headerTitle, { color: colors.textPrimary }]}>日历</Text>
      </View>
      <View style={styles.center}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
          <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}10` }]}>
            <Ionicons name="calendar" size={40} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>功能开发中</Text>
          <Text style={[styles.subtitle, { color: colors.textTertiary }]}>敬请期待</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 20,
    paddingVertical: 48,
    alignItems: 'center',
    borderWidth: 1,
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.06)',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
  },
});
