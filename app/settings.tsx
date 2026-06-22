import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemeSelector } from '@/components/ThemeSelector';
import { useTheme } from '@/hooks/useTheme';

/** 设置中心页面 */
export default function SettingsScreen() {
  const router = useRouter();
  const { colors, theme, isDark, toggleMode } = useTheme();
  const [themeModalVisible, setThemeModalVisible] = useState(false);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* 自定义导航栏 */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>设置中心</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 主题设置 */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>外观</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {/* 暗黑模式开关 */}
          <View style={styles.menuRow}>
            <View style={[styles.menuIconContainer, { backgroundColor: `${colors.primary}15` }]}>
              <Ionicons name={isDark ? 'moon' : 'sunny'} size={20} color={colors.primary} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>
              {isDark ? '深色模式' : '浅色模式'}
            </Text>
            <Switch
              value={isDark}
              onValueChange={toggleMode}
              trackColor={{ false: '#E0E0E0', true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.menuRowBorder, { borderTopColor: colors.borderLight }]} />

          {/* 主题颜色选择 */}
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => setThemeModalVisible(true)}
            activeOpacity={0.6}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: `${colors.primary}15` }]}>
              <Ionicons name="color-palette-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>主题颜色</Text>
              <View style={styles.themePreview}>
                <Text style={[styles.themePreviewText, { color: colors.primary }]}>{theme.label}</Text>
                <View style={styles.themePreviewColors}>
                  <View style={[styles.colorDot, { backgroundColor: colors.primary }]} />
                  <View style={[styles.colorDot, { backgroundColor: colors.primaryDark }]} />
                </View>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* 通用设置 */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>通用</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <TouchableOpacity style={styles.menuRow} activeOpacity={0.6}>
            <View style={[styles.menuIconContainer, { backgroundColor: `${colors.primary}15` }]}>
              <Ionicons name="notifications-outline" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>消息通知</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>

          <View style={[styles.menuRow, styles.menuRowBorder, { borderTopColor: colors.borderLight }]}>
            <View style={[styles.menuIconContainer, { backgroundColor: `${colors.primary}15` }]}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>隐私设置</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </View>

          <View style={[styles.menuRow, styles.menuRowBorder, { borderTopColor: colors.borderLight }]}>
            <View style={[styles.menuIconContainer, { backgroundColor: `${colors.primary}15` }]}>
              <Ionicons name="language-outline" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>语言设置</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </View>
        </View>

        {/* 关于 */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>关于</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <TouchableOpacity style={styles.menuRow} activeOpacity={0.6}>
            <View style={[styles.menuIconContainer, { backgroundColor: `${colors.primary}15` }]}>
              <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>关于我们</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>

          <View style={[styles.menuRow, styles.menuRowBorder, { borderTopColor: colors.borderLight }]}>
            <View style={[styles.menuIconContainer, { backgroundColor: `${colors.primary}15` }]}>
              <Ionicons name="document-text-outline" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>用户协议</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </View>

          <View style={[styles.menuRow, styles.menuRowBorder, { borderTopColor: colors.borderLight }]}>
            <View style={[styles.menuIconContainer, { backgroundColor: `${colors.primary}15` }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>隐私政策</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </View>
        </View>

        {/* 版本信息 */}
        <Text style={[styles.version, { color: colors.textTertiary }]}>版本 1.0.0</Text>
      </ScrollView>

      <ThemeSelector visible={themeModalVisible} onClose={() => setThemeModalVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    paddingHorizontal: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  menuRowBorder: {
    borderTopWidth: 1,
  },
  menuIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  themePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themePreviewText: {
    fontSize: 13,
    fontWeight: '500',
  },
  themePreviewColors: {
    flexDirection: 'row',
    gap: 4,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  version: {
    textAlign: 'center',
    fontSize: 13,
    marginTop: 20,
  },
});
