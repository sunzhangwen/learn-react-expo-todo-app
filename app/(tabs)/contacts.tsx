import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';
import { globalStyles } from '@/constants/styles';

/** 通讯扩展占位页（需求第 8 节）。 */
export default function ContactsScreen() {
  return (
    <SafeAreaView style={globalStyles.safe} edges={['top']}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.headerTitle}>通讯</Text>
      </View>
      <View style={styles.center}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="people" size={40} color={colors.primary} />
          </View>
          <Text style={styles.title}>功能开发中</Text>
          <Text style={styles.subtitle}>敬请期待</Text>
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
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 48,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.06)',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: `${colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: colors.textTertiary,
  },
});
