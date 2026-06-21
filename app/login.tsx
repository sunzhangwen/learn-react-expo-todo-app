import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';
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
        colors={['#4080FF', '#6C5CE7', '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Ionicons name="checkmark-done-circle" size={56} color={colors.surface} />
              </View>
            </View>
            <Text style={styles.appName}>{APP_NAME}</Text>
            <Text style={styles.hint}>
              {isRegisterMode ? '创建新账号开始使用' : '登录后即可管理日程任务'}
            </Text>

            <View style={styles.form}>
              {isRegisterMode && (
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color="rgba(255,255,255,0.5)" />
                  <TextInput
                    style={styles.input}
                    placeholder="请输入用户名"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!submitting}
                  />
                </View>
              )}
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="rgba(255,255,255,0.5)" />
                <TextInput
                  style={styles.input}
                  placeholder="请输入邮箱"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!submitting}
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.5)" />
                <TextInput
                  style={styles.passwordInput}
                  placeholder="请输入密码"
                  placeholderTextColor="rgba(255,255,255,0.5)"
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
                    color="rgba(255,255,255,0.6)"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.button, submitting && styles.buttonDisabled]}
                onPress={isRegisterMode ? handleRegister : handleLogin}
                disabled={submitting}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.15)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  {submitting ? (
                    <Ionicons name="sync-outline" size={20} color={colors.surface} />
                  ) : (
                    <Ionicons
                      name={isRegisterMode ? 'person-add-outline' : 'log-in-outline'}
                      size={20}
                      color={colors.surface}
                    />
                  )}
                  <Text style={styles.buttonText}>
                    {submitting
                      ? isRegisterMode
                        ? '注册中...'
                        : '登录中...'
                      : isRegisterMode
                        ? '注册'
                        : '登录'}
                  </Text>
                </LinearGradient>
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
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.surface,
    letterSpacing: 0.5,
  },
  hint: {
    marginTop: 12,
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
  },
  form: {
    marginTop: 40,
    width: '100%',
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: colors.surface,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: colors.surface,
  },
  eyeButton: {
    paddingHorizontal: 8,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 8,
    width: '100%',
    height: 54,
    borderRadius: 14,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.surface,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  switchButton: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchButtonText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
});
