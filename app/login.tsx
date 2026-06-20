import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';
import { globalStyles } from '@/constants/styles';
import { APP_NAME, USE_MOCK } from '@/constants/config';
import { useAuth } from '@/hooks/useAuth';
import { register } from '@/services/userService';
import { alert, confirmAsync } from '@/utils/alert';

/** 简单邮箱格式校验。 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 登录/注册页（需求第 12 节）。USE_MOCK 时支持模拟登录。 */
export default function LoginScreen() {
  const router = useRouter();
  const { login, mockLogin } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = useCallback(async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      alert('提示', '请输入邮箱');
      return;
    }
    if (!EMAIL_RE.test(trimmedEmail)) {
      alert('提示', '请输入正确的邮箱格式');
      return;
    }
    if (!trimmedPassword) {
      alert('提示', '请输入密码');
      return;
    }

    setSubmitting(true);
    try {
      if (USE_MOCK) {
        await mockLogin();
      } else {
        await login(trimmedEmail, trimmedPassword);
      }
      router.replace('/(tabs)');
    } catch (e) {
      alert('登录失败', e instanceof Error ? e.message : '请稍后重试');
    } finally {
      setSubmitting(false);
    }
  }, [email, password, login, mockLogin, router]);

  const handleRegister = useCallback(async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedName) {
      alert('提示', '请输入用户名');
      return;
    }
    if (!trimmedEmail) {
      alert('提示', '请输入邮箱');
      return;
    }
    if (!EMAIL_RE.test(trimmedEmail)) {
      alert('提示', '请输入正确的邮箱格式');
      return;
    }
    if (!trimmedPassword) {
      alert('提示', '请输入密码');
      return;
    }
    if (trimmedPassword.length < 6) {
      alert('提示', '密码长度至少6位');
      return;
    }

    setSubmitting(true);
    try {
      await register({ name: trimmedName, email: trimmedEmail, password: trimmedPassword });
      confirmAsync('注册成功', '请使用新账号登录', () => {
        setIsRegisterMode(false);
        setEmail('');
        setPassword('');
        setName('');
      });
    } catch (e) {
      alert('注册失败', e instanceof Error ? e.message : '请稍后重试');
    } finally {
      setSubmitting(false);
    }
  }, [name, email, password]);

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={[colors.primary, '#6C5CE7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <KeyboardAvoidingView style={styles.flex} behavior="padding">
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.logo}>
              <Ionicons name="checkmark-done-circle" size={64} color={colors.surface} />
            </View>
            <Text style={styles.appName}>{APP_NAME}</Text>
            <Text style={styles.hint}>{isRegisterMode ? '注册新账号' : '登录后即可管理日程任务'}</Text>

            <View style={styles.form}>
              {isRegisterMode && (
                <TextInput
                  style={styles.input}
                  placeholder="请输入用户名"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!submitting}
                />
              )}
              <TextInput
                style={styles.input}
                placeholder="请输入邮箱"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!submitting}
              />
              <View style={styles.passwordRow}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="请输入密码"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!submitting}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword((v) => !v)}
                  hitSlop={8}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="rgba(255,255,255,0.7)"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.button, submitting && styles.buttonDisabled]}
                onPress={isRegisterMode ? handleRegister : handleLogin}
                disabled={submitting}
                activeOpacity={0.85}
              >
                <View style={styles.buttonInner}>
                  <Text style={globalStyles.primaryButtonText}>
                    {submitting ? (isRegisterMode ? '注册中...' : '登录中...') : (isRegisterMode ? '注册' : '登录')}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.switchButton}
                onPress={() => setIsRegisterMode(!isRegisterMode)}
                disabled={submitting}
              >
                <Text style={styles.switchButtonText}>
                  {isRegisterMode ? '已有账号？去登录' : '没有账号？去注册'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  flex: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 120,
    paddingBottom: 40,
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
  form: {
    marginTop: 32,
    width: '100%',
    gap: 14,
  },
  input: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    fontSize: 15,
    color: colors.surface,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  passwordInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 15,
    color: colors.surface,
  },
  eyeButton: {
    paddingHorizontal: 14,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 6,
    width: '100%',
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  switchButton: {
    marginTop: 8,
    alignItems: 'center',
  },
  switchButtonText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
});
