import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';
import { globalStyles } from '@/constants/styles';
import { APP_NAME } from '@/constants/config';
import { useAuth } from '@/hooks/useAuth';

/** 登录页 / 未登录占位（需求第 12 节）。 */
export default function LoginScreen() {
  const router = useRouter();
  const { mockLogin } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const handleMockLogin = useCallback(async () => {
    setSubmitting(true);
    try {
      await mockLogin();
      router.replace('/(tabs)');
    } finally {
      setSubmitting(false);
    }
  }, [mockLogin, router]);

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={[colors.primary, '#6C5CE7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.container}>
          <View style={styles.logo}>
            <Ionicons name="checkmark-done-circle" size={64} color={colors.surface} />
          </View>
          <Text style={styles.appName}>{APP_NAME}</Text>
          <Text style={styles.hint}>你还未登录，登录后即可管理日程任务</Text>

          <TouchableOpacity
            style={[styles.button, submitting && styles.buttonDisabled]}
            onPress={handleMockLogin}
            disabled={submitting}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[colors.primary, '#6C5CE7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={globalStyles.primaryButtonText}>{submitting ? '登录中...' : '模拟登录'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  logo: {
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.surface,
  },
  hint: {
    marginTop: 12,
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  button: {
    marginTop: 40,
    width: '100%',
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
