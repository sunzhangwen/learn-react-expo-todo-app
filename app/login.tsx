import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../src/hooks/useAuth';
import { useRouter } from 'expo-router';
import { colors } from '../src/constants/colors';

export default function Login() {
  const { mockLogin } = useAuth();
  const router = useRouter();

  const handle = async () => {
    await mockLogin();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>待办事项</Text>
        <Text style={styles.subtitle}>Todo App</Text>
        <Text style={styles.tip}>未登录状态</Text>
        <TouchableOpacity style={styles.button} onPress={handle}>
          <Text style={styles.buttonText}>模拟登录</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  tip: {
    fontSize: 14,
    color: colors.textTertiary,
    marginBottom: 32,
  },
  button: {
    paddingHorizontal: 40,
    paddingVertical: 14,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
