import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryCards } from '@/components/CategoryCards';
import { ErrorState } from '@/components/ErrorState';
import { Loading } from '@/components/Loading';
import { StatsRow } from '@/components/StatsRow';
import { colors } from '@/constants/colors';
import { globalStyles } from '@/constants/styles';
import { useAuth } from '@/hooks/useAuth';
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

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const handleMenuPress = useCallback(() => {
    alert('提示', '功能开发中');
  }, []);

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
      <SafeAreaView style={globalStyles.safe} edges={['top']}>
        <View style={globalStyles.center}>
          <View style={styles.notLoggedAvatar}>
            <Ionicons name="person-outline" size={40} color={colors.textTertiary} />
          </View>
          <Text style={styles.notLoggedText}>你还没有登录</Text>
          <Text style={styles.notLoggedSubtext}>登录后查看个人信息和任务统计</Text>
          <TouchableOpacity
            style={styles.loginButton}
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
    <SafeAreaView style={globalStyles.safe} edges={['top']}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.headerTitle}>我的</Text>
        <TouchableOpacity onPress={handleMenuPress} hitSlop={8}>
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
          <View style={styles.userCard}>
            <LinearGradient
              colors={colors.gradient.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{user.name.slice(0, 1)}</Text>
            </LinearGradient>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <View style={styles.idRow}>
                <Ionicons name="copy-outline" size={12} color={colors.textTertiary} />
                <Text style={styles.userId}>ID: {user.id}</Text>
              </View>
              <View style={styles.emailRow}>
                <Ionicons name="mail-outline" size={12} color={colors.textTertiary} />
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
            </View>
          </View>

          <StatsRow
            items={[
              { label: '今日待办', value: user.stats.todayPending, icon: 'today-outline', color: colors.primary },
              { label: '发布事项', value: user.stats.totalPublished, icon: 'document-text-outline', color: colors.textSecondary },
              { label: '已完成', value: user.stats.totalCompleted, icon: 'checkmark-circle-outline', color: colors.success },
            ]}
          />

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>分类统计</Text>
            <CategoryCards counts={user.categories} />
          </View>

          {/* 菜单列表 */}
          <View style={styles.menuCard}>
            {MENU_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={item.key}
                style={[styles.menuRow, index > 0 && styles.menuRowBorder]}
                onPress={handleMenuPress}
                activeOpacity={0.6}
              >
                <View style={styles.menuIconContainer}>
                  <Ionicons name={item.icon} size={20} color={colors.primary} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.85}>
            <Ionicons name="log-out-outline" size={18} color={colors.danger} />
            <Text style={styles.logoutText}>退出登录</Text>
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
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  notLoggedText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  notLoggedSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textTertiary,
  },
  loginButton: {
    marginTop: 24,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
    boxShadow: '0px 4px 12px rgba(64, 128, 255, 0.3)',
  },
  loginButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
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
    color: colors.surface,
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
    color: colors.textPrimary,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userId: {
    fontSize: 13,
    color: colors.textTertiary,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  sectionBlock: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  menuCard: {
    backgroundColor: colors.surface,
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
    borderTopColor: colors.borderLight,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: `${colors.danger}30`,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.danger,
  },
});
