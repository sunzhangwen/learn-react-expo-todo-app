import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserProfile } from '../../src/hooks/useUserProfile';
import { useAuth } from '../../src/hooks/useAuth';
import { useTasks } from '../../src/hooks/useTasks';
import { Loading } from '../../src/components/Loading';
import { colors, categoryNames } from '../../src/constants/colors';

export default function Profile() {
  const router = useRouter();
  const { user, loading } = useUserProfile();
  const { logout } = useAuth();
  const { tasks } = useTasks();

  const handleLogout = useCallback(() => {
    Alert.alert('退出登录', '确定要退出登录吗？', [
      { text: '取消' },
      {
        text: '退出',
        onPress: async () => {
          await logout();
          router.replace('/login');
        },
      },
    ]);
  }, [logout, router]);

  const handleMenuPress = (menuName: string) => {
    Alert.alert('提示', '功能开发中');
  };

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.unloggedContainer}>
          <Ionicons name="person-circle" size={64} color={colors.textTertiary} />
          <Text style={styles.unloggedText}>未登录</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.replace('/login')}
          >
            <Text style={styles.loginButtonText}>前往登录</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const stats = user.stats;
  const categories = user.categories;

  const menuItems = [
    { icon: 'person', label: '个人资料' },
    { icon: 'bar-chart', label: '数据统计' },
    { icon: 'mail', label: '我的消息' },
    { icon: 'settings', label: '设置中心' },
    { icon: 'help-circle', label: '帮助中心' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={[1]}
        renderItem={() => (
          <>
            {/* 标题 */}
            <View style={styles.header}>
              <Text style={styles.title}>我的</Text>
              <TouchableOpacity>
                <Ionicons name="ellipsis-vertical" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* 用户卡片 */}
            <View style={styles.userCard}>
              <View style={styles.userAvatar}>
                <Ionicons name="person" size={40} color="#fff" />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userId}>ID: {user.id}</Text>
              </View>
            </View>

            {/* 统计 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>统计</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{stats.todayPending}</Text>
                  <Text style={styles.statLabel}>今日待办</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{stats.totalPublished}</Text>
                  <Text style={styles.statLabel}>发布事项</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{stats.totalCompleted}</Text>
                  <Text style={styles.statLabel}>已完成</Text>
                </View>
              </View>
            </View>

            {/* 分类 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>分类统计</Text>
              <View style={styles.categoryGrid}>
                <View style={styles.categoryBox}>
                  <Text style={styles.categoryValue}>{categories.work}</Text>
                  <Text style={styles.categoryLabel}>{categoryNames.work}事项</Text>
                </View>
                <View style={styles.categoryBox}>
                  <Text style={styles.categoryValue}>{categories.personal}</Text>
                  <Text style={styles.categoryLabel}>{categoryNames.personal}事项</Text>
                </View>
                <View style={styles.categoryBox}>
                  <Text style={styles.categoryValue}>{categories.activity}</Text>
                  <Text style={styles.categoryLabel}>{categoryNames.activity}事项</Text>
                </View>
              </View>
            </View>

            {/* 菜单 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>菜单</Text>
              {menuItems.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.menuItem}
                  onPress={() => handleMenuPress(item.label)}
                >
                  <View style={styles.menuItemLeft}>
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color={colors.primary}
                      style={styles.menuIcon}
                    />
                    <Text style={styles.menuLabel}>{item.label}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                </TouchableOpacity>
              ))}
            </View>

            {/* 退出登录按钮 */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>退出登录</Text>
            </TouchableOpacity>

            {/* 底部间距 */}
            <View style={{ height: 20 }} />
          </>
        )}
        keyExtractor={() => 'profile'}
        scrollEnabled={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginVertical: 12,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  userId: {
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 2,
  },
  section: {
    marginHorizontal: 20,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  categoryLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  logoutButton: {
    marginHorizontal: 20,
    marginVertical: 12,
    paddingVertical: 12,
    backgroundColor: colors.warning,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  unloggedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unloggedText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
  },
  loginButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  loginButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
