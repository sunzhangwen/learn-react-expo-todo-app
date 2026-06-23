import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorState } from '@/components/ErrorState';
import { Loading } from '@/components/Loading';
import { globalStyles } from '@/constants/styles';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useUserProfile } from '@/hooks/useUserProfile';
import { alert, confirmAsync } from '@/utils/alert';

const MENU_ITEMS: { key: string; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'profile', label: '个人资料', icon: 'person-outline' },
  { key: 'stats', label: '数据统计', icon: 'bar-chart-outline' },
  { key: 'messages', label: '我的消息', icon: 'mail-outline' },
  { key: 'settings', label: '设置中心', icon: 'settings-outline' },
  { key: 'help', label: '帮助中心', icon: 'help-circle-outline' },
];

/** 我的页面（需求第 11 节）。 */
export default function ProfileScreen() {
  const router = useRouter();
  const { user, loading, error, refresh } = useUserProfile();
  const { isAuthenticated, logout } = useAuth();
  const { colors } = useTheme();
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const handleMenuPress = useCallback(
    (key: string) => {
      if (key === 'settings') {
        router.push('/settings');
      } else if (key === 'stats') {
        router.push('/stats');
      } else {
        alert('提示', '功能开发中');
      }
    },
    [router],
  );

  const handleLogout = useCallback(() => {
    confirmAsync('退出登录', '确定要退出登录吗？', () => {
      logout()
        .then(() => router.replace('/login'))
        .catch(() => router.replace('/login'));
    });
  }, [logout, router]);

  // 未登录状态。
  if (!loading && !isAuthenticated && !user) {
    return (
      <SafeAreaView style={[globalStyles.safe, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={globalStyles.center}>
          <View style={[styles.notLoggedAvatar, { backgroundColor: colors.backgroundSecondary }]}>
            <Ionicons name="person-outline" size={40} color={colors.textTertiary} />
          </View>
          <Text style={[styles.notLoggedText, { color: colors.textPrimary }]}>你还没有登录</Text>
          <Text style={[styles.notLoggedSubtext, { color: colors.textTertiary }]}>登录后查看个人信息和任务统计</Text>
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/login')}
            activeOpacity={0.85}
          >
            <Text style={styles.loginButtonText}>去登录</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[globalStyles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[globalStyles.header, { borderBottomColor: colors.border }]}>
        <Text style={[globalStyles.headerTitle, { color: colors.textPrimary }]}>我的</Text>
        <TouchableOpacity hitSlop={8}>
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <Loading />
      ) : error && !user ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : user ? (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* 用户信息卡 */}
          <View style={[styles.userCard, { backgroundColor: colors.surface }]}>
            <LinearGradient
              colors={colors.gradient.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{user.name.slice(0, 1)}</Text>
            </LinearGradient>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: colors.textPrimary }]}>{user.name}</Text>
              <View style={styles.idRow}>
                <Ionicons name="copy-outline" size={12} color={colors.textTertiary} />
                <Text style={[styles.userId, { color: colors.textTertiary }]}>ID: {user.id}</Text>
              </View>
              <View style={styles.emailRow}>
                <Ionicons name="mail-outline" size={12} color={colors.textTertiary} />
                <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user.email}</Text>
              </View>
            </View>
          </View>

          {/* 菜单列表 */}
          <View style={[styles.menuCard, { backgroundColor: colors.surface }]}>
            {MENU_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={item.key}
                style={[styles.menuRow, index > 0 && styles.menuRowBorder, { borderTopColor: colors.borderLight }]}
                onPress={() => handleMenuPress(item.key)}
                activeOpacity={0.6}
              >
                <View style={[styles.menuIconContainer, { backgroundColor: `${colors.primary}10` }]}>
                  <Ionicons name={item.icon} size={20} color={colors.primary} />
                </View>
                <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: colors.surface, borderColor: `${colors.danger}30` }]}
            onPress={handleLogout}
            activeOpacity={0.85}
          >
            <Ionicons name="log-out-outline" size={18} color={colors.danger} />
            <Text style={[styles.logoutText, { color: colors.danger }]}>退出登录</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 16,
  },
  notLoggedAvatar: {
    width: 88,
    height: 88,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  notLoggedText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
  },
  notLoggedSubtext: {
    marginTop: 8,
    fontSize: 14,
  },
  loginButton: {
    marginTop: 24,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 12,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 20,
    gap: 16,
    boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.06)',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
    gap: 6,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userId: {
    fontSize: 13,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userEmail: {
    fontSize: 13,
  },
  sectionBlock: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  menuCard: {
    borderRadius: 16,
    paddingHorizontal: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 14,
  },
  menuRowBorder: {
    borderTopWidth: 1,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
